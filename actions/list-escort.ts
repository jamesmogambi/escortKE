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

export interface FetchEscortsParams {
  countyName?: string;
  regionName?: string;
  practice?: string;
  page?: number;
  limit?: number;
  minAge?: number;
  maxAge?: number;
  sortBy?: "rating" | "newest" | "popular";
}

export interface FetchEscortsResponse {
  escorts: Array<{
    _id: string;
    name: string;
    age: string;
    gender: string;
    previewPhoto?: string;
    images: string[];
    about?: string;
    ethnicity?: string;
    nationality?: string;
    bustSize?: string;
    weight?: string;
    zodiacSign?: string;
    videos?: string[];
    languages: string[];
    practices: string[];
    rates: Array<{
      duration: string;
      incall: string;
      outcall?: string;
    }>;
    isActive: boolean;
    isVerified: boolean;
    rating: number;
    county?: {
      _id: string;
      name: string;
      code: string;
    };
    region?: {
      _id: string;
      name: string;
    };
    town?: string;
    estate?: string;
    slug: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filters: {
    county?: string;
    region?: string;
    practice?: string;
  };
}

export async function fetchGirlEscorts(
  params: FetchEscortsParams,
): Promise<FetchEscortsResponse> {
  try {
    await connectToDB();

    const {
      countyName,
      regionName,
      practice,
      page = 1,
      limit = 20,
      minAge = 18,
      maxAge = 65,
      sortBy = "newest",
    } = params;

    const skip = (page - 1) * limit;

    // Build filter query
    const filter: any = {
      gender: "girl", // Only fetch girls
      isActive: true,
      role: "escort",
    };

    // Filter by county name
    if (countyName) {
      // First find the county by name to get its _id
      const county = await County.findOne({
        name: { $regex: new RegExp(`^${countyName}$`, "i") },
      }).select("_id code");

      if (county) {
        filter.$or = [{ county: county._id }, { countyCode: county.code }];
      } else {
        // If county not found, try case-insensitive match on county reference via populate
        // We'll handle this differently in the query
      }
    }

    // Filter by region name
    if (regionName) {
      // First find the region by name
      const region = await Region.findOne({
        name: { $regex: new RegExp(`^${regionName}$`, "i") },
      }).select("_id");

      if (region) {
        filter.region = region._id;
      }
    }

    // Filter by practice
    if (practice) {
      filter.practices = { $in: [practice] };
    }

    // Filter by age range
    filter.age = {
      $gte: minAge.toString(),
      $lte: maxAge.toString(),
    };

    // Build sort options
    let sortOptions: any = {};
    switch (sortBy) {
      case "rating":
        sortOptions = { rating: -1, isVerified: -1 };
        break;
      case "popular":
        sortOptions = { isVerified: -1, rating: -1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // For complex filtering with county/region names, use aggregation
    const aggregationPipeline: any[] = [
      // Match basic filters
      {
        $match: {
          gender: "girl",
          isActive: true,
          role: "escort",
          ...(practice && { practices: { $in: [practice] } }),
          age: { $gte: minAge.toString(), $lte: maxAge.toString() },
        },
      },
      // Lookup county details
      {
        $lookup: {
          from: "counties",
          localField: "county",
          foreignField: "_id",
          as: "countyDetails",
        },
      },
      // Lookup region details
      {
        $lookup: {
          from: "regions",
          localField: "region",
          foreignField: "_id",
          as: "regionDetails",
        },
      },
      // Add county/region name fields for filtering
      {
        $addFields: {
          countyName: { $arrayElemAt: ["$countyDetails.name", 0] },
          regionName: { $arrayElemAt: ["$regionDetails.name", 0] },
        },
      },
      // Apply county name filter if provided
      ...(countyName
        ? [
            {
              $match: {
                $or: [
                  { countyName: { $regex: new RegExp(countyName, "i") } },
                  { countyCode: countyName.toUpperCase() }, // Also try county code
                ],
              },
            },
          ]
        : []),
      // Apply region name filter if provided
      ...(regionName
        ? [
            {
              $match: {
                regionName: { $regex: new RegExp(regionName, "i") },
              },
            },
          ]
        : []),
      // Project fields
      {
        $project: {
          name: 1,
          age: 1,
          gender: 1,
          previewPhoto: 1,
          images: 1,
          about: 1,
          ethnicity: 1,
          nationality: 1,
          bustSize: 1,
          weight: 1,
          zodiacSign: 1,
          languages: 1,
          practices: 1,
          telephone: 1,
          whatsappPhone: 1,
          rates: 1,
          isActive: 1,
          isVerified: 1,
          rating: 1,
          town: 1,
          estate: 1,
          slug: 1,
          createdAt: 1,
          county: { $arrayElemAt: ["$countyDetails", 0] },
          region: { $arrayElemAt: ["$regionDetails", 0] },
        },
      },
      // Sort
      { $sort: sortOptions },
      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    // Get total count with same filters
    const countPipeline = [...aggregationPipeline];
    countPipeline.pop(); // Remove $limit
    countPipeline.pop(); // Remove $skip

    const [escortsResult, totalResult] = await Promise.all([
      Escort.aggregate(aggregationPipeline),
      Escort.aggregate([...countPipeline, { $count: "total" }]),
    ]);

    const total = totalResult[0]?.total || 0;
    const escorts = escortsResult;

    // Transform the data for response
    const transformedEscorts = escorts.map((escort) => ({
      _id: escort._id.toString(),
      name: escort.name || "",
      age: escort.age || "",
      gender: escort.gender || "girl",
      previewPhoto: escort.previewPhoto,
      images: escort.images || [],
      videos: escort.videos || [],
      about: escort.about,
      ethnicity: escort.ethnicity,
      nationality: escort.nationality,
      bustSize: escort.bustSize,
      weight: escort.weight,
      zodiacSign: escort.zodiacSign,
      languages: escort.languages || [],
      practices: escort.practices || [],
      rates: escort.rates || [],
      isActive: escort.isActive || false,
      isVerified: escort.isVerified || false,
      rating: escort.rating || 0,
      county: escort.county
        ? {
            _id: escort.county._id.toString(),
            name: escort.county.name,
            code: escort.county.code,
          }
        : undefined,
      region: escort.region
        ? {
            _id: escort.region._id.toString(),
            name: escort.region.name,
          }
        : undefined,
      town: escort.town,
      estate: escort.estate,
      slug: escort.slug || "",
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      escorts: safeClone(escorts) as any,
      total,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      filters: {
        county: countyName || undefined,
        region: regionName || undefined,
        practice: practice || undefined,
      },
    };
  } catch (error) {
    console.error("Error fetching escorts:", error);
    throw new Error("Failed to fetch escorts");
  }
}
