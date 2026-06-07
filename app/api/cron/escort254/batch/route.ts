// // app/api/scrape/batch/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectToDB } from "@/lib/mongoose";
// import { County } from "@/models/County";
//
// export async function POST(request: NextRequest) {
//   await connectToDB();
//
//   // Get all counties from database
//   const counties = await County.find({ isActive: true }).lean();
//
//   console.log(`📋 Starting batch scrape for ${counties.length} counties`);
//
//   const results = [];
//   let totalEscortsSaved = 0;
//
//   for (const county of counties) {
//     try {
//       console.log(`🔄 Starting scrape for ${county.name}...`);
//
//       // Call the single county scraper
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SITE_URL}/api/escort254/girls`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ county: county.name.replace(" County", "") }),
//         },
//       );
//
//       const data = await response.json();
//
//       const savedCount = data.results?.saved || 0;
//       totalEscortsSaved += savedCount;
//
//       results.push({
//         county: county.name,
//         code: county.code,
//         success: data.success,
//         escortsFound: data.results?.totalFound || 0,
//         saved: savedCount,
//         skipped: data.results?.skipped || 0,
//         failed: data.results?.failed || 0,
//         pagesScraped: data.results?.pagesScraped || 0,
//         error: data.error,
//       });
//
//       console.log(`✅ Completed ${county.name}: Saved ${savedCount} escorts`);
//
//       // Wait between counties to be respectful
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//     } catch (error: any) {
//       console.error(`❌ Failed to scrape ${county.name}:`, error.message);
//       results.push({
//         county: county.name,
//         success: false,
//         error: error.message,
//       });
//     }
//   }
//
//   const successful = results.filter((r) => r.success).length;
//   const failed = results.filter((r) => !r.success).length;
//
//   return NextResponse.json({
//     success: true,
//     message: `Batch scraping completed. Scraped ${successful}/${counties.length} counties, saved ${totalEscortsSaved} escorts total.`,
//     summary: {
//       totalCounties: counties.length,
//       successful,
//       failed,
//       totalEscortsSaved,
//     },
//     results,
//   });
// }
