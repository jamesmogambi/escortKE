// app/api/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { Escort254Scraper } from "@/lib/scrapers/escort254.scraper";
import { EscortDatabaseService } from "@/lib/scrapers/escort-db.service";
import { connectToDB } from "@/lib/mongoose";

const sourceURL = "https://escort254.com/";

export async function POST(request: NextRequest) {
  await connectToDB();
  const { options } = initBrightData();

  const body = await request.json();
  const { county } = body;

  console.log(`🚀 Starting scrape for ${county} - Female Escorts Only`);

  try {
    // First verify the county exists in your database
    const countyId = await EscortDatabaseService.getCountyByName(county);
    if (!countyId) {
      return NextResponse.json(
        {
          success: false,
          error: "County not found in database",
          details: `County "${county}" does not exist. Please add it first.`,
        },
        { status: 404 },
      );
    }

    // Construct the URL
    const destinationPath = `${sourceURL}${county.toLowerCase().replace(/\s+/g, "-")}-county-escorts`;
    console.log(`📡 Fetching: ${destinationPath}`);

    const response = await axios.get(destinationPath, {
      ...options,
      timeout: 30000,
      headers: {
        ...options.headers,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Check if page has escorts
    if (!Escort254Scraper.hasEscorts($)) {
      return NextResponse.json({
        success: false,
        message: `No escorts found on page for ${county}`,
        url: destinationPath,
      });
    }

    const scraper = new Escort254Scraper(response.data);

    // Extract all escorts from the page
    console.log("🔍 Extracting escorts from page...");
    const escorts = scraper.extractAllEscorts();

    console.log(`📊 Found ${escorts.length} potential escorts on the page`);
    console.log(`⚧️ Filtering for female escorts only...`);

    // Save to database
    console.log("💾 Saving escorts to database...");
    const results = await EscortDatabaseService.saveEscorts(escorts);

    console.log(`
    📊 Scraping Results for ${county}:
    - Total cards found: ${escorts.length}
    - Successfully saved: ${results.success}
    - Failed to save: ${results.failed}
    - Skipped (male/trans/invalid): ${results.skipped}
    `);

    // Check for pagination and scrape next pages
    let nextPageUrl = Escort254Scraper.getNextPageUrl($, destinationPath);
    let pageCount = 1;
    let allEscorts = [...escorts];
    let totalSaved = results.success;
    let totalSkipped = results.skipped;
    let totalFailed = results.failed;

    while (nextPageUrl && pageCount < 10) {
      // Limit to 10 pages
      console.log(`📄 Scraping page ${pageCount + 1}: ${nextPageUrl}`);

      try {
        const nextResponse = await axios.get(nextPageUrl, options);
        const next$ = cheerio.load(nextResponse.data);

        if (!Escort254Scraper.hasEscorts(next$)) {
          break;
        }
 
        const nextScraper = new Escort254Scraper(nextResponse.data);
        const nextPageEscorts = nextScraper.extractAllEscorts();

        allEscorts = [...allEscorts, ...nextPageEscorts];

        // Save next page escorts
        const nextResults =
          await EscortDatabaseService.saveEscorts(nextPageEscorts);
        totalSaved += nextResults.success;
        totalSkipped += nextResults.skipped;
        totalFailed += nextResults.failed;

        // Get next page URL
        nextPageUrl = Escort254Scraper.getNextPageUrl(next$, nextPageUrl);
        pageCount++;

        // Wait between pages
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (pageError) {
        console.error(`Error scraping page ${pageCount + 1}:`, pageError);
        break;
      }
    }

    return NextResponse.json({
      success: true,
      message: `✅ Successfully scraped ${allEscorts.length} female escorts from ${county}`,
      results: {
        totalFound: allEscorts.length,
        pagesScraped: pageCount,
        saved: totalSaved,
        failed: totalFailed,
        skipped: totalSkipped,
        county: county,
        escorts: allEscorts.map((e) => ({
          name: e.name,
          phone: e.telephone,
          location: e.location,
          isVip: e.isVip,
          saved: e.telephone ? true : false,
        })),
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
      },
      { status: 500 },
    );
  }
}
