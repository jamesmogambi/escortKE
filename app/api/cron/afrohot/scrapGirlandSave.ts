import { getLocationIds } from "@/actions/location";
import { initBrightData } from "@/lib/brightData";
import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";
import axios from "axios";
import * as cheerio from "cheerio";
import { Types } from "mongoose";

function extractRate(text: string): string {
  if (text.includes("ASK")) {
    return "ASK";
  }
  const rateMatch = text.match(/(\d+[,\d]*)/);
  return rateMatch ? rateMatch[1] : "";
}

// Helper function to generate a consistent slug (without timestamp)
function generateConsistentSlug(name: string, city: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

  const citySlug = (city || "unknown")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

  return `${nameSlug}-${citySlug}`;
}

export async function ScrapGirlandSave(
  escortURL: string,
  county: string,
  region: string,
) {
  await connectToDB();
  const { options } = initBrightData();

  try {
    const response = await axios.get(escortURL, options);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract basic info first to check for duplicates
    const imageAlt = $(".escort-gallery img").first().attr("alt") || "";
    const name = imageAlt.split("-")[0]?.trim() || "Unknown";

    // Get city from the page
    let city = region;
    $(".more-info li").each((i, el) => {
      const label = $(el).find("span:first-child").text().trim().toLowerCase();
      if (label === "city") {
        const cityLinks = $(el).find("span:last-child a");
        if (cityLinks.length >= 1) {
          city = $(cityLinks[0]).text().trim();
        }
      }
    });

    // Generate consistent slug
    const consistentSlug = generateConsistentSlug(name, city);

    // Get description
    const description =
      $(".description p").first().text().trim() ||
      $(".description").first().text().trim();

    // Extract images
    const images: string[] = [];
    $(".escort-gallery img").each((i, el) => {
      const imgUrl = $(el).attr("src");
      if (imgUrl && !images.includes(imgUrl)) {
        images.push(imgUrl);
      }
    });

    $(".escort-gallery a").each((i, el) => {
      const imgUrl = $(el).attr("href");
      if (imgUrl && !images.includes(imgUrl)) {
        images.push(imgUrl);
      }
    });

    const previewPhoto = images[0] || "";

    // Initialize arrays for services - ALL SERVICES go into practices
    const practices: string[] = [];
    const bdsm: string[] = []; // Keep for backward compatibility but won't be used much
    const massage: string[] = []; // Keep for backward compatibility but won't be used much
    const extraServices: string[] = []; // Keep for backward compatibility but won't be used much
    const categories: string[] = [];

    // Extract services - ALL SERVICES go into practices array
    $(".description a.bg-secondary").each((i, el) => {
      const service = $(el).text().trim();
      if (service) {
        // Add to practices array (ALL services go here)
        if (!practices.includes(service)) {
          practices.push(service);
        }

        // Also add to categories
        if (!categories.includes(service)) {
          categories.push(service);
        }

        // Keep these for backward compatibility/specific filtering if needed
        const serviceLower = service.toLowerCase();
        if (serviceLower.includes("bdsm")) {
          if (!bdsm.includes(service)) bdsm.push(service);
        } else if (
          serviceLower.includes("massage") ||
          serviceLower.includes("handjob") ||
          serviceLower.includes("fisting")
        ) {
          if (!massage.includes(service)) massage.push(service);
        } else if (
          serviceLower.includes("fetish") ||
          serviceLower.includes("anal") ||
          serviceLower.includes("deep throat") ||
          serviceLower.includes("threesome") ||
          serviceLower.includes("lesbian") ||
          serviceLower.includes("webcam") ||
          serviceLower.includes("sex")
        ) {
          if (!extraServices.includes(service)) extraServices.push(service);
        } else {
          if (!extraServices.includes(service)) extraServices.push(service);
        }
      }
    });

    // Also look for services in other parts of the page
    $(".more-info li").each((i, el) => {
      const label = $(el).find("span:first-child").text().trim().toLowerCase();
      if (
        label === "services offered" ||
        label === "services" ||
        label === "specialties"
      ) {
        const value = $(el).find("span:last-child").text().trim();
        if (value) {
          const servicesList = value.split(",").map((s) => s.trim());
          servicesList.forEach((service) => {
            if (service && !practices.includes(service)) {
              practices.push(service);
            }
            if (service && !categories.includes(service)) {
              categories.push(service);
            }
          });
        }
      }
    });

    // Check for services in description text
    const descriptionLower = description.toLowerCase();
    const commonServices = [
      "cim",
      "come in mouth",
      "cob",
      "come on body",
      "couples",
      "deep throat",
      "live shows",
      "threesome",
      "webcam sex",
      "anal",
      "bdsm",
      "massage",
      "handjob",
      "fisting",
      "fetish",
      "lesbian",
      "role play",
      "dominatrix",
      "gfe",
      "girlfriend experience",
      "pse",
      "pornstar experience",
      "dinner date",
      "overnight",
      "multi-hour",
      "fs",
      "full service",
      "dfk",
      "deep french kissing",
      "daty",
      "dining at the y",
      "bbbj",
      "bareback blowjob",
      "cimsw",
      "come in mouth swallow",
      "cowgirl",
      "missionary",
      "doggy style",
      "69",
      "mutual oral",
      "toys",
    ];

    commonServices.forEach((service) => {
      if (descriptionLower.includes(service.toLowerCase())) {
        if (!practices.includes(service)) {
          practices.push(service);
        }
        if (!categories.includes(service)) {
          categories.push(service);
        }
      }
    });

    // Extract rates
    const incallText = $(".up-down div:first-child p").text().trim();
    const outcallText = $(".up-down div:last-child p").text().trim();
    const incallRate = extractRate(incallText);
    const outcallRate = extractRate(outcallText);

    // Initialize data object for extracted fields
    let age = "";
    let gender = "";
    let nationality = "";
    let ethnicity = "";
    let sexualOrientation = "";
    const languages: string[] = [];
    let location = "";
    let bustSize = "";
    let height = "";
    let hairColor = "";
    let weight = "";
    let shaved = "";
    let smokes = "";
    let telephone = "";
    let whatsappPhone = "";
    let email = "";

    // Extract other details
    $(".more-info li").each((i, el) => {
      const label = $(el).find("span:first-child").text().trim().toLowerCase();
      const value = $(el).find("span:last-child").text().trim();
      const linkValue = $(el).find("span:last-child a").text().trim() || value;

      switch (label) {
        case "languages":
          if (value) {
            const langs = value.split(",").map((lang) => lang.trim());
            languages.push(
              ...langs.filter((lang) => lang && lang !== "N/A" && lang !== ""),
            );
          }
          break;
        case "orientation":
          sexualOrientation = value;
          break;
        case "ethnicity":
          ethnicity = value || "";
          break;
        case "age":
          age = value;
          break;
        case "smokes?":
          smokes = value;
          break;
        case "nationality":
          nationality = value;
          break;
        case "location":
          location = linkValue;
          break;
        case "bust":
          bustSize = value || "";
          break;
        case "height":
          const cmMatch = value.match(/(\d+)\s*cm/i);
          height = cmMatch ? cmMatch[1] + " cm" : value;
          break;
        case "shaved":
          shaved = value;
          break;
        case "hair color":
          hairColor = value;
          break;
        case "gender":
          gender = value;
          break;
      }
    });

    // Extract contact info from HTML
    const emailMatch = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    email = emailMatch
      ? emailMatch[0]
      : `${name.toLowerCase().replace(/\s+/g, ".")}@afrohot.com`;

    const phoneMatch = html.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    );
    if (phoneMatch && phoneMatch.length > 0) {
      telephone = phoneMatch[0];
      if (html.toLowerCase().includes("whatsapp") || html.includes("wa.me")) {
        whatsappPhone = phoneMatch[0];
      }
    }

    // Create rates array
    const rates: Array<{ duration: string; incall: string; outcall?: string }> =
      [];
    if (incallRate && incallRate !== "ASK") {
      rates.push({
        duration: "1 hour",
        incall: incallRate,
        outcall: outcallRate !== "ASK" ? outcallRate : "",
      });
    }

    // Generate labels
    const labels: string[] = [];
    if (bdsm.length > 0) labels.push("BDSM");
    if (practices.length > 5) labels.push("Many Services");
    if (images.length > 3) labels.push("Multiple Photos");
    if (rates.length > 0) labels.push("Rates Available");
    if (incallRate && incallRate !== "ASK") labels.push("Incall Available");
    if (outcallRate && outcallRate !== "ASK") labels.push("Outcall Available");
    if (languages.length > 1) labels.push("Multilingual");

    const availability = ["Available for incalls", "Available for outcalls"];

    // Get location IDs
    const locationIds = await getLocationIds(county, region, true);

    if (!locationIds.countyId) {
      const errorMsg = `County "${county}" not found in database. Please add county first.`;
      console.warn(`⚠️ ${errorMsg}`);

      await logMissingCounty(county, region, name);

      return {
        success: false,
        action: "skipped",
        error: errorMsg,
      };
    }

    console.log("📍 Location IDs:", {
      county: locationIds.countyId ? "✅ Found" : "❌ Not found",
      region: locationIds.regionId ? "✅ Found/Created" : "❌ Not found",
      countyCode: locationIds.countyCode,
    });

    console.log(
      `🛠️ Extracted ${practices.length} services for ${name}:`,
      practices,
    );

    // Default opening hours
    const defaultOpeningHours = {
      monday: "Not Specified",
      tuesday: "Not Specified",
      wednesday: "Not Specified",
      thursday: "Not Specified",
      friday: "Not Specified",
      saturday: "Not Specified",
      sunday: "Not Specified",
    };

    // Map gender to enum values
    let mappedGender:
      | "girl"
      | "boy"
      | "transgender"
      | "non-binary"
      | "other"
      | undefined;
    if (gender) {
      const genderLower = gender.toLowerCase();
      if (
        genderLower.includes("girl") ||
        genderLower.includes("female") ||
        genderLower.includes("lady")
      ) {
        mappedGender = "girl";
      } else if (
        genderLower.includes("boy") ||
        genderLower.includes("male") ||
        genderLower.includes("man")
      ) {
        mappedGender = "boy";
      } else if (
        genderLower.includes("trans") ||
        genderLower.includes("tgirl") ||
        genderLower.includes("transgender")
      ) {
        mappedGender = "transgender";
      } else if (
        genderLower.includes("non-binary") ||
        genderLower.includes("non binary")
      ) {
        mappedGender = "non-binary";
      } else {
        mappedGender = "other";
      }
    }

    // Prepare data for Mongoose model
    const escortModelData = {
      // Basic info
      name: name,
      username: `${consistentSlug}-${Date.now().toString().slice(-6)}`,
      previewPhoto: previewPhoto,
      email: email,
      labels: labels,
      age: age || "",
      telephone: telephone || "",
      whatsappPhone: whatsappPhone || telephone || "",
      images: images,
      videos: [],
      about: description || "",
      availability: availability,

      // Demographics
      ethnicity: ethnicity || "",
      nationality: nationality || "",

      // Physical attributes
      bustSize: bustSize || "",
      weight: weight || "",
      breastSize: bustSize || "",

      // Other attributes
      source: "afrohot",
      zodiacSign: "",
      sexualOrientation: sexualOrientation || "",
      gender: mappedGender,

      // Languages and categories
      languages: languages,
      categories: [...new Set(categories)], // Remove duplicates

      // Location fields
      country: "Kenya",
      county: locationIds.countyId as Types.ObjectId,
      countyCode: locationIds.countyCode || "",
      ...(locationIds.regionId && {
        region: locationIds.regionId as Types.ObjectId,
      }),
      town: city || region,
      estate: location || "",
      address: `${location || ""}, ${city || region}, Kenya`,
      street: location || "",
      postalCode: "",

      // Services - ALL SERVICES in practices array
      practices: [...new Set(practices)], // Remove duplicates
      bdsm: [...new Set(bdsm)],
      massage: [...new Set(massage)],
      extraServices: [...new Set(extraServices)],

      // SEO
      slug: `${consistentSlug}-${Date.now().toString().slice(-6)}`,

      // Hours
      openingHours: defaultOpeningHours,

      // Rates
      rates: rates,

      // Role and status
      role: "escort",
      isActive: true,
      isVerified: false,
      isFeatured: false,

      // Physical attributes (again)
      // breastSize: bustSize || "",
      ageCategory: "",
      character: "",
      hairColor: hairColor || "",
      experience: "",

      // Work type
      workType: "independent",

      // Plan
      plan: {
        type: "basic",
        isActive: true,
        features: [],
      },

      // Statistics
      totalBookings: 0,
      totalReviews: 0,
      rating: 0,
      totalViews: 0,

      // Source tracking
      sourceUrl: escortURL,
    };

    console.log("escort model data ==>", escortModelData);

    // Check for duplicate before saving
    const existingEscort = await Escort.findOne({
      $or: [
        { sourceUrl: escortURL },
        { slug: consistentSlug },
        {
          name: { $regex: new RegExp(`^${name}$`, "i") },
          town: city,
        },
      ],
    });

    if (existingEscort) {
      console.log(
        `⚠️ Duplicate found: "${name}" from ${city}. Already exists with ID: ${existingEscort._id}`,
      );
      return {
        _id: existingEscort._id,
        name: existingEscort.name,
        slug: existingEscort.slug,
        plan: existingEscort.plan,
        isDuplicate: true,
        existingData: existingEscort,
      };
    }

    // Save new escort
    const newEscort = await Escort.create(escortModelData);
    console.log(`✅ New escort saved: ${newEscort.name} (${newEscort._id})`);
    console.log(
      `✅ Services saved (${newEscort.practices.length}):`,
      newEscort.practices,
    );
    return newEscort;
  } catch (error: any) {
    console.error("Scraping error for URL:", escortURL);
    console.error("Error details:", error.message);

    return {
      error: true,
      message: error.message,
      url: escortURL,
      name: "Failed to scrape",
    };
  }
}

// Helper to log missing counties for manual review
async function logMissingCounty(
  countyName: string,
  regionName: string,
  escortName?: string,
) {
  const logEntry = {
    timestamp: new Date(),
    countyName,
    regionName,
    escortName,
    type: "MISSING_COUNTY",
  };
  console.log("📋 Missing County Log:", logEntry);
}
