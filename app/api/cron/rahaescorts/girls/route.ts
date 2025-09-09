import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { connectToDB } from "@/lib/mongoose";
import { ScrapGirlandSave } from "./scrapGirlandSave";
import { slugify } from "@/lib/utils";

const sourceURL = "https://rahaescorts.com/";

// export async function POST(request: NextRequest) {
//   await connectToDB();
//   const { options } = initBrightData();

//   const body = await request.json();
//   const { city, region } = body;

//   console.log("city and region", city, region);

//   try {
//     const destinationPath = `${sourceURL}escorts/${city}/${region}`;
//     const response = await axios.get(destinationPath, options);
//     const $ = cheerio.load(response.data);
//     // TODO:scrap escorts for the given town oir region in a given county

//     const girls: any = [];
//     $(".girl").each((_, el) => {
//       const name = $(el).find(".girl-name").text().trim();
//       const location = $(el).find(".girl-desc-location").text().trim();
//       const imageUrl = $(el).find('img[itemprop="image"]').attr("src") || "";
//       const profileUrl = $(el).find("a[title]").attr("href") || "";
//       const phone = $(el).find('a[href^="tel:"]').text().trim();

//       girls.push({ name, location, imageUrl, profileUrl, phone });
//     });

//     // TODO:scrap data from indidvidual girl

//     //TODO: sav to DB ALL THE RECORDS

//     // return response
//     return NextResponse.json({
//       message: "Escorts scraped successfully!",
//       count: 0, // You might want to return the number of counties instead
//       data: girls,
//     });
//   } catch (error: any) {
//     console.error("Scraping error:", error.message);
//     return NextResponse.json(
//       { error: "Scraping failed", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  await connectToDB();
  const { options } = initBrightData();

  const body = await request.json();
  const { city, region } = body;

  console.log("city and region", city, region);

  try {
    const destinationPath = `${sourceURL}escorts/${city}/${region}`;
    const response = await axios.get(destinationPath, options);
    const $ = cheerio.load(response.data);

    const girls: any[] = [];

    $(".girl").each((_, el) => {
      const name = $(el).find(".girl-name").text().trim();
      const location = $(el).find(".girl-desc-location").text().trim();
      const imageUrl = $(el).find('img[itemprop="image"]').attr("src") || "";
      const profileUrl = $(el).find("a[title]").attr("href") || "";
      const phone = $(el).find('a[href^="tel:"]').text().trim();

      girls.push({ name, location, imageUrl, profileUrl, phone });
    });

    // 🔄 Loop over girls & scrape full profile data
    const fullProfiles = [];
    for (const girl of girls) {
      // Extract slug from her profileUrl or use slugify
      // const slug = girl.profileUrl
      //   ? girl.profileUrl.replace(/\/$/, "").split("/").pop()
      //   : slugify(girl.name);
      const slug = slugify(girl.name);

      try {
        const escortRegion = city;
        const escortTown = region;
        const profileData = await ScrapGirlandSave(
          slug,
          escortRegion,
          escortTown
        );
        // merge basic list data with profile scrape
        fullProfiles.push(profileData);
      } catch (err) {
        console.error(`Failed to scrape ${girl.name}:`, err);
      }
    }

    // 💾 Optionally save to DB here in bulk
    // await EscortModel.insertMany(fullProfiles);

    return NextResponse.json({
      message: "Escorts scraped successfully!",
      count: fullProfiles.length,
      data: fullProfiles,
    });
  } catch (error: any) {
    console.error("Scraping error:", error.message);
    return NextResponse.json(
      { error: "Scraping failed", details: error.message },
      { status: 500 }
    );
  }
}
