// import { NextRequest, NextResponse } from "next/server";
// import { initBrightData } from "@/lib/brightData";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { sql } from "@/lib/neon";
// const sourceURL = "https://www.kenyahotgirls.com/";
// export async function POST(request: NextRequest) {
//   const { options } = initBrightData();
//   try {
//     const response = await axios.get(sourceURL, options);
//     const $ = cheerio.load(response.data);
//     const countiesWithRegions: { county: string; regions: string[] }[] = [];

//     // Scrape counties and regions
//     $(".country-list > .cat-item").each((_, countyEl) => {
//       const countyName = $(countyEl).find("> a").text().trim();
//       const regions: string[] = [];

//       $(countyEl)
//         .find(".children > .cat-item > a")
//         .each((_, regionEl) => {
//           const regionName = $(regionEl).text().trim();
//           if (regionName) regions.push(regionName);
//         });

//       if (countyName) {
//         countiesWithRegions.push({ county: countyName, regions });
//       }
//     });
//     // Insert counties and regions into the database
//     for (const { county, regions } of countiesWithRegions) {
//       // Insert county and get its ID
//       const countyRes = await sql`
//       INSERT INTO counties (name)
//       VALUES (${county})
//       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
//       RETURNING id
//     `;
//       const countyId = countyRes[0].id;
//     }

//     return NextResponse.json({
//       message: "Counties and regions scraped and saved successfully!",
//       // response: response,
//       count: countiesWithRegions,
//     });
//   } catch (error: any) {
//     console.error("Scraping error:", error.message);
//     return NextResponse.json(
//       { error: "Scraping failed", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { initBrightData } from "@/lib/brightData";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { connectToDB } from "@/lib/mongoose";
// import { Town } from "@/models/Town";
// import { Region as LocationRegion } from "@/models/Region";
// const sourceURL = "https://www.kenyahotgirls.com/";
//
// export async function POST(request: NextRequest) {
//   await connectToDB();
//   const { options } = initBrightData();
//
//   try {
//     const response = await axios.get(sourceURL, options);
//     const $ = cheerio.load(response.data);
//     const regionsWithTowns: { Region: string; Towns: string[] }[] = [];
//     // Scrape Regions with respective towns
//     $(".country-list > .cat-item").each((_, countyEl) => {
//       const RegionName = $(countyEl).find("> a").text().trim();
//       const Towns: string[] = [];
//       $(countyEl)
//         .find(".children > .cat-item > a")
//         .each((_, regionEl) => {
//           const regionName = $(regionEl).text().trim();
//           if (regionName) Towns.push(regionName);
//         });
//       if (RegionName) {
//         regionsWithTowns.push({ Region: RegionName, Towns });
//       }
//     });
//     // Insert towns and regions into the database
//     for (const { Towns, Region } of regionsWithTowns) {
//       // Upsert county
//       const countyDoc = await LocationRegion.findOneAndUpdate(
//         { name: Region },
//         { name: Region },
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );
//
//       // Insert regions referencing the county
//       for (const region of Towns) {
//         await Town.findOneAndUpdate(
//           { name: region, region: countyDoc._id },
//           { name: region, region: countyDoc._id },
//           { upsert: true, new: true, setDefaultsOnInsert: true }
//         );
//       }
//     }
//
//     return NextResponse.json({
//       message: "Cities and regions scraped and saved successfully!",
//       count: regionsWithTowns.length, // You might want to return the number of counties instead
//       data: regionsWithTowns,
//     });
//   } catch (error: any) {
//     console.error("Scraping error:", error.message);
//     return NextResponse.json(
//       { error: "Scraping failed", details: error.message },
//       { status: 500 }
//     );
//   }
// }
