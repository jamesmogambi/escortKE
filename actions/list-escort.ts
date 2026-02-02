// app/actions/escort.actions.ts
import { connectToDB } from "@/lib/mongoose";
import { paginate, ITEMS_PER_PAGE, PaginationResult } from "@/lib/pagination";
import Escort, { EscortDoc } from "@/models/Escort";
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
