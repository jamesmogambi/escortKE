// import { initBrightData } from "@/lib/brightData";
// import { connectToDB } from "@/lib/mongoose";
// import Escort, { defaultOpeningHours } from "@/models/Escort";
// import axios from "axios";
// import * as cheerio from "cheerio";

// export async function ScrapGirlandSave(
//   this: any,
//   escortURL: string,
//   county: string,
//   region: string,
// ) {
//   await connectToDB();
//   const { options } = initBrightData();

//   const escortData = {
//     sourceUrl: escortURL,
//     name: "",
//     age: "",
//     gender: "",
//     nationality: "",
//     ethnicity: "",
//     sexualOrientation: "",
//     languages: [] as string[],
//     description: "",

//     country: county, // Use the passed parameter
//     city: region, // Use the passed parameter
//     location: "",

//     bustSize: "",
//     height: "",
//     hairColor: "",
//     weight: "",
//     shaved: "",
//     smokes: "",

//     practices: [] as string[],
//     bdsm: [] as string[],
//     massage: [] as string[],
//     extraServices: [] as string[],
//     categories: [] as string[],

//     incallRate: "",
//     outcallRate: "",

//     images: [] as string[],
//     videos: [] as string[],
//     previewPhoto: "",

//     reviews: [] as Array<{
//       reviewer: string;
//       rating: string;
//       date: string;
//       content: string;
//     }>,
//     questions: [] as string[],

//     isActive: true,
//     isVerified: false,
//     source: "afrohot",
//     plan: "basic" as "basic" | "vip" | "premium",

//     slug: "",
//     telephone: "",
//     whatsappPhone: "",
//     email: "",
//     labels: [] as string[],
//     availability: [] as string[],
//     rates: [] as Array<{ duration: string; incall: string; outcall: string }>,
//     openingHours: defaultOpeningHours,
//     ageCategory: "",
//     character: "",
//     experience: "",
//   };

//   try {
//     // FIX 1: Use the escortURL directly instead of appending "/"
//     const response = await axios.get(escortURL, options);
//     const html = response.data; // Store HTML for later use
//     const $ = cheerio.load(html);

//     // Extract name from image alt or description
//     const imageAlt = $(".escort-gallery img").first().attr("alt") || "";
//     escortData.name = imageAlt.split("-")[0]?.trim() || "Unknown";

//     // FIX 2: Get description from the right element
//     escortData.description =
//       $(".description p").first().text().trim() ||
//       $(".description").first().text().trim();

//     // Extract images
//     $(".escort-gallery img").each((i, el) => {
//       const imgUrl = $(el).attr("src");
//       if (imgUrl && !escortData.images.includes(imgUrl)) {
//         escortData.images.push(imgUrl);
//       }
//     });

//     // Extract links for images as well (they might have higher quality)
//     $(".escort-gallery a").each((i, el) => {
//       const imgUrl = $(el).attr("href");
//       if (imgUrl && !escortData.images.includes(imgUrl)) {
//         escortData.images.push(imgUrl);
//       }
//     });

//     // Set preview photo
//     escortData.previewPhoto = escortData.images[0] || "";

//     // Extract services from the services section
//     $(".description a.bg-secondary").each((i, el) => {
//       const service = $(el).text().trim();
//       if (service) {
//         const serviceLower = service.toLowerCase();

//         // FIX 3: Better categorization logic
//         if (serviceLower.includes("bdsm")) {
//           if (!escortData.bdsm.includes(service)) {
//             escortData.bdsm.push(service);
//           }
//         } else if (
//           serviceLower.includes("massage") ||
//           serviceLower.includes("handjob") ||
//           serviceLower.includes("fisting")
//         ) {
//           if (!escortData.massage.includes(service)) {
//             escortData.massage.push(service);
//           }
//         } else if (
//           serviceLower.includes("fetish") ||
//           serviceLower.includes("anal") ||
//           serviceLower.includes("deep throat") ||
//           serviceLower.includes("threesome") ||
//           serviceLower.includes("lesbian") ||
//           serviceLower.includes("webcam") ||
//           serviceLower.includes("sex")
//         ) {
//           if (!escortData.practices.includes(service)) {
//             escortData.practices.push(service);
//           }
//         } else {
//           if (!escortData.extraServices.includes(service)) {
//             escortData.extraServices.push(service);
//           }
//         }

//         // Also add to categories
//         if (!escortData.categories.includes(service)) {
//           escortData.categories.push(service);
//         }
//       }
//     });

//     // Extract rates
//     const incallText = $(".up-down div:first-child p").text().trim();
//     const outcallText = $(".up-down div:last-child p").text().trim();

//     // FIX 4: Better rate extraction
//     escortData.incallRate = this.extractRate(incallText);
//     escortData.outcallRate = this.extractRate(outcallText);

//     // Helper function for rate extraction
//     function extractRate(text: string): string {
//       if (text.includes("ASK")) {
//         return "ASK";
//       }
//       const rateMatch = text.match(/(\d+[,\d]*)/);
//       return rateMatch ? rateMatch[1] : "";
//     }

//     // Extract details from the more-info list
//     $(".more-info li").each((i, el) => {
//       const label = $(el).find("span:first-child").text().trim().toLowerCase();
//       const value = $(el).find("span:last-child").text().trim();
//       const linkValue = $(el).find("span:last-child a").text().trim() || value;

//       switch (label) {
//         case "languages":
//           if (value) {
//             const languages = value.split(",").map((lang) => lang.trim());
//             escortData.languages = languages.filter(
//               (lang) => lang && lang !== "N/A" && lang !== "",
//             );
//           }
//           break;

//         case "orientation":
//           escortData.sexualOrientation = value;
//           break;

//         case "ethnicity":
//           escortData.ethnicity = value || "";
//           break;

//         case "age":
//           escortData.age = value;
//           break;

//         case "smokes?":
//           escortData.smokes = value;
//           break;

//         case "nationality":
//           escortData.nationality = value;
//           break;

//         case "city":
//           // FIX 5: Only override if we actually found city from the page
//           const cityLinks = $(el).find("span:last-child a");
//           if (cityLinks.length >= 2) {
//             escortData.city = $(cityLinks[0]).text().trim() || region;
//             escortData.country = $(cityLinks[1]).text().trim() || county;
//           } else if (cityLinks.length === 1) {
//             escortData.city = $(cityLinks[0]).text().trim() || region;
//           }
//           break;

//         case "location":
//           escortData.location = linkValue;
//           break;

//         case "bust":
//           escortData.bustSize = value || "";
//           break;

//         case "height":
//           const cmMatch = value.match(/(\d+)\s*cm/i);
//           if (cmMatch) {
//             escortData.height = cmMatch[1] + " cm";
//           } else {
//             escortData.height = value;
//           }
//           break;

//         case "shaved":
//           escortData.shaved = value;
//           break;

//         case "hair color":
//           escortData.hairColor = value;
//           break;

//         case "gender":
//           escortData.gender = value;
//           break;
//       }
//     });

//     // Extract reviews
//     $(".review-item-one").each((i, el) => {
//       const review = {
//         reviewer: $(el).find(".head-sec a").first().text().trim(),
//         rating: $(el).find("input.rating").attr("value") || "0",
//         date: $(el).find(".head-sec span").text().replace("–", "").trim(),
//         content: $(el).find(".body-sec p").text().trim(),
//       };

//       if (review.reviewer && review.content) {
//         escortData.reviews.push(review);
//       }
//     });

//     // FIX 6: Generate unique slug with timestamp
//     const nameSlug = escortData.name
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");
//     const citySlug = (escortData.city || "unknown")
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");
//     escortData.slug = `${nameSlug}-${citySlug}-${Date.now().toString().slice(-6)}`;

//     // Add labels based on services and attributes
//     const labels = [];
//     if (escortData.bdsm.length > 0) labels.push("BDSM");
//     if (escortData.images.length > 3) labels.push("Multiple Photos");
//     if (escortData.reviews.length > 0) labels.push("Reviewed");
//     if (escortData.incallRate !== "ASK" || escortData.outcallRate !== "ASK") {
//       labels.push("Rates Available");
//     }
//     // Add more labels based on services
//     if (escortData.practices.length > 5) labels.push("Full Service");
//     if (escortData.extraServices.length > 0) labels.push("Extra Services");

//     escortData.labels = labels;

//     // Add availability
//     escortData.availability = [
//       "Available for incalls",
//       "Available for outcalls",
//     ];

//     // Extract weight from description if mentioned
//     const weightMatch = html.match(/(\d+)\s*(kg|kgs|kilograms?|pounds?|lbs)/i);
//     if (weightMatch && !escortData.weight) {
//       escortData.weight = weightMatch[1] + " " + weightMatch[2];
//     }

//     // Extract breast size from description if mentioned
//     const bustMatch = html.match(/([ABCD][\+\-]?\d*)\s*(cup|cups|size)/i);
//     if (bustMatch && !escortData.bustSize) {
//       escortData.bustSize = bustMatch[1];
//     }

//     // Create rates array for your model
//     if (escortData.incallRate && escortData.incallRate !== "ASK") {
//       escortData.rates.push({
//         duration: "1 hour",
//         incall: escortData.incallRate,
//         outcall: escortData.outcallRate !== "ASK" ? escortData.outcallRate : "",
//       });
//     }

//     // FIX 7: Extract email from HTML (not from undefined variable)
//     const emailMatch = html.match(
//       /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
//     );
//     if (emailMatch) {
//       escortData.email = emailMatch[0];
//     } else {
//       // Generate a placeholder email
//       const nameSlugForEmail = escortData.name
//         .toLowerCase()
//         .replace(/\s+/g, ".");
//       escortData.email = `${nameSlugForEmail}@afrohot.com`;
//     }

//     // Extract phone numbers from HTML
//     const phoneMatch = html.match(
//       /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
//     );
//     if (phoneMatch && phoneMatch.length > 0) {
//       escortData.telephone = phoneMatch[0];
//       // Check for WhatsApp
//       if (html.toLowerCase().includes("whatsapp") || html.includes("wa.me")) {
//         escortData.whatsappPhone = phoneMatch[0];
//       }
//     }

//     // Generate age category
//     if (escortData.age) {
//       const ageNum = parseInt(escortData.age);
//       if (!isNaN(ageNum)) {
//         if (ageNum < 25) escortData.ageCategory = "Young";
//         else if (ageNum < 35) escortData.ageCategory = "Mature";
//         else escortData.ageCategory = "Senior";
//       }
//     }

//     // Extract character traits from description
//     const characterWords = [
//       "friendly",
//       "professional",
//       "discreet",
//       "fun",
//       "outgoing",
//       "shy",
//       "energetic",
//     ];
//     const foundCharacter = characterWords.find((word) =>
//       escortData.description.toLowerCase().includes(word),
//     );
//     if (foundCharacter) {
//       escortData.character =
//         foundCharacter.charAt(0).toUpperCase() + foundCharacter.slice(1);
//     }

//     // Extract experience from description
//     const descLower = escortData.description.toLowerCase();
//     if (descLower.includes("experienced")) {
//       escortData.experience = "Experienced";
//     } else if (descLower.includes("new")) {
//       escortData.experience = "New";
//     } else if (descLower.includes("beginner")) {
//       escortData.experience = "Beginner";
//     }

//     // FIX 8: Clean up empty arrays properly
//     const arrayFields = [
//       "practices",
//       "bdsm",
//       "massage",
//       "extraServices",
//       "categories",
//       "languages",
//       "labels",
//       "availability",
//       "rates",
//     ];
//     arrayFields.forEach((key) => {
//       if (
//         escortData[key as keyof typeof escortData] &&
//         Array.isArray(escortData[key as keyof typeof escortData]) &&
//         (escortData[key as keyof typeof escortData] as any[]).length === 0
//       ) {
//         // Keep as empty array, don't delete
//       }
//     });

//     // FIX 9: Prepare data for Mongoose model
//     const escortModelData = {
//       name: escortData.name || "Unknown",
//       email: escortData.email,
//       labels: escortData.labels,
//       age: escortData.age || "",
//       telephone: escortData.telephone || "",
//       whatsappPhone: escortData.whatsappPhone || "",
//       images: escortData.images,
//       videos: escortData.videos,
//       about: escortData.description || "",
//       availability: escortData.availability,
//       ethnicity: escortData.ethnicity || "",
//       nationality: escortData.nationality || "",
//       bustSize: escortData.bustSize || "",
//       weight: escortData.weight || "",
//       source: escortData.source,
//       sexualOrientation: escortData.sexualOrientation || "",
//       languages: escortData.languages,
//       categories: escortData.categories,
//       estate: escortData.location || "",
//       town: escortData.city || region,
//       address: `${escortData.location || ""}, ${escortData.city || region}, ${escortData.country || county}`,
//       practices: escortData.practices,
//       bdsm: escortData.bdsm,
//       massage: escortData.massage,
//       extraServices: escortData.extraServices,
//       slug: escortData.slug,
//       openingHours: defaultOpeningHours,
//       rates: escortData.rates,
//       role: "escort" as const,
//       isActive: true,
//       isVerified: false,
//       street: escortData.location || "",
//       region: escortData.city || region,
//       user: undefined,
//       breastSize: escortData.bustSize || "",
//       ageCategory: escortData.ageCategory || "",
//       character: escortData.character || "",
//       hairColor: escortData.hairColor || "",
//       experience: escortData.experience || "",
//       plan: escortData.plan,
//       previewPhoto: escortData.previewPhoto || "",
//       username: escortData.slug,
//       sourceUrl: escortURL,
//     };

//     // FIX 10: Check if escort already exists
//     const existingEscort = await Escort.findOne({ slug: escortData.slug });
//     if (existingEscort) {
//       console.log(
//         `Escort with slug "${escortData.slug}" already exists. Updating instead.`,
//       );

//       // Update existing escort
//       const updatedEscort = await Escort.findByIdAndUpdate(
//         existingEscort._id,
//         { $set: escortModelData },
//         { new: true },
//       );
//       return updatedEscort;
//     }

//     // Save new escort
//     const newEscort = await Escort.create(escortModelData);
//     console.log(
//       `✅ Escort saved successfully: ${newEscort.name} (${newEscort._id})`,
//     );
//     return newEscort;
//   } catch (error: any) {
//     console.error("Scraping error for URL:", escortURL);
//     console.error("Error details:", error.message);

//     // Return minimal data for error tracking
//     return {
//       error: true,
//       message: error.message,
//       url: escortURL,
//       name: escortData.name || "Failed to scrape",
//     };
//   }
// }

import { initBrightData } from "@/lib/brightData";
import { connectToDB } from "@/lib/mongoose";
import Escort, { defaultOpeningHours } from "@/models/Escort";
import axios from "axios";
import * as cheerio from "cheerio";

// Helper function for rate extraction (defined outside the main function)
function extractRate(text: string): string {
  if (text.includes("ASK")) {
    return "ASK";
  }
  const rateMatch = text.match(/(\d+[,\d]*)/);
  return rateMatch ? rateMatch[1] : "";
}

export async function ScrapGirlandSave(
  escortURL: string,
  county: string,
  region: string,
) {
  await connectToDB();
  const { options } = initBrightData();

  const escortData = {
    sourceUrl: escortURL,
    name: "",
    age: "",
    gender: "",
    nationality: "",
    ethnicity: "",
    sexualOrientation: "",
    languages: [] as string[],
    description: "",

    country: county,
    city: region,
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

    slug: "",
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

  try {
    // Use the escortURL directly
    const response = await axios.get(escortURL, options);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract name from image alt or description
    const imageAlt = $(".escort-gallery img").first().attr("alt") || "";
    escortData.name = imageAlt.split("-")[0]?.trim() || "Unknown";

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

    // Extract links for images
    $(".escort-gallery a").each((i, el) => {
      const imgUrl = $(el).attr("href");
      if (imgUrl && !escortData.images.includes(imgUrl)) {
        escortData.images.push(imgUrl);
      }
    });

    // Set preview photo
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

        // Add to categories
        if (!escortData.categories.includes(service)) {
          escortData.categories.push(service);
        }
      }
    });

    // Extract rates using the helper function (FIXED: removed this.)
    const incallText = $(".up-down div:first-child p").text().trim();
    const outcallText = $(".up-down div:last-child p").text().trim();

    // Use the helper function directly, not via this.
    escortData.incallRate = extractRate(incallText);
    escortData.outcallRate = extractRate(outcallText);

    // Extract details from the more-info list
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

        case "city":
          const cityLinks = $(el).find("span:last-child a");
          if (cityLinks.length >= 2) {
            escortData.city = $(cityLinks[0]).text().trim() || region;
            escortData.country = $(cityLinks[1]).text().trim() || county;
          } else if (cityLinks.length === 1) {
            escortData.city = $(cityLinks[0]).text().trim() || region;
          }
          break;

        case "location":
          escortData.location = linkValue;
          break;

        case "bust":
          escortData.bustSize = value || "";
          break;

        case "height":
          const cmMatch = value.match(/(\d+)\s*cm/i);
          if (cmMatch) {
            escortData.height = cmMatch[1] + " cm";
          } else {
            escortData.height = value;
          }
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

    // Extract reviews
    $(".review-item-one").each((i, el) => {
      const review = {
        reviewer: $(el).find(".head-sec a").first().text().trim(),
        rating: $(el).find("input.rating").attr("value") || "0",
        date: $(el).find(".head-sec span").text().replace("–", "").trim(),
        content: $(el).find(".body-sec p").text().trim(),
      };

      if (review.reviewer && review.content) {
        escortData.reviews.push(review);
      }
    });

    // Generate unique slug with timestamp
    const nameSlug = escortData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const citySlug = (escortData.city || "unknown")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    escortData.slug = `${nameSlug}-${citySlug}-${Date.now().toString().slice(-6)}`;

    // Add labels
    const labels = [];
    if (escortData.bdsm.length > 0) labels.push("BDSM");
    if (escortData.images.length > 3) labels.push("Multiple Photos");
    if (escortData.reviews.length > 0) labels.push("Reviewed");
    if (escortData.incallRate !== "ASK" || escortData.outcallRate !== "ASK") {
      labels.push("Rates Available");
    }
    if (escortData.practices.length > 5) labels.push("Full Service");
    if (escortData.extraServices.length > 0) labels.push("Extra Services");

    escortData.labels = labels;

    // Add availability
    escortData.availability = [
      "Available for incalls",
      "Available for outcalls",
    ];

    // Extract weight from HTML
    const weightMatch = html.match(/(\d+)\s*(kg|kgs|kilograms?|pounds?|lbs)/i);
    if (weightMatch && !escortData.weight) {
      escortData.weight = weightMatch[1] + " " + weightMatch[2];
    }

    // Extract breast size from HTML
    const bustMatch = html.match(/([ABCD][\+\-]?\d*)\s*(cup|cups|size)/i);
    if (bustMatch && !escortData.bustSize) {
      escortData.bustSize = bustMatch[1];
    }

    // Create rates array
    if (escortData.incallRate && escortData.incallRate !== "ASK") {
      escortData.rates.push({
        duration: "1 hour",
        incall: escortData.incallRate,
        outcall: escortData.outcallRate !== "ASK" ? escortData.outcallRate : "",
      });
    }

    // Extract email from HTML
    const emailMatch = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    if (emailMatch) {
      escortData.email = emailMatch[0];
    } else {
      const nameSlugForEmail = escortData.name
        .toLowerCase()
        .replace(/\s+/g, ".");
      escortData.email = `${nameSlugForEmail}@afrohot.com`;
    }

    // Extract phone numbers from HTML
    const phoneMatch = html.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    );
    if (phoneMatch && phoneMatch.length > 0) {
      escortData.telephone = phoneMatch[0];
      if (html.toLowerCase().includes("whatsapp") || html.includes("wa.me")) {
        escortData.whatsappPhone = phoneMatch[0];
      }
    }

    // Generate age category
    if (escortData.age) {
      const ageNum = parseInt(escortData.age);
      if (!isNaN(ageNum)) {
        if (ageNum < 25) escortData.ageCategory = "Young";
        else if (ageNum < 35) escortData.ageCategory = "Mature";
        else escortData.ageCategory = "Senior";
      }
    }

    // Extract character traits
    const characterWords = [
      "friendly",
      "professional",
      "discreet",
      "fun",
      "outgoing",
      "shy",
      "energetic",
    ];
    const foundCharacter = characterWords.find((word) =>
      escortData.description.toLowerCase().includes(word),
    );
    if (foundCharacter) {
      escortData.character =
        foundCharacter.charAt(0).toUpperCase() + foundCharacter.slice(1);
    }

    // Extract experience
    const descLower = escortData.description.toLowerCase();
    if (descLower.includes("experienced")) {
      escortData.experience = "Experienced";
    } else if (descLower.includes("new")) {
      escortData.experience = "New";
    } else if (descLower.includes("beginner")) {
      escortData.experience = "Beginner";
    }

    // Prepare data for Mongoose model
    const escortModelData = {
      name: escortData.name || "Unknown",
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

    // Check if escort already exists
    const existingEscort = await Escort.findOne({ slug: escortData.slug });
    if (existingEscort) {
      console.log(
        `Escort with slug "${escortData.slug}" already exists. Updating instead.`,
      );

      const updatedEscort = await Escort.findByIdAndUpdate(
        existingEscort._id,
        { $set: escortModelData },
        { new: true },
      );
      return updatedEscort;
    }

    // Save new escort
    const newEscort = await Escort.create(escortModelData);
    console.log(
      `✅ Escort saved successfully: ${newEscort.name} (${newEscort._id})`,
    );
    return newEscort;
  } catch (error: any) {
    console.error("Scraping error for URL:", escortURL);
    console.error("Error details:", error.message);

    return {
      error: true,
      message: error.message,
      url: escortURL,
      name: escortData.name || "Failed to scrape",
    };
  }
}
