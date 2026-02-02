// app/actions/escort.actions.ts
import { connectToDB, safeClone } from "@/lib/mongoose";
import { paginate, ITEMS_PER_PAGE, PaginationResult } from "@/lib/pagination";
import { ICounty } from "@/models/County";
import Escort, { EscortDoc } from "@/models/Escort";
import { IRegion } from "@/models/Region";
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
