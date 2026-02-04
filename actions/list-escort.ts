// app/actions/escort.actions.ts
import { connectToDB, safeClone } from "@/lib/mongoose";
import { paginate, ITEMS_PER_PAGE, PaginationResult } from "@/lib/pagination";
import { County, ICounty } from "@/models/County";
import Escort, { EscortDoc } from "@/models/Escort";
import { IRegion, Region } from "@/models/Region";
import { BDSMFilterParams, PaginatedResponse } from "@/types/bdsm";
import mongoose from "mongoose";

// app/actions/escort.actions.ts - Kenya version
export async function getMasseuses(
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  filters?: {
    countyId?: string;
    regionId?: string;
    town?: string;
    estate?: string;
    categories?: string[];
    popularOnly?: boolean;
  },
): Promise<PaginationResult<EscortDoc>> {
  try {
    await connectToDB();
    const query: any = {
      role: "escort",
      country: "Kenya",
      $or: [
        { categories: { $in: ["massage", "erotic-massage", "masseuse"] } },
        { massage: { $exists: true, $not: { $size: 0 } } },
      ],
      isActive: true,
    };

    // Apply Kenya location filters
    if (filters?.countyId) {
      if (mongoose.Types.ObjectId.isValid(filters.countyId)) {
        query.county = filters.countyId;
      }
    }

    if (filters?.regionId) query.region = filters.regionId;
    if (filters?.town) query.town = filters.town;
    if (filters?.estate) query.estate = filters.estate;

    if (filters?.categories && filters.categories.length > 0) {
      query.categories = { $in: filters.categories };
    }

    const totalItems = await Escort.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const items = await Escort.find(query)
      .populate({
        path: "countyDetails",
        select: "name code description capital isPopular",
      })
      .populate({
        path: "regionDetails",
        select: "name countyCode isActive",
      })
      .sort({
        "plan.type": -1,
        "countyDetails.isPopular": -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    return {
      items,
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching masseuses:", error);
    throw error;
  }
}

// Optional: Simplified version without population (faster)
export async function getSimpleFeaturedEscorts(limit: number = 20) {
  try {
    await connectToDB();

    const escorts = (await Escort.find({
      isActive: true,
      previewPhoto: { $exists: true, $ne: "" }, // Has profile photo
      images: { $exists: true, $ne: [] }, // Has at least one image
    })
      // .select(
      //   "name age nationality previewPhoto city plan slug bustSize about isVerified images",
      // )
      .populate<{ regionDetails: IRegion }>({
        path: "region",
        select: "name _id countyCode",
      })
      .populate<{ countyDetails: ICounty }>({
        path: "county",
        select: "name _id code",
      })
      // .populate<{ regionDetails: IRegion }>("regionDetails")
      // .populate<{ countyDetails: ICounty }>("countyDetails")
      .sort({
        // plan: -1, // VIP/Premium first
        // isVerified: -1, // Verified profiles
        images: -1, // More images first
        createdAt: -1, // Newest
      })
      .limit(20)) as any; // Cast to any to resolve type mismatch

    const transformed = safeClone(escorts);
    return {
      success: true,
      data: transformed,
      count: transformed.length,
    };
  } catch (error) {
    console.error("Error in simple fetch:", error);
    return {
      success: false,
      data: [],
      count: 0,
      error: "Failed to fetch data",
    };
  }
}

const DEFAULT_LIMIT = 20;

// app/actions/bdsm-actions.ts - USING REGEX
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
