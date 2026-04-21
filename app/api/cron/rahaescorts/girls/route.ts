// // app/api/scrape-rahaescorts/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { initBrightData } from "@/lib/brightData";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { RahaEscortsScraper } from "@/lib/scrapers/rahaescorts.scraper";
// import { RahaEscortsDatabaseService } from "@/lib/scrapers/rahaescorts-db.service";

// const sourceURL = "https://rahaescorts.com/escorts/";
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export async function POST(request: NextRequest) {
//   const { options } = initBrightData();

//   const body = await request.json();
//   const {
//     county,
//     region,
//     maxConcurrent = 2,
//     skipCountyCheck = true,
//     onlyFemale = true,
//   } = body;

//   console.log(`🚀 Starting scrape for Raha Escorts`);
//   console.log(`📍 County: ${county}, Region: ${region}`);
//   console.log(`🔧 Max concurrent: ${maxConcurrent}`);
//   console.log(`👩 Only female escorts: ${onlyFemale}`);

//   try {
//     if (!skipCountyCheck) {
//       const countyId = await RahaEscortsDatabaseService.getCountyByName(county);
//       if (!countyId) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: "County not found in database",
//             details: `County "${county}" does not exist. Set skipCountyCheck=true to bypass.`,
//           },
//           { status: 404 },
//         );
//       }
//     }

//     const countySlug = county.toLowerCase().replace(/\s+/g, "-");
//     const regionSlug = region.toLowerCase().replace(/\s+/g, "-");
//     const destinationPath = `${sourceURL}${countySlug}/${regionSlug}`;

//     console.log(`📡 Fetching: ${destinationPath}`);

//     const response = await axios.get(destinationPath, {
//       ...options,
//       timeout: 60000,
//       headers: {
//         ...options.headers,
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//       },
//     });

//     const $ = cheerio.load(response.data);

//     if (!RahaEscortsScraper.hasEscorts($)) {
//       return NextResponse.json({
//         success: false,
//         message: `No escorts found on page for ${county}/${region}`,
//         url: destinationPath,
//       });
//     }

//     const scraper = new RahaEscortsScraper(response.data);
//     const escorts = scraper.extractAllEscortsFromPage();

//     console.log(`📊 Found ${escorts.length} total escorts on the page`);

//     if (escorts.length === 0) {
//       return NextResponse.json({
//         success: false,
//         message: "No escorts extracted from page",
//       });
//     }

//     const savedEscorts: any[] = [];
//     let totalSaved = 0;
//     let totalFailed = 0;
//     let totalSkipped = 0;

//     for (let i = 0; i < escorts.length; i += maxConcurrent) {
//       const batch = escorts.slice(i, i + maxConcurrent);
//       console.log(
//         `📝 Processing batch ${Math.floor(i / maxConcurrent) + 1}/${Math.ceil(escorts.length / maxConcurrent)}`,
//       );

//       const batchPromises = batch.map(async (escort) => {
//         if (!escort.profileUrl || !escort.slug) {
//           console.log(`  ⏭️ No profile URL or slug for ${escort.name}`);
//           totalFailed++;
//           return;
//         }

//         try {
//           console.log(`  📝 Fetching details for ${escort.name}...`);

//           const profileResponse = await axios.get(escort.profileUrl, {
//             ...options,
//             timeout: 60000,
//             headers: {
//               ...options.headers,
//               "User-Agent":
//                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//             },
//           });

//           const profileScraper = new RahaEscortsScraper(profileResponse.data);
//           const fullDetails = await profileScraper.extractFullProfileDetails(
//             profileResponse.data,
//             county,
//             region,
//           );

//           console.log(`  🚺 Gender for ${escort.name}: ${fullDetails.gender}`);

//           if (
//             onlyFemale &&
//             fullDetails.gender &&
//             fullDetails.gender.toLowerCase() !== "female"
//           ) {
//             console.log(
//               `  ⏭️ Skipping ${escort.name} - Gender: ${fullDetails.gender} (not female)`,
//             );
//             totalSkipped++;
//             return;
//           }

//           const result = await RahaEscortsDatabaseService.saveEscort(
//             escort,
//             fullDetails,
//           );
//           if (result.success) {
//             totalSaved++;
//             savedEscorts.push({
//               name: fullDetails.name || escort.name,
//               slug: fullDetails.slug || escort.slug,
//               phone: fullDetails.telephone,
//               age: fullDetails.age,
//               gender: fullDetails.gender,
//               images: fullDetails.images?.length || 0,
//             });
//             console.log(
//               `  ✅ Saved: ${fullDetails.name || escort.name} (Age: ${fullDetails.age || "N/A"}, Gender: ${fullDetails.gender}, Images: ${fullDetails.images?.length || 0})`,
//             );
//           } else {
//             totalFailed++;
//             console.log(`  ❌ Failed: ${escort.name} - ${result.error}`);
//           }
//         } catch (error: any) {
//           console.error(`  ❌ Error for ${escort.name}:`, error.message);
//           totalFailed++;
//         }
//       });

//       await Promise.all(batchPromises);

//       if (i + maxConcurrent < escorts.length) {
//         console.log("⏳ Waiting 2 seconds...");
//         await delay(2000);
//       }
//     }

//     console.log(`
//     📊 Results for ${county}/${region}:
//     - Found: ${escorts.length}
//     - Saved: ${totalSaved}
//     - Failed: ${totalFailed}
//     - Skipped (non-female): ${totalSkipped}
//     `);

//     return NextResponse.json({
//       success: true,
//       message: `✅ Saved ${totalSaved} female escorts from ${county}/${region}`,
//       results: {
//         totalFound: escorts.length,
//         saved: totalSaved,
//         failed: totalFailed,
//         skipped: totalSkipped,
//         county,
//         region,
//         escorts: savedEscorts,
//       },
//     });
//   } catch (error: any) {
//     console.error("❌ Scraping error:", error.message);

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Scraping failed",
//         details: error.message,
//         county,
//         region,
//       },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams;
//   const county = searchParams.get("county") || "mombasa";
//   const region = searchParams.get("region") || "nyali";
//   const maxConcurrent = parseInt(searchParams.get("maxConcurrent") || "2");
//   const skipCountyCheck = searchParams.get("skipCountyCheck") !== "false";
//   const onlyFemale = searchParams.get("onlyFemale") !== "false";

//   const mockRequest = {
//     json: async () => ({
//       county,
//       region,
//       maxConcurrent,
//       skipCountyCheck,
//       onlyFemale,
//     }),
//   } as NextRequest;

//   return POST(mockRequest);
// }

// app/api/scrape-rahaescorts/route.ts (updated with region storage)
import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { RahaEscortsScraper } from "@/lib/scrapers/rahaescorts.scraper";
import { RahaEscortsDatabaseService } from "@/lib/scrapers/rahaescorts-db.service";
import RegionService from "@/lib/services/region.service";

const sourceURL = "https://rahaescorts.com/escorts/";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  const { options } = initBrightData();

  const body = await request.json();
  const {
    county,
    region,
    maxConcurrent = 2,
    skipCountyCheck = true,
    onlyFemale = true,
    storeRegion = true,
  } = body;

  console.log(`🚀 Starting scrape for Raha Escorts`);
  console.log(`📍 County: ${county}, Region: ${region}`);
  console.log(`🔧 Max concurrent: ${maxConcurrent}`);
  console.log(`👩 Only female escorts: ${onlyFemale}`);
  console.log(`💾 Store region: ${storeRegion}`);

  try {
    let countyId = null;
    let regionDoc = null;

    if (!skipCountyCheck) {
      countyId = await RahaEscortsDatabaseService.getCountyByName(county);
      if (!countyId) {
        return NextResponse.json(
          {
            success: false,
            error: "County not found in database",
            details: `County "${county}" does not exist. Set skipCountyCheck=true to bypass.`,
          },
          { status: 404 },
        );
      }
    }

    // Store region in Regions collection
    if (storeRegion) {
      try {
        regionDoc = await RegionService.getOrCreateRegion(
          region, // region name
          county, // county name
          countyId || county, // county ID
          {
            notes: `Auto-created from RahaEscorts scraping`,
          },
        );
        console.log(
          `📌 Region saved to Regions collection: ${regionDoc.region} (${regionDoc.id})`,
        );
      } catch (regionError) {
        console.error("Error storing region:", regionError);
      }
    }

    const countySlug = county.toLowerCase().replace(/\s+/g, "-");
    const regionSlug = region.toLowerCase().replace(/\s+/g, "-");
    const destinationPath = `${sourceURL}${countySlug}/${regionSlug}`;

    console.log(`📡 Fetching: ${destinationPath}`);

    const response = await axios.get(destinationPath, {
      ...options,
      timeout: 60000,
      headers: {
        ...options.headers,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    if (!RahaEscortsScraper.hasEscorts($)) {
      return NextResponse.json({
        success: false,
        message: `No escorts found on page for ${county}/${region}`,
        url: destinationPath,
      });
    }

    const scraper = new RahaEscortsScraper(response.data);
    const escorts = scraper.extractAllEscortsFromPage();

    console.log(`📊 Found ${escorts.length} total escorts on the page`);

    if (escorts.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No escorts extracted from page",
      });
    }

    const savedEscorts: any[] = [];
    let totalSaved = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (let i = 0; i < escorts.length; i += maxConcurrent) {
      const batch = escorts.slice(i, i + maxConcurrent);
      console.log(
        `📝 Processing batch ${Math.floor(i / maxConcurrent) + 1}/${Math.ceil(escorts.length / maxConcurrent)}`,
      );

      const batchPromises = batch.map(async (escort) => {
        if (!escort.profileUrl || !escort.slug) {
          console.log(`  ⏭️ No profile URL or slug for ${escort.name}`);
          totalFailed++;
          return;
        }

        try {
          console.log(`  📝 Fetching details for ${escort.name}...`);

          const profileResponse = await axios.get(escort.profileUrl, {
            ...options,
            timeout: 60000,
            headers: {
              ...options.headers,
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          });

          const profileScraper = new RahaEscortsScraper(profileResponse.data);
          const fullDetails = await profileScraper.extractFullProfileDetails(
            profileResponse.data,
            county,
            region,
          );

          // Add region reference to fullDetails
          if (regionDoc) {
            fullDetails.regionId = regionDoc.id;
            fullDetails.regionName = regionDoc.region;
          }

          console.log(`  🚺 Gender for ${escort.name}: ${fullDetails.gender}`);

          if (
            onlyFemale &&
            fullDetails.gender &&
            fullDetails.gender.toLowerCase() !== "female"
          ) {
            console.log(
              `  ⏭️ Skipping ${escort.name} - Gender: ${fullDetails.gender} (not female)`,
            );
            totalSkipped++;
            return;
          }

          const result = await RahaEscortsDatabaseService.saveEscort(
            escort,
            fullDetails,
          );
          if (result.success) {
            totalSaved++;
            savedEscorts.push({
              name: fullDetails.name || escort.name,
              slug: fullDetails.slug || escort.slug,
              phone: fullDetails.telephone,
              age: fullDetails.age,
              gender: fullDetails.gender,
              images: fullDetails.images?.length || 0,
              regionId: regionDoc?.id,
              regionName: regionDoc?.region,
            });
            console.log(
              `  ✅ Saved: ${fullDetails.name || escort.name} (Age: ${fullDetails.age || "N/A"}, Gender: ${fullDetails.gender}, Images: ${fullDetails.images?.length || 0}, Region: ${regionDoc?.region || region})`,
            );
          } else {
            totalFailed++;
            console.log(`  ❌ Failed: ${escort.name} - ${result.error}`);
          }
        } catch (error: any) {
          console.error(`  ❌ Error for ${escort.name}:`, error.message);
          totalFailed++;
        }
      });

      await Promise.all(batchPromises);

      if (i + maxConcurrent < escorts.length) {
        console.log("⏳ Waiting 2 seconds...");
        await delay(2000);
      }
    }

    console.log(`
    📊 Results for ${county}/${region}:
    - Found: ${escorts.length}
    - Saved: ${totalSaved}
    - Failed: ${totalFailed}
    - Skipped (non-female): ${totalSkipped}
    - Region stored in Regions collection: ${regionDoc ? "Yes (ID: " + regionDoc.id + ")" : "No"}
    `);

    return NextResponse.json({
      success: true,
      message: `✅ Saved ${totalSaved} female escorts from ${county}/${region}`,
      results: {
        totalFound: escorts.length,
        saved: totalSaved,
        failed: totalFailed,
        skipped: totalSkipped,
        county,
        region: regionDoc
          ? {
              name: regionDoc.region,
              id: regionDoc.id,
              stored: true,
            }
          : {
              name: region,
              stored: false,
            },
        escorts: savedEscorts,
      },
    });
  } catch (error: any) {
    console.error("❌ Scraping error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Scraping failed",
        details: error.message,
        county,
        region,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const county = searchParams.get("county") || "mombasa";
  const region = searchParams.get("region") || "nyali";
  const maxConcurrent = parseInt(searchParams.get("maxConcurrent") || "2");
  const skipCountyCheck = searchParams.get("skipCountyCheck") !== "false";
  const onlyFemale = searchParams.get("onlyFemale") !== "false";
  const storeRegion = searchParams.get("storeRegion") !== "false";

  const mockRequest = {
    json: async () => ({
      county,
      region,
      maxConcurrent,
      skipCountyCheck,
      onlyFemale,
      storeRegion,
    }),
  } as NextRequest;

  return POST(mockRequest);
}
