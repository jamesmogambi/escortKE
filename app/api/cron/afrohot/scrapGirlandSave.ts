// // lib/scrapers/afrohot/helper.ts
// import { getLocationIds } from "@/actions/location";
// import { initBrightData } from "@/lib/brightData";
// import { connectToDB } from "@/lib/mongoose";
// import Escort from "@/models/Escort";
// import { Region } from "@/models/Region";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { Types } from "mongoose";
//
// function extractRate(text: string): string {
//   if (text.includes("ASK")) {
//     return "ASK";
//   }
//   const rateMatch = text.match(/(\d+[,\d]*)/);
//   return rateMatch ? rateMatch[1] : "";
// }
//
// function generateConsistentSlug(name: string, city: string): string {
//   const nameSlug = name
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "")
//     .replace(/-+/g, "-");
//
//   const citySlug = (city || "unknown")
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "")
//     .replace(/-+/g, "-");
//
//   return `${nameSlug}-${citySlug}`;
// }
//
// export async function ScrapGirlandSave(
//   escortURL: string,
//   county: string,
//   region: string,
// ) {
//   await connectToDB();
//   const { options } = initBrightData();
//
//   try {
//     const response = await axios.get(escortURL, options);
//     const html = response.data;
//     const $ = cheerio.load(html);
//
//     // Extract basic info
//     const imageAlt = $(".escort-gallery img").first().attr("alt") || "";
//     const name = imageAlt.split("-")[0]?.trim() || "Unknown";
//
//     // Get city/region from the page
//     let city = region;
//     $(".more-info li").each((i, el) => {
//       const label = $(el).find("span:first-child").text().trim().toLowerCase();
//       if (label === "city") {
//         const cityLinks = $(el).find("span:last-child a");
//         if (cityLinks.length >= 1) {
//           city = $(cityLinks[0]).text().trim();
//         }
//       }
//     });
//
//     // Generate consistent slug
//     const consistentSlug = generateConsistentSlug(name, city);
//
//     // Get description
//     const description =
//       $(".description p").first().text().trim() ||
//       $(".description").first().text().trim();
//
//     // Extract images
//     const images: string[] = [];
//     $(".escort-gallery img").each((i, el) => {
//       const imgUrl = $(el).attr("src");
//       if (imgUrl && !images.includes(imgUrl)) {
//         images.push(imgUrl);
//       }
//     });
//
//     $(".escort-gallery a").each((i, el) => {
//       const imgUrl = $(el).attr("href");
//       if (imgUrl && !images.includes(imgUrl)) {
//         images.push(imgUrl);
//       }
//     });
//
//     const previewPhoto = images[0] || "";
//
//     // Extract services
//     const practices: string[] = [];
//     const bdsm: string[] = [];
//     const massage: string[] = [];
//     const extraServices: string[] = [];
//     const categories: string[] = [];
//
//     $(".description a.bg-secondary").each((i, el) => {
//       const service = $(el).text().trim();
//       if (service) {
//         // Add to practices (ALL services go here)
//         if (!practices.includes(service)) {
//           practices.push(service);
//         }
//
//         // Also add to categories
//         if (!categories.includes(service)) {
//           categories.push(service);
//         }
//
//         // Keep these for backward compatibility
//         const serviceLower = service.toLowerCase();
//         if (serviceLower.includes("bdsm")) {
//           if (!bdsm.includes(service)) bdsm.push(service);
//         } else if (
//           serviceLower.includes("massage") ||
//           serviceLower.includes("handjob") ||
//           serviceLower.includes("fisting")
//         ) {
//           if (!massage.includes(service)) massage.push(service);
//         } else {
//           if (!extraServices.includes(service)) extraServices.push(service);
//         }
//       }
//     });
//
//     // Extract rates
//     const incallText = $(".up-down div:first-child p").text().trim();
//     const outcallText = $(".up-down div:last-child p").text().trim();
//     const incallRate = extractRate(incallText);
//     const outcallRate = extractRate(outcallText);
//
//     // Initialize extracted fields
//     let age = "";
//     let gender = "";
//     let nationality = "";
//     let ethnicity = "";
//     let sexualOrientation = "";
//     const languages: string[] = [];
//     let location = "";
//     let bustSize = "";
//     let height = "";
//     let hairColor = "";
//     let weight = "";
//     let telephone = "";
//     let whatsappPhone = "";
//     let email = "";
//
//     // Extract other details
//     $(".more-info li").each((i, el) => {
//       const label = $(el).find("span:first-child").text().trim().toLowerCase();
//       const value = $(el).find("span:last-child").text().trim();
//       const linkValue = $(el).find("span:last-child a").text().trim() || value;
//
//       switch (label) {
//         case "languages":
//           if (value) {
//             const langs = value.split(",").map((lang) => lang.trim());
//             languages.push(
//               ...langs.filter((lang) => lang && lang !== "N/A" && lang !== ""),
//             );
//           }
//           break;
//         case "orientation":
//           sexualOrientation = value;
//           break;
//         case "ethnicity":
//           ethnicity = value || "";
//           break;
//         case "age":
//           age = value;
//           break;
//         case "nationality":
//           nationality = value;
//           break;
//         case "location":
//           location = linkValue;
//           break;
//         case "bust":
//           bustSize = value || "";
//           break;
//         case "height":
//           const cmMatch = value.match(/(\d+)\s*cm/i);
//           height = cmMatch ? cmMatch[1] + " cm" : value;
//           break;
//         case "hair color":
//           hairColor = value;
//           break;
//         case "gender":
//           gender = value;
//           break;
//       }
//     });
//
//     // Extract contact info
//     const emailMatch = html.match(
//       /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
//     );
//     email = emailMatch
//       ? emailMatch[0]
//       : `${name.toLowerCase().replace(/\s+/g, ".")}@afrohot.com`;
//
//     const phoneMatch = html.match(
//       /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
//     );
//     if (phoneMatch && phoneMatch.length > 0) {
//       telephone = phoneMatch[0];
//       if (html.toLowerCase().includes("whatsapp") || html.includes("wa.me")) {
//         whatsappPhone = phoneMatch[0];
//       }
//     }
//
//     // Create rates array
//     const rates: Array<{ duration: string; incall: string; outcall?: string }> =
//       [];
//     if (incallRate && incallRate !== "ASK") {
//       rates.push({
//         duration: "1 hour",
//         incall: incallRate,
//         outcall: outcallRate !== "ASK" ? outcallRate : "",
//       });
//     }
//
//     // Generate labels
//     const labels: string[] = [];
//     if (bdsm.length > 0) labels.push("BDSM");
//     if (practices.length > 5) labels.push("Many Services");
//     if (images.length > 3) labels.push("Multiple Photos");
//     if (rates.length > 0) labels.push("Rates Available");
//     if (incallRate && incallRate !== "ASK") labels.push("Incall Available");
//     if (outcallRate && outcallRate !== "ASK") labels.push("Outcall Available");
//     if (languages.length > 1) labels.push("Multilingual");
//
//     const availability = ["Available for incalls", "Available for outcalls"];
//
//     // ============ UPDATED: Get Location IDs ============
//     const locationIds = await getLocationIds(county, region, true);
//
//     if (!locationIds.countyId) {
//       const errorMsg = `County "${county}" not found in database. Please add county first.`;
//       console.warn(`⚠️ ${errorMsg}`);
//       await logMissingCounty(county, region, name);
//       return {
//         success: false,
//         action: "skipped",
//         error: errorMsg,
//       };
//     }
//
//     console.log("📍 Location IDs:", {
//       county: locationIds.countyId ? "✅ Found" : "❌ Not found",
//       region: locationIds.regionId ? "✅ Found/Created" : "❌ Not found",
//       countyCode: locationIds.countyCode,
//     });
//
//     // ============ UPDATED: Determine Region ID ============
//     let regionId: Types.ObjectId | null = null;
//
//     // First, try to find region by name
//     if (city && city !== region) {
//       // const Region = (await import("@/models/Region")).default;
//       const foundRegion = await Region.findOne({
//         name: { $regex: new RegExp(`^${city}$`, "i") },
//         county: locationIds.countyId,
//       });
//       if (foundRegion) {
//         regionId = foundRegion._id;
//       }
//     }
//
//     // Fallback to the region from params
//     if (!regionId && locationIds.regionId) {
//       regionId = locationIds.regionId;
//     }
//
//     // ============ UPDATED: Default opening hours ============
//     const defaultOpeningHours = {
//       monday: "Not Specified",
//       tuesday: "Not Specified",
//       wednesday: "Not Specified",
//       thursday: "Not Specified",
//       friday: "Not Specified",
//       saturday: "Not Specified",
//       sunday: "Not Specified",
//     };
//
//     // ============ UPDATED: Map gender to enum ============
//     let mappedGender:
//       | "girl"
//       | "boy"
//       | "transgender"
//       | "non-binary"
//       | "other"
//       | undefined;
//     if (gender) {
//       const genderLower = gender.toLowerCase();
//       if (
//         genderLower.includes("girl") ||
//         genderLower.includes("female") ||
//         genderLower.includes("lady")
//       ) {
//         mappedGender = "girl";
//       } else if (
//         genderLower.includes("boy") ||
//         genderLower.includes("male") ||
//         genderLower.includes("man")
//       ) {
//         mappedGender = "boy";
//       } else if (
//         genderLower.includes("trans") ||
//         genderLower.includes("tgirl") ||
//         genderLower.includes("transgender")
//       ) {
//         mappedGender = "transgender";
//       } else if (
//         genderLower.includes("non-binary") ||
//         genderLower.includes("non binary")
//       ) {
//         mappedGender = "non-binary";
//       } else {
//         mappedGender = "other";
//       }
//     }
//
//     // ============ UPDATED: Prepare location data for new schema ============
//     const regions: Types.ObjectId[] = [];
//     const locations = [];
//
//     if (regionId) {
//       regions.push(regionId);
//
//       // Create location object
//       locations.push({
//         region: regionId,
//         town: city || region,
//         estate: location || "",
//         address: `${location || ""}, ${city || region}, Kenya`,
//         street: location || "",
//         postalCode: "",
//         isActive: true,
//         notes: `Scraped from afrohot.com on ${new Date().toISOString().split("T")[0]}`,
//       });
//     }
//
//     // ============ UPDATED: Prepare data for Mongoose model ============
//     const escortModelData = {
//       // Basic info
//       name: name,
//       username: `${consistentSlug}-${Date.now().toString().slice(-6)}`,
//       previewPhoto: previewPhoto,
//       email: email,
//       labels: labels,
//       age: age || "",
//       telephone: telephone || "",
//       whatsappPhone: whatsappPhone || telephone || "",
//       images: images,
//       videos: [],
//       about: description || "",
//       availability: availability,
//
//       // Demographics
//       ethnicity: ethnicity || "",
//       nationality: nationality || "",
//
//       // Physical attributes
//       bustSize: bustSize || "",
//       weight: weight || "",
//       breastSize: bustSize || "",
//
//       // Other attributes
//       source: "afrohot",
//       zodiacSign: "",
//       sexualOrientation: sexualOrientation || "",
//       gender: mappedGender,
//
//       // Languages and categories
//       languages: languages,
//       categories: [...new Set(categories)],
//
//       // ============ UPDATED: Location fields - Multi-region support ============
//       country: "Kenya",
//       county: locationIds.countyId as Types.ObjectId,
//       countyCode: locationIds.countyCode || "",
//
//       // NEW: Multi-region arrays
//       regions: regions,
//       primaryRegion: regions.length > 0 ? regions[0] : undefined,
//       locations: locations,
//
//       // Services
//       practices: [...new Set(practices)],
//       bdsm: [...new Set(bdsm)],
//       massage: [...new Set(massage)],
//       extraServices: [...new Set(extraServices)],
//
//       // SEO
//       slug: `${consistentSlug}-${Date.now().toString().slice(-6)}`,
//
//       // Hours
//       openingHours: defaultOpeningHours,
//
//       // Rates
//       rates: rates,
//
//       // Role and status
//       role: "escort",
//       isActive: true,
//       isVerified: false,
//       isFeatured: false,
//
//       // Physical attributes (again)
//       // breastSize: bustSize || "",
//       ageCategory: "",
//       character: "",
//       hairColor: hairColor || "",
//       experience: "",
//
//       // Work type
//       workType: "independent",
//
//       // Plan
//       plan: {
//         type: "basic",
//         isActive: true,
//         features: [],
//       },
//
//       // Statistics
//       totalBookings: 0,
//       totalReviews: 0,
//       rating: 0,
//       totalViews: 0,
//
//       // Migration metadata
//       migrationVersion: "2.0",
//       migratedAt: new Date(),
//
//       // Source tracking
//       sourceUrl: escortURL,
//     };
//
//     console.log("escort model data ==>", escortModelData);
//
//     // ============ UPDATED: Check for duplicate ============
//     const existingEscort = await Escort.findOne({
//       $or: [
//         { sourceUrl: escortURL },
//         { slug: consistentSlug },
//         {
//           name: { $regex: new RegExp(`^${name}$`, "i") },
//           "locations.town": city,
//         },
//       ],
//     });
//
//     if (existingEscort) {
//       console.log(
//         `⚠️ Duplicate found: "${name}" from ${city}. Already exists with ID: ${existingEscort._id}`,
//       );
//
//       // ============ UPDATED: Update existing escort with new location if needed ============
//       if (regionId && existingEscort.regions) {
//         // Check if this region is already associated
//         if (
//           !existingEscort.regions.some(
//             (r: Types.ObjectId) => r.toString() === regionId?.toString(),
//           )
//         ) {
//           // Add new region and location to existing escort
//           await Escort.findByIdAndUpdate(existingEscort._id, {
//             $addToSet: {
//               regions: regionId,
//               locations: {
//                 region: regionId,
//                 town: city || region,
//                 estate: location || "",
//                 address: `${location || ""}, ${city || region}, Kenya`,
//                 street: location || "",
//                 postalCode: "",
//                 isActive: true,
//                 notes: `Added from scraper on ${new Date().toISOString().split("T")[0]}`,
//               },
//             },
//           });
//           console.log(`   ✅ Added new region ${city} to existing escort`);
//         }
//       }
//
//       return {
//         _id: existingEscort._id,
//         name: existingEscort.name,
//         slug: existingEscort.slug,
//         plan: existingEscort.plan,
//         isDuplicate: true,
//         existingData: existingEscort,
//       };
//     }
//
//     // ============ UPDATED: Save new escort ============
//     const newEscort = await Escort.create(escortModelData);
//     console.log(`✅ New escort saved: ${newEscort.name} (${newEscort._id})`);
//     console.log(`   📍 Regions: ${newEscort.regions?.length || 0}`);
//     console.log(`   📍 Locations: ${newEscort.locations?.length || 0}`);
//     console.log(`   🛠️ Services: ${newEscort.practices?.length || 0}`);
//
//     return newEscort;
//   } catch (error: any) {
//     console.error("❌ Scraping error for URL:", escortURL);
//     console.error("   Error details:", error.message);
//
//     return {
//       error: true,
//       message: error.message,
//       url: escortURL,
//       name: "Failed to scrape",
//     };
//   }
// }
//
// // Helper to log missing counties
// async function logMissingCounty(
//   countyName: string,
//   regionName: string,
//   escortName?: string,
// ) {
//   const logEntry = {
//     timestamp: new Date(),
//     countyName,
//     regionName,
//     escortName,
//     type: "MISSING_COUNTY",
//   };
//   console.log("📋 Missing County Log:", logEntry);
//
//   // Optional: Save to a database collection
//   // await MissingLocation.create(logEntry);
// }
