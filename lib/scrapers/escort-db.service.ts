// lib/scrapers/escort-db.service.ts
import { Types } from "mongoose";
import { connectToDB } from "@/lib/mongoose";
// import Escort from "@/models/escort.model";
import { County, ICounty } from "@/models/County";
import { Region } from "@/models/Region";
import { Escort254Parser, ScrapedEscort } from "./escort254.parser";
import Escort from "@/models/Escort";
// import { ScrapedEscort } from "./escort254.parser";
// import { Escort254Parser } from "./escort254.parser";

export class EscortDatabaseService {
  /**
   * Get county by name from database
   */
  static async getCountyByName(
    countyName: string,
  ): Promise<Types.ObjectId | null> {
    await connectToDB();

    // Normalize county name for searching
    let searchName = countyName.trim();

    // Try exact match first
    let county: any = await County.findOne({
      name: { $regex: new RegExp(`^${searchName}$`, "i") },
    });

    // If not found, try with "County" suffix
    if (!county && !searchName.includes("County")) {
      county = await County.findOne({
        name: { $regex: new RegExp(`^${searchName} County$`, "i") },
      });
    }

    // If not found, try without "County" suffix
    if (!county && searchName.includes("County")) {
      const withoutCounty = searchName.replace(/\s+County$/, "");
      county = await County.findOne({
        name: { $regex: new RegExp(`^${withoutCounty}$`, "i") },
      });
    }

    // If still not found, try the countyCode mapping
    if (!county) {
      const countyCodeMap: Record<string, string> = {
        "Nairobi City": "047",
        Mombasa: "001",
        Kisumu: "042",
        Nakuru: "032",
        Kiambu: "022",
        Kisii: "045",
        "Uasin Gishu": "028",
        Bungoma: "009",
        Machakos: "015",
        Kajiado: "034",
        "Trans Nzoia": "026",
        Kilifi: "003",
        Kwale: "002",
        Narok: "033",
        Nyeri: "036",
        Meru: "012",
        Kericho: "035",
        Kakamega: "011",
      };

      const code = countyCodeMap[searchName];
      if (code) {
        county = await County.findOne({ code });
      }
    }

    return county ? county._id : null;
  }

  /**
   * Get or create region by name and county
   */
  static async getOrCreateRegion(
    regionName: string,
    countyId: Types.ObjectId,
  ): Promise<{ _id: Types.ObjectId; countyCode: string }> {
    await connectToDB();

    // Get county to access its code
    const county = await County.findById(countyId);
    if (!county) {
      throw new Error(`County not found with ID: ${countyId}`);
    }

    // Clean region name - remove "County" suffix if present
    let cleanRegionName = regionName.replace(/\s+County$/, "").trim();

    // Handle special cases
    if (cleanRegionName.toLowerCase().includes("nairobi")) {
      cleanRegionName = "Nairobi City";
    }

    // Try to find existing region
    let region = await Region.findOne({
      name: { $regex: new RegExp(`^${cleanRegionName}$`, "i") },
      countyCode: county.code,
    });

    // If not found, create new region
    if (!region) {
      region = await Region.create({
        name: cleanRegionName,
        countyCode: county.code,
        isActive: true,
      });
      console.log(`🏙️ Created new region: ${cleanRegionName} (${county.code})`);
    }

    return {
      _id: region._id,
      countyCode: region.countyCode,
    };
  }

  /**
   * Check if escort is female
   */
  //   static isFemaleEscort(scraped: ScrapedEscort): boolean {
  //     const text = `${scraped.name} ${scraped.description}`.toLowerCase();

  //     // Keywords that indicate male or transgender
  //     const maleKeywords = [
  //       "male",
  //       "boy",
  //       "guy",
  //       "man",
  //       "sir",
  //       "mister",
  //       "mr.",
  //       "stud",
  //     ];
  //     const transKeywords = [
  //       "trans",
  //       "tscort",
  //       "shemale",
  //       "ladyboy",
  //       "transgender",
  //     ];
  //     const femaleKeywords = [
  //       "girl",
  //       "lady",
  //       "woman",
  //       "female",
  //       "ms.",
  //       "mrs.",
  //       "miss",
  //       "escort girl",
  //       "call girl",
  //     ];

  //     // Check for male indicators (excluding female context)
  //     for (const keyword of maleKeywords) {
  //       if (text.includes(keyword) && !text.includes(`${keyword}friend`)) {
  //         // Don't flag if it's "boyfriend" in context of girlfriend experience
  //         if (keyword === "boy" && text.includes("girlfriend experience")) {
  //           continue;
  //         }
  //         return false;
  //       }
  //     }

  //     // Check for transgender
  //     for (const keyword of transKeywords) {
  //       if (text.includes(keyword)) {
  //         return false;
  //       }
  //     }

  //     // Check for female indicators
  //     for (const keyword of femaleKeywords) {
  //       if (text.includes(keyword)) {
  //         return true;
  //       }
  //     }

  //     // Default to true if no male indicators found and name sounds female
  //     const femaleNamePatterns = [
  //       /[aeiou]a$/, // ends with a, e, i, o, u + a (typical female ending)
  //       /^miss/i,
  //       /^ms\./i,
  //       /^mrs\./i,
  //     ];

  //     for (const pattern of femaleNamePatterns) {
  //       if (pattern.test(scraped.name)) {
  //         return true;
  //       }
  //     }

  //     return true; // Default to female
  //   }
  // In lib/scrapers/escort-db.service.ts
  static isFemaleEscort(scraped: ScrapedEscort): boolean {
    const text = `${scraped.name} ${scraped.description}`.toLowerCase();

    // Explicit male indicators - only skip if clearly male
    const explicitMaleKeywords = [
      "male escort",
      "male masseur",
      "ladies only", // This indicates the escort serves ladies, not that they're male
      "women only",
      "gay escort",
      "sir",
      "mr.",
    ];

    for (const keyword of explicitMaleKeywords) {
      if (text.includes(keyword)) {
        return false;
      }
    }

    // Skip transgender only if explicitly stated
    if (
      text.includes("transgender") ||
      text.includes("transsexual") ||
      text.includes("shemale") ||
      text.includes("ladyboy")
    ) {
      return false;
    }

    // Check for female indicators
    const femaleKeywords = [
      "escort girl",
      "call girl",
      "ms.",
      "mrs.",
      "miss",
      "lady",
      "girlfriend",
      "diva",
      "babe",
    ];

    for (const keyword of femaleKeywords) {
      if (text.includes(keyword)) {
        return true;
      }
    }

    // Check name endings for female names
    const femaleNameEndings = ["a", "e", "i", "y"];
    const lastNameChar = scraped.name.slice(-1).toLowerCase();
    if (femaleNameEndings.includes(lastNameChar) && !text.includes("male")) {
      return true;
    }

    // Default to true for this site since it's primarily female escorts
    return true;
  }
  /**
   * Save or update escort from scraped data
   */
  static async saveEscort(
    scraped: ScrapedEscort,
  ): Promise<{ success: boolean; error?: string }> {
    await connectToDB();

    try {
      // Filter for female escorts only
      if (!this.isFemaleEscort(scraped)) {
        console.log(`⏭️ Skipping male/trans escort: ${scraped.name}`);
        return { success: false, error: "Not female escort" };
      }

      // Get county from database
      const countyId = await this.getCountyByName(scraped.countyName);
      if (!countyId) {
        console.log(
          `⚠️ County not found: ${scraped.countyName} - Skipping ${scraped.name}`,
        );
        return { success: false, error: "County not found" };
      }

      // Parse location details
      const locationDetails = Escort254Parser.parseLocationDetails(
        scraped.location,
      );

      // Determine primary region name
      let regionName = locationDetails.region || scraped.countyName;

      // Handle Nairobi special case
      if (regionName.toLowerCase().includes("nairobi")) {
        regionName = "Nairobi City";
      }

      // Get or create region
      const { _id: regionId, countyCode } = await this.getOrCreateRegion(
        regionName,
        countyId,
      );

      // Parse services from description
      const services = Escort254Parser.parseServices(scraped.description);

      // Check if escort already exists by phone or profile URL
      const existingEscort = await Escort.findOne({
        $or: [
          { telephone: scraped.telephone },
          { slug: this.generateSlug(scraped.name, scraped.telephone) },
        ],
      });

      // Prepare location data
      const location: any = {
        region: regionId,
        town: locationDetails.town || regionName,
        estate: locationDetails.estate || "",
        isActive: !scraped.isOffline,
        address: "",
        street: "",
        postalCode: "",
        notes: scraped.location,
      };

      if (existingEscort) {
        // Update existing escort
        existingEscort.name = scraped.name;
        existingEscort.previewPhoto =
          scraped.previewPhoto || existingEscort.previewPhoto;
        existingEscort.about = scraped.description || existingEscort.about;
        existingEscort.isActive = !scraped.isOffline;
        existingEscort.labels = scraped.isVip
          ? [...new Set([...existingEscort.labels, "VIP Escort"])]
          : existingEscort.labels;

        // Add to images if not already present and valid
        if (scraped.previewPhoto && scraped.previewPhoto.includes("uploads/")) {
          if (!existingEscort.images.includes(scraped.previewPhoto)) {
            existingEscort.images.push(scraped.previewPhoto);
          }
        }

        // Add new location if not exists
        const locationExists = existingEscort.locations?.some(
          (l) => l.region?.toString() === regionId.toString(),
        );

        if (!locationExists) {
          existingEscort.addLocation(location);
        }

        // Update services
        if (services.practices.length > 0) {
          existingEscort.practices = [
            ...new Set([...existingEscort.practices, ...services.practices]),
          ];
        }
        if (services.massage.length > 0) {
          existingEscort.massage = [
            ...new Set([...existingEscort.massage, ...services.massage]),
          ];
        }
        if (services.extraServices.length > 0) {
          existingEscort.extraServices = [
            ...new Set([
              ...existingEscort.extraServices,
              ...services.extraServices,
            ]),
          ];
        }

        await existingEscort.save();
        console.log(
          `✅ Updated escort: ${scraped.name} (${scraped.telephone})`,
        );
        return { success: true };
      } else {
        // Generate a unique username from name and phone
        const baseUsername = scraped.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .substring(0, 20);

        const timestamp = Date.now().toString().slice(-6);
        const uniqueUsername = `${baseUsername}_${timestamp}`;
        // Create new escort
        const newEscort = new Escort({
          name: scraped.name,
          previewPhoto: scraped.previewPhoto?.includes("uploads/")
            ? scraped.previewPhoto
            : "",
          telephone: scraped.telephone,
          whatsappPhone: scraped.telephone,
          email: "", // Not available from scrape
          about: scraped.description,
          images: scraped.previewPhoto?.includes("uploads/")
            ? [scraped.previewPhoto]
            : [],
          videos: [],
          county: countyId,
          countyCode,
          country: "Kenya",
          username: uniqueUsername,
          gender: "girl", // Force to girl since we filtered
          isActive: !scraped.isOffline,
          isVerified: scraped.isVip,
          isFeatured: scraped.isVip,
          labels: scraped.isVip ? ["VIP Escort"] : [],
          slug: this.generateSlug(scraped.name, scraped.telephone),
          source: "escort254",
          practices: services.practices,
          massage: services.massage,
          extraServices: services.extraServices,
          languages: [], // Not available
          categories: scraped.isVip ? ["VIP"] : ["Regular"],
          role: "escort",
          workType: "independent",
          plan: {
            type: scraped.isVip ? "vip" : "basic",
            isActive: true,
            activatedAt: new Date(),
            features: scraped.isVip ? ["vip_badge", "featured_listing"] : [],
          },
          openingHours: {
            monday: "Not Specified",
            tuesday: "Not Specified",
            wednesday: "Not Specified",
            thursday: "Not Specified",
            friday: "Not Specified",
            saturday: "Not Specified",
            sunday: "Not Specified",
          },
          totalBookings: 0,
          totalReviews: 0,
          rating: 0,
          totalViews: 0,
        });

        // Add location using the schema method
        newEscort.addLocation(location);

        await newEscort.save();
        console.log(
          `✅ Created new escort: ${scraped.name} (${scraped.telephone})`,
        );
        return { success: true };
      }
    } catch (error: any) {
      console.error(`❌ Failed to save escort ${scraped.name}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate unique slug from name and phone
   */
  private static generateSlug(name: string, phone: string): string {
    const nameSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    const phoneSuffix = phone.replace(/\D/g, "").slice(-6); // Last 6 digits

    return `${nameSlug}-${phoneSuffix}`;
  }

  /**
   * Save multiple escorts
   */
  static async saveEscorts(escorts: ScrapedEscort[]): Promise<{
    success: number;
    failed: number;
    skipped: number;
    results: Array<{ name: string; success: boolean; error?: string }>;
  }> {
    let success = 0;
    let failed = 0;
    let skipped = 0;
    const results = [];

    for (const escort of escorts) {
      // Skip if no valid phone number
      if (!escort.telephone || escort.telephone === "+254111111111") {
        console.log(`⏭️ Skipping ${escort.name} - Invalid phone number`);
        skipped++;
        results.push({
          name: escort.name,
          success: false,
          error: "Invalid phone number",
        });
        continue;
      }

      const result = await this.saveEscort(escort);

      if (result.success) {
        success++;
        results.push({ name: escort.name, success: true });
      } else {
        if (result.error === "Not female escort") {
          skipped++;
        } else {
          failed++;
        }
        results.push({
          name: escort.name,
          success: false,
          error: result.error,
        });
      }

      // Small delay to prevent overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return { success, failed, skipped, results };
  }
}
