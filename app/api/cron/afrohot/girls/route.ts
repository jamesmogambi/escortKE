// import { NextRequest, NextResponse } from "next/server";
// import { initBrightData } from "@/lib/brightData";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { connectToDB } from "@/lib/mongoose";
// import { slugify } from "@/lib/utils";
// import { ScrapGirlandSave } from "../scrapGirlandSave";

// const sourceURL = "https://www.afrohot.com/";

// export async function POST(request: NextRequest) {
//   await connectToDB();
//   const { options } = initBrightData();

//   const body = await request.json();
//   const { county, region } = body;

//   console.log("county and region", county, region);

//   try {
//     // Fetch HTML using Bright Data proxy service
//     // region should be in format nairobi-west (with hyphen)
//     const destinationPath = `${sourceURL}escorts-from/kenya/${county}/${region}`;
//     const response = await axios.get(destinationPath, options);
//     const $ = cheerio.load(response.data);

//     //  Find all escort items and extract data
//     const girls: any[] = [];

//     const escorts = $("ul.escort-items li.escort-item-one")
//       .map((index, element) => {
//         const $element = $(element);

//         // Extract name from the h5 > a link
//         const name = $element.find(".profile-name h5 a").text().trim();

//         // Extract the individual escort's page link
//         const link = $element.find(".profile-name h5 a").attr("href") || "";

//         // Extract plan (BASIC, etc.) from the .plan-badge div
//         const plan = $element.find(".plan-badge").text().trim();

//         // Extract phone number from the text-success paragraph
//         const phone = $element
//           .find("p.text-success")
//           .text()
//           .replace("Phone:", "")
//           .trim();

//         // Extract description from the text-left paragraph
//         const description = $element
//           .find(".details-sec.text-center p.text-left")
//           .text()
//           .trim();

//         // Extract image URL
//         const image = $element.find(".big-img img").attr("src") || "";

//         return {
//           name,
//           plan,
//           description,
//           phone,
//           link: link.startsWith("http")
//             ? link
//             : `https://www.afrohot.com${link}`,
//           image,
//           // Optional: Add index for ordering
//           index,
//         };
//       })
//       .get(); // Convert Cheerio object to array

//     // // 🔄 Loop over girls & scrape full profile data

//     //   const name = $(el).find(".girl-name").text().trim();
//     //   const location = $(el).find(".girl-desc-location").text().trim();
//     //   const imageUrl = $(el).find('img[itemprop="image"]').attr("src") || "";
//     //   const profileUrl = $(el).find("a[title]").attr("href") || "";
//     //   const phone = $(el).find('a[href^="tel:"]').text().trim();

//     //   girls.push({ name, location, imageUrl, profileUrl, phone });
//     // });

//     // // 🔄 Loop over girls & scrape full profile data
//     // const fullProfiles = [];
//     // for (const girl of girls) {
//     //   // Extract slug from her profileUrl or use slugify
//     //   // const slug = girl.profileUrl
//     //   //   ? girl.profileUrl.replace(/\/$/, "").split("/").pop()
//     //   //   : slugify(girl.name);
//     //   const slug = slugify(girl.name);

//     //   try {
//     //     const escortRegion = county;
//     //     const escortTown = region;
//     //     const profileData = await ScrapGirlandSave(
//     //       slug,
//     //       escortRegion,
//     //       escortTown,
//     //     );
//     //     // merge basic list data with profile scrape
//     //     fullProfiles.push(profileData);
//     //   } catch (err) {
//     //     console.error(`Failed to scrape ${girl.name}:`, err);
//     //   }
//     // }

//     // 💾 Optionally save to DB here in bulk
//     // await EscortModel.insertMany(fullProfiles);

//     return NextResponse.json({
//       message: "Escorts scraped successfully!",
//       escorts: escorts,
//       count: escorts.length,
//       //   count: fullProfiles.length,
//       //   data: fullProfiles,
//     });
//   } catch (error: any) {
//     console.error("Scraping error:", error.message);
//     return NextResponse.json(
//       { error: "Scraping failed", details: error.message },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort"; // Import your model
import { ScrapGirlandSave } from "../scrapGirlandSave";

const sourceURL = "https://www.afrohot.com/";

export async function POST(request: NextRequest) {
  await connectToDB();
  const { options } = initBrightData();

  const body = await request.json();
  const { county, region } = body;

  console.log("county and region", county, region);

  try {
    // Fetch HTML using Bright Data proxy service
    const destinationPath = `${sourceURL}escorts-from/kenya/${county}/${region}`;
    const response = await axios.get(destinationPath, options);
    const $ = cheerio.load(response.data);

    // Find all escort items and extract basic data
    const escorts = $("ul.escort-items li.escort-item-one")
      .map((index, element) => {
        const $element = $(element);

        // Extract name from the h5 > a link
        const name = $element.find(".profile-name h5 a").text().trim();

        // Extract the individual escort's page link
        const link = $element.find(".profile-name h5 a").attr("href") || "";

        // Extract plan (BASIC, etc.) from the .plan-badge div
        const plan = $element.find(".plan-badge").text().trim();

        // Extract phone number from the text-success paragraph
        const phone = $element
          .find("p.text-success")
          .text()
          .replace("Phone:", "")
          .trim();

        // Extract description from the text-left paragraph
        const description = $element
          .find(".details-sec.text-center p.text-left")
          .text()
          .trim();

        // Extract image URL
        const image = $element.find(".big-img img").attr("src") || "";

        // Extract age if available
        const age = $element
          .find(".details-sec.text-center p")
          .filter((i, el) => $(el).text().includes("Age:"))
          .text()
          .replace("Age:", "")
          .trim();

        // Extract location if available
        const location = $element
          .find(".details-sec.text-center p")
          .filter((i, el) => $(el).text().includes("Location:"))
          .text()
          .replace("Location:", "")
          .trim();

        return {
          name,
          plan: plan.toLowerCase() || "basic",
          description,
          phone,
          link: link.startsWith("http")
            ? link
            : `https://www.afrohot.com${link}`,
          image,
          age,
          location: location || region,
          index,
        };
      })
      .get(); // Convert Cheerio object to array

    console.log(`Found ${escorts.length} escorts to scrape`);

    // Array to store all scraped and saved escorts
    const savedEscorts = [];
    const failedEscorts = [];

    // Process each escort with rate limiting
    for (const [index, escort] of escorts.entries()) {
      try {
        console.log(
          `Processing escort ${index + 1}/${escorts.length}: ${escort.name}`,
        );

        // Add delay to avoid being blocked (1-2 seconds between requests)
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }

        // Check if escort already exists by link or name+location
        const existingEscort = await Escort.findOne({
          $or: [
            { sourceUrl: escort.link },
            {
              name: escort.name,
              town: region,
              country: county,
            },
          ],
        });

        if (existingEscort) {
          console.log(`Escort "${escort.name}" already exists, skipping...`);
          savedEscorts.push({
            ...escort,
            id: existingEscort._id,
            status: "already_exists",
          });
          continue;
        }

        // Scrape detailed profile using ScrapGirlandSave
        const detailedProfile = await ScrapGirlandSave(
          escort.link, // Use the full profile URL
          county, // Pass county
          region, // Pass region
        );

        // If ScrapGirlandSave returns an error object
        if (detailedProfile && detailedProfile.error) {
          console.error(
            `Failed to scrape ${escort.name}: ${detailedProfile.message}`,
          );
          failedEscorts.push({
            name: escort.name,
            link: escort.link,
            error: detailedProfile.message,
          });
          continue;
        }

        // If ScrapGirlandSave returns the saved Mongoose document
        if (detailedProfile && detailedProfile._id) {
          savedEscorts.push({
            name: detailedProfile.name,
            id: detailedProfile._id,
            plan: detailedProfile.plan || "basic",
            status: "saved",
          });
          console.log(`✅ Saved: ${detailedProfile.name}`);
        } else {
          // If ScrapGirlandSave only returns data without saving, save it now
          const escortData = {
            name: detailedProfile.name || escort.name,
            previewPhoto: detailedProfile.previewPhoto || escort.image,
            email:
              detailedProfile.email ||
              `${escort.name.toLowerCase().replace(/\s+/g, ".")}@afrohot.com`,
            labels: detailedProfile.labels || [],
            age: detailedProfile.age || escort.age || "",
            telephone: detailedProfile.telephone || escort.phone || "",
            whatsappPhone: detailedProfile.whatsappPhone || "",
            images: detailedProfile.images || [escort.image],
            videos: detailedProfile.videos || [],
            about: detailedProfile.description || escort.description || "",
            availability: detailedProfile.availability || [
              "Available for incalls",
              "Available for outcalls",
            ],
            ethnicity: detailedProfile.ethnicity || "",
            nationality: detailedProfile.nationality || "",
            bustSize: detailedProfile.bustSize || "",
            weight: detailedProfile.weight || "",
            source: detailedProfile.source || "afrohot",
            sexualOrientation: detailedProfile.sexualOrientation || "",
            languages: detailedProfile.languages || [],
            categories: detailedProfile.categories || [],
            estate: detailedProfile.location || escort.location || region,
            town: detailedProfile.city || region,
            address:
              detailedProfile.address ||
              `${escort.location || region}, ${region}, ${county}`,
            practices: detailedProfile.practices || [],
            bdsm: detailedProfile.bdsm || [],
            massage: detailedProfile.massage || [],
            extraServices: detailedProfile.extraServices || [],
            slug:
              detailedProfile.slug ||
              `${escort.name.toLowerCase().replace(/\s+/g, "-")}-${region.toLowerCase().replace(/\s+/g, "-")}`,
            openingHours: detailedProfile.openingHours || {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            },
            rates: detailedProfile.rates || [],
            role: "escort" as const,
            isActive: true,
            isVerified: false,
            street: detailedProfile.location || escort.location || region,
            region: detailedProfile.city || region,
            user: undefined,
            breastSize: detailedProfile.bustSize || "",
            ageCategory: detailedProfile.ageCategory || "",
            character: detailedProfile.character || "",
            hairColor: detailedProfile.hairColor || "",
            experience: detailedProfile.experience || "",
            plan:
              (detailedProfile.plan as "basic" | "vip" | "premium") ||
              (escort.plan as "basic" | "vip" | "premium") ||
              "basic",
            sourceUrl: escort.link,
          };

          // Save to database
          const newEscort = new Escort(escortData);
          await newEscort.save();

          savedEscorts.push({
            name: newEscort.name,
            id: newEscort._id,
            plan: newEscort.plan,
            status: "saved",
          });
          console.log(`✅ Saved: ${newEscort.name}`);
        }
      } catch (error: any) {
        console.error(`Error processing ${escort.name}:`, error.message);
        failedEscorts.push({
          name: escort.name,
          link: escort.link,
          error: error.message,
        });
      }
    }

    // Summary
    console.log(`
      ========================================
      SCRAPING SUMMARY
      ========================================
      Total escorts found: ${escorts.length}
      Successfully saved: ${savedEscorts.filter((e) => e.status === "saved").length}
      Already existed: ${savedEscorts.filter((e) => e.status === "already_exists").length}
      Failed: ${failedEscorts.length}
      ========================================
    `);

    return NextResponse.json({
      message: "Escorts scraping completed!",
      summary: {
        totalFound: escorts.length,
        saved: savedEscorts.filter((e) => e.status === "saved").length,
        alreadyExisted: savedEscorts.filter(
          (e) => e.status === "already_exists",
        ).length,
        failed: failedEscorts.length,
      },
      savedEscorts: savedEscorts,
      failedEscorts: failedEscorts,
      rawEscorts: escorts, // For debugging
    });
  } catch (error: any) {
    console.error("Scraping error:", error.message);
    return NextResponse.json(
      {
        error: "Scraping failed",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
