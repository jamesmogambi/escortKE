// app/actions/masseuse.actions.ts
import { connectToDB, safeClone } from "@/lib/mongoose";
import { ITEMS_PER_PAGE, PaginationResult } from "@/lib/pagination";
import { County, ICounty } from "@/models/County";
import Escort from "@/models/Escort";
import { IRegion, Region } from "@/models/Region";
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

interface FilterEscortsParams {
  county?: string;
  region?: string;
  massageType?: string;
  categories?: string[];
  practices?: string[];
  bdsm?: string[];
  ageCategory?: string[];
  breastSize?: string[];
  character?: string[];
  hairColor?: string[];
  experience?: string[];
  nationality?: string[];
  languages?: string[];
  availability?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getFilteredEscorts(params: FilterEscortsParams) {
  try {
    await connectToDB();

    const {
      county,
      region,
      massageType,
      categories = [],
      practices = [],
      bdsm = [],
      ageCategory = [],
      breastSize = [],
      character = [],
      hairColor = [],
      experience = [],
      nationality = [],
      languages = [],
      availability = [],
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Build the filter query
    const filter: any = {
      isActive: true,
      isVerified: true,
      role: "escort",
    };

    // Location filters
    if (county) {
      // Try to find county by name or code
      const countyDoc = await County.findOne({
        $or: [
          { name: new RegExp(county, "i") },
          { code: county.toUpperCase() },
        ],
      });

      if (countyDoc) {
        filter.$or = [
          { county: countyDoc._id },
          { countyCode: countyDoc.code },
        ];
      } else {
        // Fallback to text search
        filter.$or = [
          { countyCode: new RegExp(county, "i") },
          { "countyDetails.name": new RegExp(county, "i") },
        ];
      }
    }

    if (region) {
      const regionDoc = await Region.findOne({
        name: new RegExp(region, "i"),
      });

      if (regionDoc) {
        filter.region = regionDoc._id;
      } else {
        filter.$or = [
          { region: new RegExp(region, "i") },
          { "regionDetails.name": new RegExp(region, "i") },
          { town: new RegExp(region, "i") },
        ];
      }
    }

    // Service/Massage type filter
    if (massageType) {
      filter.massage = {
        $elemMatch: {
          $regex: massageType,
          $options: "i",
        },
      };
    }

    // Array filters (multiple selections)
    const arrayFilters = [
      { key: "categories", value: categories },
      { key: "practices", value: practices },
      { key: "bdsm", value: bdsm },
      { key: "ageCategory", value: ageCategory },
      { key: "breastSize", value: breastSize },
      { key: "character", value: character },
      { key: "hairColor", value: hairColor },
      { key: "experience", value: experience },
      { key: "nationality", value: nationality },
      { key: "languages", value: languages },
      { key: "availability", value: availability },
    ];

    arrayFilters.forEach(({ key, value }) => {
      if (value && value.length > 0) {
        filter[key] = { $in: value };
      }
    });

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const [escorts, total] = await Promise.all([
      Escort.find(filter)
        .populate("countyDetails", "name code")
        .populate("regionDetails", "name countyCode")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Escort.countDocuments(filter),
    ]);

    return {
      success: true,
      data: {
        escorts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error filtering escorts:", error);
    return {
      success: false,
      error: "Failed to fetch escorts",
      data: {
        escorts: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  }
}

interface FilterMassageEscortsParams {
  county?: string;
  region?: string;
  massageType?: string;
  page?: number;
  limit?: number;
}

export async function getFilteredMassageEscorts(
  params: FilterMassageEscortsParams,
) {
  try {
    await connectToDB();

    const { county, region, massageType, page = 1, limit = 20 } = params;

    const skip = (page - 1) * limit;

    // Start with base filter: only escorts who offer massage services
    const filter: any = {
      isActive: true,
      // isVerified: true,
      role: "escort",
      // Filter escorts who have at least one massage service
      massage: { $exists: true, $ne: [], $not: { $size: 0 } },
    };

    // If massage type is specified, filter by specific massage
    if (massageType && massageType.trim() !== "") {
      filter.massage = {
        $elemMatch: {
          $regex: massageType.trim(),
          $options: "i",
        },
      };
    }

    // Location filters
    if (county && county.trim() !== "") {
      // Try to find county by name (case-insensitive)
      const countyDoc = await County.findOne({
        name: new RegExp(`^${county.trim()}$`, "i"),
      });

      if (countyDoc) {
        filter.$or = [
          { county: countyDoc._id },
          { countyCode: countyDoc.code },
        ];
      } else {
        // Fallback to partial match on county name
        filter.$or = [
          { "countyDetails.name": new RegExp(county.trim(), "i") },
          { countyCode: new RegExp(county.trim(), "i") },
        ];
      }
    }

    if (region && region.trim() !== "") {
      const regionDoc = await Region.findOne({
        name: new RegExp(`^${region.trim()}$`, "i"),
      });

      if (regionDoc) {
        filter.region = regionDoc._id;
      } else {
        // Fallback to partial match on region or town
        filter.$or = [
          ...(filter.$or || []),
          { "regionDetails.name": new RegExp(region.trim(), "i") },
          { town: new RegExp(region.trim(), "i") },
        ];
      }
    }

    // If no county/region specified but massageType is specified,
    // still filter by massageType and show all locations
    if (!county && !region && massageType) {
      // Keep the massage filter only
    }

    // Execute query with pagination
    const [escorts, total] = await Promise.all([
      Escort.find(filter)
        .populate<{ regionDetails: IRegion }>({
          path: "region",
          select: "name _id countyCode",
        })
        .populate<{ countyDetails: ICounty }>({
          path: "county",
          select: "name _id code",
        })
        // .populate("countyDetails", "name code")
        // .populate("regionDetails", "name countyCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Escort.countDocuments(filter),
    ]);

    return {
      success: true,
      data: {
        escorts: safeClone(escorts),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
        filtersApplied: {
          county: county || null,
          region: region || null,
          massageType: massageType || null,
        },
      },
    };
  } catch (error) {
    console.error("Error filtering massage escorts:", error);
    return {
      success: false,
      error: "Failed to fetch massage escorts",
      data: {
        escorts: [],
        pagination: {
          page: 1,
          limit: 24,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        filtersApplied: {
          county: null,
          region: null,
          massageType: null,
        },
      },
    };
  }
}

export async function getAllEroticMassageEscorts(
  page: number = 1,
  limit: number = 24,
) {
  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    // Use the EXACT same filter that works in shell
    const filter: any = {
      isActive: true,
      // isVerified: true,
      role: "escort",
      massage: {
        $elemMatch: {
          $regex: "erotic|sensual|tantric|nuru|body to body|happy ending",
          $options: "i",
        },
      },
    };

    console.log("Using filter:", JSON.stringify(filter, null, 2));

    // Execute query
    const [escorts, total] = await Promise.all([
      Escort.find(filter)
        .populate<{ regionDetails: IRegion }>({
          path: "region",
          select: "name _id countyCode",
        })
        .populate<{ countyDetails: ICounty }>({
          path: "county",
          select: "name _id code",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Escort.countDocuments(filter),
    ]);

    console.log(`Found ${total} erotic massage escorts`);

    // Log first few results for debugging
    if (escorts.length > 0) {
      console.log("First 3 results:");
      escorts.slice(0, 3).forEach((escort: any, i) => {
        console.log(
          `${i + 1}. ${escort.name || "No name"}: ${escort.massage?.join(", ") || "No massage"}`,
        );
      });
    }

    return {
      success: true,
      data: {
        escorts: safeClone(escorts),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching erotic massage escorts:", error);
    return {
      success: false,
      error: "Failed to fetch erotic massage escorts",
      data: {
        escorts: [],
        pagination: {
          page: 1,
          limit: 24,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  }
}
