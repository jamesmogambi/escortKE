// app/actions/bdsm-actions.ts - REFACTORED
"use server";

import { connectToDB } from "@/lib/db";
import Escort, { EscortDoc } from "@/models/Escort";
import { County } from "@/models/County";
import { Region } from "@/models/Region";
import { BDSMFilterParams, PaginatedResponse } from "@/types/bdsm";

const DEFAULT_LIMIT = 10;

export async function getBDSMEscorts(
  params: BDSMFilterParams,
): Promise<PaginatedResponse> {
  try {
    await connectToDB();

    // Parse params
    const { county, region, practice, page = "1" } = params;

    const pageNum = parseInt(page) || 1;
    const limit = DEFAULT_LIMIT;
    const skip = (pageNum - 1) * limit;

    // Build filter query - CORRECTED for your schema
    const filter: any = {
      bdsm: { $exists: true, $ne: [] }, // bdsm is array of strings
      isActive: true, // Only show active escorts
    };

    // ✅ CORRECT: Add county filter (ObjectId lookup)
    if (county && county !== "all" && county.trim() !== "") {
      // If county is an ObjectId string, convert it
      if (mongoose.Types.ObjectId.isValid(county.trim())) {
        filter.county = county.trim();
      } else {
        // If county is a name, look up the ObjectId
        const countyDoc = await County.findOne({
          $or: [{ name: county.trim() }, { code: county.trim() }],
        }).select("_id");
        if (countyDoc) {
          filter.county = countyDoc._id;
        }
      }
    }

    // ✅ CORRECT: Add region filter (ObjectId lookup)
    if (region && region !== "all" && region.trim() !== "") {
      // If region is an ObjectId string, convert it
      if (mongoose.Types.ObjectId.isValid(region.trim())) {
        filter.region = region.trim();
      } else {
        // If region is a name, look up the ObjectId
        const regionDoc = await Region.findOne({
          name: region.trim(),
        }).select("_id");
        if (regionDoc) {
          filter.region = regionDoc._id;
        }
      }
    }

    // ✅ CORRECT: Add BDSM practice filter (array of strings)
    if (practice && practice !== "all" && practice.trim() !== "") {
      filter.bdsm = practice.trim(); // Direct string match in array
    }

    console.log("Final filter query:", JSON.stringify(filter, null, 2));

    // ✅ CORRECT: Get total count with proper population
    const total = await Escort.countDocuments(filter);

    // ✅ CORRECT: Fetch paginated data with population
    const escorts = await Escort.find(filter)
      .populate("county", "name code") // Populate county name
      .populate("region", "name") // Populate region name
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return {
      escorts: escorts.map((escort) => ({
        ...escort.toObject(),
        _id: escort._id.toString(),
        // Ensure county/region names are available
        countyName: escort.countyDetails?.name || "",
        regionName: escort.regionDetails?.name || "",
      })),
      total,
      page: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error: any) {
    console.error("Error in getBDSMEscorts:", error.message);
    console.error("Error stack:", error.stack);

    // Return empty result instead of throwing
    return {
      escorts: [],
      total: 0,
      page: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}
