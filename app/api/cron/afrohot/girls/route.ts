import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { connectToDB } from "@/lib/mongoose";
import { ScrapGirlandSave } from "../scrapGirlandSave";

const sourceURL = "https://www.afrohot.com/";

export async function POST(request: NextRequest) {
  await connectToDB();
  const { options } = initBrightData();

  const body = await request.json();
  const { county, region } = body;

  console.log(`Starting scrape for ${region}, ${county}`);

  try {
    const destinationPath = `${sourceURL}escorts-from/kenya/${county}/${region}`;
    const response = await axios.get(destinationPath, options);
    const $ = cheerio.load(response.data);

    // Extract all escorts
    const escorts = $("ul.escort-items li.escort-item-one")
      .map((index, element) => {
        const $element = $(element);
        const name = $element.find(".profile-name h5 a").text().trim();
        const link = $element.find(".profile-name h5 a").attr("href") || "";
        const plan =
          $element.find(".plan-badge").text().trim().toLowerCase() || "basic";
        const phone = $element
          .find("p.text-success")
          .text()
          .replace("Phone:", "")
          .trim();
        const description = $element
          .find(".details-sec.text-center p.text-left")
          .text()
          .trim();
        const image = $element.find(".big-img img").attr("src") || "";

        return {
          name,
          plan,
          description,
          phone,
          link: link.startsWith("http")
            ? link
            : `https://www.afrohot.com${link}`,
          image,
          index,
        };
      })
      .get();

    console.log(`Found ${escorts.length} escorts`);

    const savedEscorts = [];
    const duplicateEscorts = [];
    const failedEscorts = [];

    // Process each escort
    for (const [index, escort] of escorts.entries()) {
      try {
        console.log(
          `Processing ${index + 1}/${escorts.length}: ${escort.name}`,
        );

        // Add delay to avoid rate limiting
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Scrape the detailed profile
        const result = await ScrapGirlandSave(escort.link, county, region);

        // Handle the response
        if (result && "error" in result && result.error) {
          console.error(`❌ Failed: ${escort.name} - ${result.message}`);
          failedEscorts.push({
            name: escort.name,
            link: escort.link,
            error: result.message,
          });
        } else if (result && "isDuplicate" in result && result.isDuplicate) {
          console.log(`⚠️ Duplicate: ${escort.name} - Already exists`);
          duplicateEscorts.push({
            name: result.name,
            id: result._id,
            plan: result.plan,
            status: "duplicate",
          });
        } else if (result && "_id" in result) {
          console.log(`✅ Saved: ${result.name}`);
          savedEscorts.push({
            name: result.name,
            id: result._id,
            plan: result.plan || "basic",
            status: "saved",
          });
        } else {
          console.error(`❓ Unknown response for ${escort.name}`);
          failedEscorts.push({
            name: escort.name,
            link: escort.link,
            error: "Unknown response format",
          });
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
      SCRAPING COMPLETE
      ========================================
      Total found: ${escorts.length}
      Newly saved: ${savedEscorts.length}
      Duplicates skipped: ${duplicateEscorts.length}
      Failed: ${failedEscorts.length}
      ========================================
    `);

    return NextResponse.json({
      message: "Scraping completed",
      summary: {
        totalFound: escorts.length,
        saved: savedEscorts.length,
        duplicates: duplicateEscorts.length,
        failed: failedEscorts.length,
      },
      savedEscorts,
      duplicateEscorts,
      failedEscorts,
      rawEscorts: escorts.slice(0, 5), // Return first 5 for reference
    });
  } catch (error: any) {
    console.error("Initial scraping error:", error.message);
    return NextResponse.json(
      {
        error: "Scraping failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
