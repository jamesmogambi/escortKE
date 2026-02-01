import { initBrightData } from "@/lib/brightData";
import { connectToDB } from "@/lib/mongoose";
import Escort, { defaultOpeningHours } from "@/models/Escort";
import axios from "axios";
import * as cheerio from "cheerio";

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
    .replace(/-+/g, "-"); // Remove consecutive dashes

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
    let city = region; // Default to passed region
    $(".more-info li").each((i, el) => {
      const label = $(el).find("span:first-child").text().trim().toLowerCase();
      if (label === "city") {
        const cityLinks = $(el).find("span:last-child a");
        if (cityLinks.length >= 1) {
          city = $(cityLinks[0]).text().trim();
        }
      }
    });

    // Generate consistent slug (NO TIMESTAMP for duplicate checking)
    const consistentSlug = generateConsistentSlug(name, city);

    // Check for duplicates using multiple criteria
    const existingEscort = await Escort.findOne({
      $or: [
        { sourceUrl: escortURL },
        { slug: { $regex: `^${consistentSlug}` } }, // Match beginning of slug
        {
          name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive name match
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

    // If no duplicate found, continue with full scraping
    const escortData = {
      sourceUrl: escortURL,
      name,
      age: "",
      gender: "",
      nationality: "",
      ethnicity: "",
      sexualOrientation: "",
      languages: [] as string[],
      description: "",

      country: county,
      city: city,
      location: "",

      bustSize: "",
      height: "",
      hairColor: "",
      weight: "",
      shaved: "",
      smokes: "",

      practices: [] as string[],
      bdsm: [] as string[],
      massage: [] as string[],
      extraServices: [] as string[],
      categories: [] as string[],

      incallRate: "",
      outcallRate: "",

      images: [] as string[],
      videos: [] as string[],
      previewPhoto: "",

      reviews: [] as Array<{
        reviewer: string;
        rating: string;
        date: string;
        content: string;
      }>,
      questions: [] as string[],

      isActive: true,
      isVerified: false,
      source: "afrohot",
      plan: "basic" as "basic" | "vip" | "premium",

      slug: "", // Will be set with timestamp later
      telephone: "",
      whatsappPhone: "",
      email: "",
      labels: [] as string[],
      availability: [] as string[],
      rates: [] as Array<{ duration: string; incall: string; outcall: string }>,
      openingHours: defaultOpeningHours,
      ageCategory: "",
      character: "",
      experience: "",
    };

    // Get description
    escortData.description =
      $(".description p").first().text().trim() ||
      $(".description").first().text().trim();

    // Extract images
    $(".escort-gallery img").each((i, el) => {
      const imgUrl = $(el).attr("src");
      if (imgUrl && !escortData.images.includes(imgUrl)) {
        escortData.images.push(imgUrl);
      }
    });

    $(".escort-gallery a").each((i, el) => {
      const imgUrl = $(el).attr("href");
      if (imgUrl && !escortData.images.includes(imgUrl)) {
        escortData.images.push(imgUrl);
      }
    });

    escortData.previewPhoto = escortData.images[0] || "";

    // Extract services
    $(".description a.bg-secondary").each((i, el) => {
      const service = $(el).text().trim();
      if (service) {
        const serviceLower = service.toLowerCase();

        if (serviceLower.includes("bdsm")) {
          if (!escortData.bdsm.includes(service)) {
            escortData.bdsm.push(service);
          }
        } else if (
          serviceLower.includes("massage") ||
          serviceLower.includes("handjob") ||
          serviceLower.includes("fisting")
        ) {
          if (!escortData.massage.includes(service)) {
            escortData.massage.push(service);
          }
        } else if (
          serviceLower.includes("fetish") ||
          serviceLower.includes("anal") ||
          serviceLower.includes("deep throat") ||
          serviceLower.includes("threesome") ||
          serviceLower.includes("lesbian") ||
          serviceLower.includes("webcam") ||
          serviceLower.includes("sex")
        ) {
          if (!escortData.practices.includes(service)) {
            escortData.practices.push(service);
          }
        } else {
          if (!escortData.extraServices.includes(service)) {
            escortData.extraServices.push(service);
          }
        }

        if (!escortData.categories.includes(service)) {
          escortData.categories.push(service);
        }
      }
    });

    // Extract rates
    const incallText = $(".up-down div:first-child p").text().trim();
    const outcallText = $(".up-down div:last-child p").text().trim();
    escortData.incallRate = extractRate(incallText);
    escortData.outcallRate = extractRate(outcallText);

    // Extract other details
    $(".more-info li").each((i, el) => {
      const label = $(el).find("span:first-child").text().trim().toLowerCase();
      const value = $(el).find("span:last-child").text().trim();
      const linkValue = $(el).find("span:last-child a").text().trim() || value;

      switch (label) {
        case "languages":
          if (value) {
            const languages = value.split(",").map((lang) => lang.trim());
            escortData.languages = languages.filter(
              (lang) => lang && lang !== "N/A" && lang !== "",
            );
          }
          break;
        case "orientation":
          escortData.sexualOrientation = value;
          break;
        case "ethnicity":
          escortData.ethnicity = value || "";
          break;
        case "age":
          escortData.age = value;
          break;
        case "smokes?":
          escortData.smokes = value;
          break;
        case "nationality":
          escortData.nationality = value;
          break;
        case "location":
          escortData.location = linkValue;
          break;
        case "bust":
          escortData.bustSize = value || "";
          break;
        case "height":
          const cmMatch = value.match(/(\d+)\s*cm/i);
          escortData.height = cmMatch ? cmMatch[1] + " cm" : value;
          break;
        case "shaved":
          escortData.shaved = value;
          break;
        case "hair color":
          escortData.hairColor = value;
          break;
        case "gender":
          escortData.gender = value;
          break;
      }
    });

    // Generate final slug WITH timestamp (for unique database entry)
    escortData.slug = `${consistentSlug}-${Date.now().toString().slice(-6)}`;

    // Add labels
    const labels = [];
    if (escortData.bdsm.length > 0) labels.push("BDSM");
    if (escortData.images.length > 3) labels.push("Multiple Photos");
    if (escortData.reviews.length > 0) labels.push("Reviewed");
    if (escortData.incallRate !== "ASK" || escortData.outcallRate !== "ASK") {
      labels.push("Rates Available");
    }
    escortData.labels = labels;

    escortData.availability = [
      "Available for incalls",
      "Available for outcalls",
    ];

    // Extract contact info from HTML
    const emailMatch = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    escortData.email = emailMatch
      ? emailMatch[0]
      : `${name.toLowerCase().replace(/\s+/g, ".")}@afrohot.com`;

    const phoneMatch = html.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    );
    if (phoneMatch && phoneMatch.length > 0) {
      escortData.telephone = phoneMatch[0];
      if (html.toLowerCase().includes("whatsapp") || html.includes("wa.me")) {
        escortData.whatsappPhone = phoneMatch[0];
      }
    }

    // Create rates array
    if (escortData.incallRate && escortData.incallRate !== "ASK") {
      escortData.rates.push({
        duration: "1 hour",
        incall: escortData.incallRate,
        outcall: escortData.outcallRate !== "ASK" ? escortData.outcallRate : "",
      });
    }

    // Prepare data for Mongoose model
    const escortModelData = {
      name: escortData.name,
      email: escortData.email,
      labels: escortData.labels,
      age: escortData.age || "",
      telephone: escortData.telephone || "",
      whatsappPhone: escortData.whatsappPhone || "",
      images: escortData.images,
      videos: escortData.videos,
      about: escortData.description || "",
      availability: escortData.availability,
      ethnicity: escortData.ethnicity || "",
      nationality: escortData.nationality || "",
      bustSize: escortData.bustSize || "",
      weight: escortData.weight || "",
      source: escortData.source,
      sexualOrientation: escortData.sexualOrientation || "",
      languages: escortData.languages,
      categories: escortData.categories,
      estate: escortData.location || "",
      town: escortData.city || region,
      address: `${escortData.location || ""}, ${escortData.city || region}, ${escortData.country || county}`,
      practices: escortData.practices,
      bdsm: escortData.bdsm,
      massage: escortData.massage,
      extraServices: escortData.extraServices,
      slug: escortData.slug,
      openingHours: defaultOpeningHours,
      rates: escortData.rates,
      role: "escort" as const,
      isActive: true,
      isVerified: false,
      street: escortData.location || "",
      region: escortData.city || region,
      user: undefined,
      breastSize: escortData.bustSize || "",
      ageCategory: escortData.ageCategory || "",
      character: escortData.character || "",
      hairColor: escortData.hairColor || "",
      experience: escortData.experience || "",
      plan: escortData.plan,
      previewPhoto: escortData.previewPhoto || "",
      username: escortData.slug,
      sourceUrl: escortURL,
    };

    // Save new escort
    const newEscort = await Escort.create(escortModelData);
    console.log(`✅ New escort saved: ${newEscort.name} (${newEscort._id})`);
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
