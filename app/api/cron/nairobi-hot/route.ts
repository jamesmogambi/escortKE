// app/api/scrape-nairobihot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { NairobiHotScraper } from "@/lib/scrapers/nairobihot.scrapers";
import { NairobiHotDatabaseService } from "@/lib/scrapers/nairobihot-db.service";

const listingURL =
  "https://www.nairobihot.com/nairobi-hot-sexy-girls-sweet-erotic-massage-sex/";

// Helper function to make requests with retries
async function makeRequest(
  url: string,
  proxyConfig: any,
  retries = 3,
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`📡 Attempt ${i + 1}/${retries}: Fetching ${url}`);

      const response = await axios.get(url, {
        proxy: proxyConfig,
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
      });

      console.log(`✅ Request successful (Status: ${response.status})`);
      return response;
    } catch (error: any) {
      console.error(`❌ Attempt ${i + 1} failed:`, error.message);

      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Status Text: ${error.response.statusText}`);
      }

      if (i === retries - 1) throw error;

      // Wait longer between retries
      const waitTime = 5000 * (i + 1);
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(request: NextRequest) {
  const { options } = initBrightData();

  const body = await request.json();
  const { fetchFullDetails = true, maxConcurrent = 2, testMode = false } = body;

  console.log(`🚀 Starting scrape for Nairobi Hot Escorts`);
  console.log(`📄 Fetch full details: ${fetchFullDetails}`);
  console.log(`🔧 Test mode: ${testMode}`);

  try {
    // Test mode - just fetch and return HTML structure info
    if (testMode) {
      console.log("🔍 Running in test mode...");

      const response = await makeRequest(listingURL, options);
      const $ = cheerio.load(response.data);

      // Analyze page structure
      const structure = {
        title: $("title").text(),
        htmlLength: response.data.length,
        hasProfilesListing: $(".profiles-listing").length > 0,
        profilePreviewCount: $(".profile-preview").length,
        columnCount: $(".column.threecol").length,
        hasProfiles: NairobiHotScraper.hasEscorts($),
        sampleHTML:
          $(".profiles-listing").html()?.substring(0, 1000) ||
          $("body").html()?.substring(0, 1000),
        firstFewProfiles: $(".profile-preview")
          .slice(0, 2)
          .map((_, el) => {
            return {
              name: $(el).find(".profile-text h5 a").text().trim(),
              phone: $(el).find(".profile-text h3").text().trim(),
              hasLink: $(el).find(".profile-image a").attr("href")
                ? true
                : false,
            };
          })
          .get(),
      };

      return NextResponse.json({
        success: true,
        testMode: true,
        structure,
        message: "Test mode - no data saved",
      });
    }

    console.log(`📡 Fetching main page: ${listingURL}`);
    const response = await makeRequest(listingURL, options);

    const $ = cheerio.load(response.data);

    // Check if page has escorts
    if (!NairobiHotScraper.hasEscorts($)) {
      console.log("No escorts found on page");
      return NextResponse.json({
        success: false,
        message: "No escorts found on page",
        url: listingURL,
        htmlPreview: response.data.substring(0, 1000),
      });
    }

    const scraper = new NairobiHotScraper(response.data);

    // Extract all escorts from the page
    console.log("🔍 Extracting all escorts from page...");
    const escorts = scraper.extractAllEscortsFromPage();

    console.log(`📊 Found ${escorts.length} escorts on the page`);

    if (escorts.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No escorts extracted from page",
        htmlPreview: response.data.substring(0, 2000),
      });
    }

    let totalSaved = 0;
    let totalFailed = 0;

    // Fetch full details for each escort if requested
    if (fetchFullDetails) {
      console.log("🔍 Fetching full details for each escort...");

      // Process in batches to avoid overwhelming the server
      const batchSize = maxConcurrent;
      for (let i = 0; i < escorts.length; i += batchSize) {
        const batch = escorts.slice(i, i + batchSize);
        console.log(
          `📝 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(escorts.length / batchSize)}`,
        );

        const batchPromises = batch.map(async (escort, index) => {
          if (!escort.profileUrl) {
            console.log(`  ⏭️ No profile URL for ${escort.name}`);
            totalFailed++;
            return;
          }

          try {
            console.log(
              `  📝 Fetching details for ${escort.name} (${escort.profileUrl})...`,
            );

            // Use the retry function for profile requests too
            const profileResponse = await makeRequest(
              escort.profileUrl!,
              ,
              2,
            );

            const profileScraper = new NairobiHotScraper(profileResponse.data);
            const fullDetails = await profileScraper.extractFullProfileDetails(
              profileResponse.data,
            );

            // Save to database with full details
            const result = await NairobiHotDatabaseService.saveEscort(
              escort,
              fullDetails,
            );
            if (result.success) {
              totalSaved++;
              console.log(`  ✅ Saved: ${escort.name}`);
            } else {
              totalFailed++;
              console.log(`  ❌ Failed: ${escort.name} - ${result.error}`);
            }
          } catch (error: any) {
            console.error(
              `  ❌ Error fetching details for ${escort.name}:`,
              error.message,
            );
            totalFailed++;
          }
        });

        await Promise.all(batchPromises);

        // Wait between batches
        if (i + batchSize < escorts.length) {
          console.log("⏳ Waiting 3 seconds before next batch...");
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    } else {
      // Save without full details
      for (const escort of escorts) {
        const result = await NairobiHotDatabaseService.saveEscort(escort);
        if (result.success) {
          totalSaved++;
          console.log(`✅ Saved: ${escort.name}`);
        } else {
          totalFailed++;
          console.log(`❌ Failed: ${escort.name}`);
        }
      }
    }

    console.log(`
    📊 Scraping Results:
    - Total escorts found: ${escorts.length}
    - Successfully saved: ${totalSaved}
    - Failed to save: ${totalFailed}
    `);

    return NextResponse.json({
      success: true,
      message: `✅ Successfully scraped ${escorts.length} escorts from Nairobi Hot`,
      results: {
        totalFound: escorts.length,
        saved: totalSaved,
        failed: totalFailed,
        escorts: escorts.slice(0, 10).map((e) => ({
          name: e.name,
          phone: e.telephone,
          location: e.location,
          isVip: e.isVip,
          profileUrl: e.profileUrl,
        })),
      },
    });
  } catch (error: any) {
    console.error("❌ Scraping error:", error.message);

    // Provide more detailed error information
    let errorDetails = error.message;
    if (error.response) {
      errorDetails = `Status: ${error.response.status} - ${error.response.statusText}`;
      console.error("Response data:", error.response.data?.substring(0, 500));
    }

    return NextResponse.json(
      {
        success: false,
        error: "Scraping failed",
        details: errorDetails,
        tip: "Make sure your BrightData credentials are correct in .env.local",
      },
      { status: 500 },
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fetchFullDetails = searchParams.get("fetchFullDetails") === "true";
  const maxConcurrent = parseInt(searchParams.get("maxConcurrent") || "2");
  const testMode = searchParams.get("testMode") === "true";

  const mockRequest = {
    json: async () => ({ fetchFullDetails, maxConcurrent, testMode }),
  } as NextRequest;

  return POST(mockRequest);
}
