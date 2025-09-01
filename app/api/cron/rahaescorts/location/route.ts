import { NextRequest, NextResponse } from "next/server";
import { initBrightData } from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import { connectToDB } from "@/lib/mongoose";
import { Area } from "@/models/Area";
import { City } from "@/models/City";

const sourceURL = "https://rahaescorts.com/";

export async function POST(request: NextRequest) {
  await connectToDB();
  const { options } = initBrightData();
  try {
    const response = await axios.get(sourceURL, options);
    const $ = cheerio.load(response.data);
    const citiesWithAreas: { city: string; areas: string[] }[] = [];
    // Scrape cities and areas
    $(".country-list > .cat-item").each((_, countyEl) => {
      const cityName = $(countyEl).find("> a").text().trim();
      const areas: string[] = [];
      $(countyEl)
        .find(".children > .cat-item > a")
        .each((_, regionEl) => {
          const regionName = $(regionEl).text().trim();
          if (regionName) areas.push(regionName);
        });
      if (cityName) {
        citiesWithAreas.push({ city: cityName, areas });
      }
    });
    // Insert counties and regions into the database
    for (const { areas, city } of citiesWithAreas) {
      // Upsert county
      const countyDoc = await City.findOneAndUpdate(
        { name: city },
        { name: city },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Insert regions referencing the county
      for (const region of areas) {
        await Area.findOneAndUpdate(
          { name: region, city: countyDoc._id },
          { name: region, city: countyDoc._id },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }

    return NextResponse.json({
      message: "Cities and regions scraped and saved successfully!",
      count: citiesWithAreas.length, // You might want to return the number of counties instead
      data: citiesWithAreas,
    });
  } catch (error: any) {
    console.error("Scraping error:", error.message);
    return NextResponse.json(
      { error: "Scraping failed", details: error.message },
      { status: 500 }
    );
  }
}
