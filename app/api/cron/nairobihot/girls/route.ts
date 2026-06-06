import {NextRequest, NextResponse} from "next/server";
import {initBrightData} from "@/lib/brightData";
import axios from "axios";
import * as cheerio from "cheerio";
import {connectToDB} from "@/lib/mongoose";
import "@/lib/polyfill";

const sourceURL = "https://www.kenyahotgirls.com/";

export async function POST(request: NextRequest) {
    await connectToDB();
    const {options} = initBrightData();
    try {
        const response = await axios.get(sourceURL, options);
        const $ = cheerio.load(response.data);
        // TODO:scrap escorts for the given region

        // TODO:scrap data from indidvidual girl

        //TODO: sav to DB ALL THE RECORDS
        return NextResponse.json({
            message: "Escorts scraped successfully!",
            count: 0, // You might want to return the number of counties instead
            data: [],
        });
    } catch (error: any) {
        console.error("Scraping error:", error.message);
        return NextResponse.json(
            {error: "Scraping failed", details: error.message},
            {status: 500}
        );
    }
}
