// lib/scrapers/rahaescorts-db.service.ts
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { RahaEscort } from "./rahaescorts.scraper";
import {
  Escort,
  Location,
  Rate,
  OpeningHours,
  Plan,
} from "@/server-actions/escort.action";

export class RahaEscortsDatabaseService {
  static async escortExists(slug: string): Promise<boolean> {
    try {
      const escortRef = doc(db, "escorts", slug);
      const escortDoc = await getDoc(escortRef);
      return escortDoc.exists();
    } catch (error) {
      console.error("Error checking escort existence:", error);
      return false;
    }
  }

  static async getCountyByName(countyName: string): Promise<string | null> {
    try {
      const countiesRef = collection(db, "counties");
      const q = query(countiesRef, where("name", "==", countyName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }

      const countyCode = countyName.toLowerCase().replace(/\s+/g, "_");
      const q2 = query(countiesRef, where("code", "==", countyCode));
      const querySnapshot2 = await getDocs(q2);

      if (!querySnapshot2.empty) {
        return querySnapshot2.docs[0].id;
      }

      return null;
    } catch (error) {
      console.error("Error getting county:", error);
      return null;
    }
  }

  private static getAgeCategory(age: string): string {
    if (!age) return "";
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum)) return "";
    if (ageNum < 25) return "Young";
    if (ageNum < 35) return "Adult";
    return "Mature";
  }

  private static cleanPhoneNumber(phone: string): string {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    if (!cleaned.startsWith("254") && cleaned.length === 9) {
      cleaned = "254" + cleaned;
    }
    return cleaned;
  }

  static convertToEscortModel(
    scrapedData: Partial<RahaEscort>,
    fullDetails: Partial<RahaEscort>,
  ): Escort {
    const now = new Date();
    const merged = { ...scrapedData, ...fullDetails };

    const validAge =
      merged.age &&
      !isNaN(parseInt(merged.age, 10)) &&
      parseInt(merged.age, 10) >= 18 &&
      parseInt(merged.age, 10) <= 65
        ? merged.age
        : "";

    const cleanTelephone = this.cleanPhoneNumber(merged.telephone || "");
    const cleanWhatsapp = merged.whatsappPhone
      ? this.cleanPhoneNumber(merged.whatsappPhone)
      : cleanTelephone;

    // Create location object matching your Location interface
    // Use only fields that exist in the merged object
    const locations: Location[] = [
      {
        region: merged.regionId || merged.region || merged.county || "",
        town: merged.town || merged.region || "",
        estate: merged.city || "",
        address: "", // Default empty string since not in scraper data
        street: "", // Default empty string since not in scraper data
        postalCode: "", // Default empty string since not in scraper data
        isActive: true,
        notes: "", // Default empty string since not in scraper data
      },
    ];

    const rates: Rate[] = (merged.rates || [])
      .filter(
        (rate) =>
          rate.duration && rate.duration !== "Duration" && rate.duration !== "",
      )
      .map((rate) => ({
        duration: rate.duration,
        incall: rate.incall || "ASK",
        outcall: rate.outcall || "ASK",
      }));

    const openingHours: OpeningHours = {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    };

    const plan: Plan = {
      type: merged.isPremium ? "premium" : merged.isVip ? "vip" : "free",
      isActive: true,
      features: [],
    };

    const isFeatured = merged.isVip || merged.isPremium || false;

    return {
      id: merged.slug || "",
      name: merged.name || "",
      username: merged.slug || "",
      previewPhoto: merged.previewPhoto || merged.images?.[0] || "",
      labels: merged.labels || [],
      email: `${merged.slug}@rahaescorts.com`,
      age: validAge,
      telephone: cleanTelephone,
      whatsappPhone: cleanWhatsapp,
      images: merged.images || [],
      videos: [],
      about: merged.about || "",
      availability: merged.availability ? [merged.availability] : ["24/7"],
      ethnicity: merged.ethnicity || "",
      nationality: merged.nationality || "Kenyan",
      bustSize: merged.bustSize || "",
      weight: "",
      zodiacSign: "",
      sexualOrientation: merged.sexualOrientation || "Straight",
      gender: merged.gender || "Female",
      languages: merged.languages || ["English", "Swahili"],
      categories: merged.practices || [],
      country: "Kenya",
      county: merged.county || "",
      countyCode: (merged.county || "").toLowerCase().replace(/\s+/g, "_"),
      regions: [merged.regionId || merged.region || merged.county || ""].filter(
        (r) => r,
      ),
      primaryRegion: merged.region || merged.county || "",
      locations: locations,
      source: "rahaescorts.com",
      practices: merged.practices || [],
      bdsm: [],
      massage: (merged.practices || []).filter((p) =>
        p.toLowerCase().includes("massage"),
      ),
      extraServices: merged.extraServices || [],
      slug: merged.slug || "",
      role: "escort",
      openingHours: openingHours,
      rates: rates,
      breastSize: merged.bustSize || "",
      ageCategory: this.getAgeCategory(validAge),
      character: "",
      hairColor: "",
      experience: "",
      workType: merged.isPremium
        ? "Premium"
        : merged.isVip
          ? "VIP"
          : "Independent",
      isAgencyFeatured: isFeatured,
      isActive: true,
      isVerified: merged.isVerified || false,
      isFeatured: isFeatured,
      plan: plan,
      totalBookings: 0,
      totalReviews: 0,
      rating: 0,
      totalViews: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  static async saveEscort(
    scrapedData: Partial<RahaEscort>,
    fullDetails: Partial<RahaEscort>,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const escortId = fullDetails.slug || scrapedData.slug;
      if (!escortId) {
        return { success: false, error: "No escort slug provided" };
      }

      const escort = this.convertToEscortModel(scrapedData, fullDetails);

      if (!escort.telephone) {
        console.log(`⚠️ No phone number for ${escort.name}, skipping save`);
        return { success: false, error: "No phone number provided" };
      }

      const escortRef = doc(db, "escorts", escortId);
      await setDoc(escortRef, escort, { merge: true });

      console.log(
        `✅ Saved: ${escort.name} | Age: ${escort.age || "N/A"} | Gender: ${escort.gender} | Images: ${escort.images.length}`,
      );
      return { success: true };
    } catch (error) {
      console.error(`Error saving escort ${scrapedData.name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
