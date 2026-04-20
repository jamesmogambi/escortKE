// lib/scrapers/nairobihot-db.service.ts
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { NairobiHotEscort } from "./nairobihot.scrapers";
import {
  Escort,
  Location,
  Rate,
  OpeningHours,
  Plan,
} from "@/server-actions/escort.action";

export class NairobiHotDatabaseService {
  static async escortExists(username: string): Promise<boolean> {
    try {
      const escortRef = doc(db, "escorts", username);
      const escortDoc = await getDoc(escortRef);
      return escortDoc.exists();
    } catch (error) {
      console.error("Error checking escort existence:", error);
      return false;
    }
  }

  static convertToEscortModel(
    scrapedData: Partial<NairobiHotEscort>,
    fullDetails?: Partial<NairobiHotEscort>,
  ): Escort {
    const now = new Date();
    const merged = { ...scrapedData, ...fullDetails };

    // Create location object
    const locations: Location[] = [
      {
        region: merged.town || merged.county || "Nairobi",
        town: merged.town || "",
        estate: "",
        address: "",
        street: "",
        postalCode: "",
        isActive: true,
        notes: "",
      },
    ];

    // Create rates
    const rates: Rate[] = [];
    if (merged.incallRate || merged.outcallRate) {
      rates.push({
        duration: "1 hour",
        incall: merged.incallRate || "ASK",
        outcall: merged.outcallRate || "ASK",
      });
    }

    // Create opening hours
    const openingHours: OpeningHours = {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    };

    // Create plan
    const plan: Plan = {
      type: "free",
      isActive: true,
      features: [],
    };

    return {
      id: merged.id || merged.username || "",
      name: merged.name || "",
      username: merged.username || "",
      previewPhoto: merged.previewPhoto || "",
      labels: merged.isVip ? ["VIP"] : [],
      email: `${merged.username}@nairobihot.com`,
      age: merged.age || "",
      telephone: merged.telephone || "",
      whatsappPhone: merged.telephone || "",
      images: merged.images || [],
      videos: [],
      about: merged.about || merged.description || "",
      availability: ["24/7"],
      ethnicity: "African",
      nationality: merged.nationality || "Kenyan",
      bustSize: "",
      weight: "",
      zodiacSign: "",
      sexualOrientation: merged.sexualOrientation || "Straight",
      gender: merged.gender || "Female",
      languages: ["English", "Swahili"],
      categories: merged.services || [],
      country: "Kenya",
      county: merged.county || "Nairobi",
      countyCode: (merged.county || "Nairobi")
        .toLowerCase()
        .replace(/\s+/g, "_"),
      regions: [merged.county || "Nairobi"],
      primaryRegion: merged.town || merged.county || "Nairobi",
      locations: locations,
      source: "nairobihot.com",
      practices: merged.services || [],
      bdsm: [],
      massage: (merged.services || []).filter((s) =>
        s.toLowerCase().includes("massage"),
      ),
      extraServices: [],
      slug: merged.username || "",
      role: "escort",
      openingHours: openingHours,
      rates: rates,
      breastSize: "",
      ageCategory: merged.age
        ? parseInt(merged.age) < 25
          ? "Young"
          : parseInt(merged.age) < 35
            ? "Adult"
            : "Mature"
        : "",
      character: "",
      hairColor: "",
      experience: "",
      workType: "Independent",
      isAgencyFeatured: merged.isVip || false,
      isActive: true,
      isVerified: false,
      isFeatured: merged.isVip || false,
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
    scrapedData: Partial<NairobiHotEscort>,
    fullDetails?: Partial<NairobiHotEscort>,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const escortId = scrapedData.id || scrapedData.username;
      if (!escortId) {
        return { success: false, error: "No escort ID" };
      }

      // Convert to full Escort model
      const escort = this.convertToEscortModel(scrapedData, fullDetails);

      // Save to Firestore
      const escortRef = doc(db, "escorts", escortId);
      await setDoc(escortRef, escort, { merge: true });

      return { success: true };
    } catch (error) {
      console.error(`Error saving escort ${scrapedData.name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async saveEscorts(
    escorts: Partial<NairobiHotEscort>[],
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const escort of escorts) {
      const result = await this.saveEscort(escort);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }
}
