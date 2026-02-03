// app/actions/masseuse.actions.ts
import { connectToDB, safeClone } from "@/lib/mongoose";
import { ITEMS_PER_PAGE, PaginationResult } from "@/lib/pagination";
import { County, ICounty } from "@/models/County";
import Escort from "@/models/Escort";
import { IRegion } from "@/models/Region";
import mongoose from "mongoose";

export interface MassageEscortFilters {
  countyId?: string;
  regionId?: string;
  town?: string;
  estate?: string;
  categories?: string[];
  minRate?: number;
  maxRate?: number;
  verifiedOnly?: boolean;
  popularOnly?: boolean;
}

export async function getMassageEscorts(
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  filters?: MassageEscortFilters,
): Promise<PaginationResult<any>> {
  try {
    await connectToDB();
    // Build query for masseuses only
    const query: any = {
      role: "escort",
      isActive: true,
      // Must have massage services
      $or: [
        {
          categories: {
            $in: ["massage", "erotic-massage", "masseuse", "body-massage"],
          },
        },
        { massage: { $exists: true, $not: { $size: 0 } } },
        // Also check if they have massage in practices or extraServices
        { practices: { $in: ["massage", "body massage", "sensual massage"] } },
        {
          extraServices: {
            $in: ["massage", "body massage", "sensual massage"],
          },
        },
      ],
    };

    // Apply filters if provided
    if (filters) {
      if (filters.countyId)
        query.county = new mongoose.Types.ObjectId(filters.countyId);
      if (filters.regionId)
        query.region = new mongoose.Types.ObjectId(filters.regionId);
      if (filters.town) query.town = filters.town;
      if (filters.estate) query.estate = filters.estate;
      if (filters.categories && filters.categories.length > 0) {
        query.categories = { $in: filters.categories };
      }
      if (filters.verifiedOnly) query.isVerified = true;
      if (filters.popularOnly) {
        // For popular only, we'll join with counties later or use a different approach
        // For now, we can check for featured flag if you have one
        query["plan.type"] = { $in: ["vip", "premium"] };
      }
    }

    // Get total count
    const totalItems = await Escort.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    // Fetch paginated results with population
    const items = await Escort.find(query)
      // .populate({
      //   path: "countyDetails",
      //   select: "name code isPopular capital ",
      // })
      // .populate({
      //   path: "regionDetails",
      //   select: "name countyCode",
      // })
      .populate<{ regionDetails: IRegion }>({
        path: "region",
        select: "name _id countyCode",
      })
      .populate<{ countyDetails: ICounty }>({
        path: "county",
        select: "name _id code",
      })
      .sort({
        "plan.type": -1, // Premium/VIP first
        isVerified: -1, // Verified escorts first
        createdAt: -1, // Newest first
      })
      .skip(skip)
      .limit(limit)
      .select("-__v -labels -videos"); // Exclude unnecessary fields
    // .exec();
    // .lean({ virtuals: true }); // Add virtuals: true here

    return {
      items: safeClone(items),
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching massage escorts:", error);
    throw error;
  }
}

// Get featured masseuses (VIP/Premium, verified, with photos)
export async function getFeaturedMasseuses(limit: number = 8) {
  try {
    await connectToDB();
    const items = await Escort.find({
      role: "escort",
      isActive: true,
      isVerified: true,
      previewPhoto: { $exists: true, $ne: "" },
      $or: [
        { categories: { $in: ["massage", "erotic-massage", "masseuse"] } },
        { massage: { $exists: true, $not: { $size: 0 } } },
        { "plan.type": { $in: ["vip", "premium"] } },
        { "countyDetails.isPopular": true },
      ],
    })
      .populate({
        path: "countyDetails",
        select: "name code",
      })
      .sort({
        "plan.type": -1,
        createdAt: -1,
      })
      .limit(limit)
      .select(
        "name age previewPhoto county region town estate categories massage rates isVerified plan",
      )
      .lean();

    return items;
  } catch (error) {
    console.error("Error fetching featured masseuses:", error);
    return [];
  }
}

// Get masseuse categories/types
export async function getMassageCategories() {
  return [
    { id: "erotic-massage", name: "Erotic Massage", count: 0 },
    { id: "tantric", name: "Tantric Massage", count: 0 },
    { id: "nuru", name: "Nuru Massage", count: 0 },
    { id: "body-to-body", name: "Body to Body", count: 0 },
    { id: "couples-massage", name: "Couples Massage", count: 0 },
    { id: "therapeutic", name: "Therapeutic Massage", count: 0 },
    { id: "sensual", name: "Sensual Massage", count: 0 },
  ];
}

// Get massage escorts count by county (for statistics)
export async function getMassageCountsByCounty() {
  try {
    await connectToDB();

    const counts = await Escort.aggregate([
      {
        $match: {
          role: "escort",
          isActive: true,
          $or: [
            { categories: { $in: ["massage", "erotic-massage", "masseuse"] } },
            { massage: { $exists: true, $not: { $size: 0 } } },
          ],
        },
      },
      {
        $group: {
          _id: "$county",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Populate county details
    const populatedCounts = await Promise.all(
      counts.map(async (item) => {
        const county = await County.findById(item._id)
          .select("name code isPopular")
          .lean();
        return {
          county,
          count: item.count,
        };
      }),
    );

    return populatedCounts.filter((item) => item.county);
  } catch (error) {
    console.error("Error getting massage counts by county:", error);
    return [];
  }
}
