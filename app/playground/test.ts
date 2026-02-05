// app/actions/escort.actions.ts
"use server";

import { Escort } from "@/models/Escort";
import { County } from "@/models/County";
import { Region } from "@/models/Region";
import connectDB from "@/lib/db";
import { revalidatePath } from "next/cache";

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

export async function fetchEscorts(
  params: FetchEscortsParams,
): Promise<FetchEscortsResponse> {
  try {
    await connectDB();

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
      escorts: transformedEscorts,
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

// Get filter options using names
export async function getFilterOptions() {
  try {
    await connectDB();

    const [counties, practices, regions] = await Promise.all([
      // Get counties with escort counts (using names)
      County.aggregate([
        {
          $lookup: {
            from: "escorts",
            let: { countyId: "$_id", countyCode: "$code" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$gender", "girl"] },
                      { $eq: ["$isActive", true] },
                      {
                        $or: [
                          { $eq: ["$county", "$$countyId"] },
                          { $eq: ["$countyCode", "$$countyCode"] },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "escorts",
          },
        },
        {
          $addFields: {
            escortCount: { $size: "$escorts" },
          },
        },
        {
          $match: {
            escortCount: { $gt: 0 },
          },
        },
        {
          $project: {
            name: 1,
            code: 1,
            escortCount: 1,
            isPopular: 1,
          },
        },
        {
          $sort: { isPopular: -1, escortCount: -1, name: 1 },
        },
      ]),

      // Get distinct practices from girls
      Escort.distinct("practices", {
        gender: "girl",
        isActive: true,
      }),

      // Get regions with escort counts (using names)
      Region.aggregate([
        {
          $lookup: {
            from: "escorts",
            localField: "_id",
            foreignField: "region",
            as: "escorts",
          },
        },
        {
          $addFields: {
            escortCount: { $size: "$escorts" },
          },
        },
        {
          $match: {
            escortCount: { $gt: 0 },
            isActive: true,
          },
        },
        {
          $project: {
            name: 1,
            countyCode: 1,
            escortCount: 1,
          },
        },
        {
          $sort: { escortCount: -1, name: 1 },
        },
      ]),
    ]);

    return {
      counties: counties.map((c) => ({
        _id: c._id.toString(),
        name: c.name,
        code: c.code,
        escortCount: c.escortCount,
        isPopular: c.isPopular,
      })),
      practices: practices.filter((p) => p && p.trim() !== "").sort(),
      regions: regions.map((r) => ({
        _id: r._id.toString(),
        name: r.name,
        countyCode: r.countyCode,
        escortCount: r.escortCount,
      })),
    };
  } catch (error) {
    console.error("Error getting filter options:", error);
    throw new Error("Failed to get filter options");
  }
}

// Get regions for a specific county by name
export async function getRegionsByCounty(countyName: string) {
  try {
    await connectDB();

    // First find the county to get its code
    const county = await County.findOne({
      name: { $regex: new RegExp(`^${countyName}$`, "i") },
    }).select("code");

    if (!county) {
      return [];
    }

    // Get regions for this county code with escort counts
    const regions = await Region.aggregate([
      {
        $match: {
          countyCode: county.code,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "escorts",
          let: { regionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$gender", "girl"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$region", "$$regionId"] },
                  ],
                },
              },
            },
          ],
          as: "escorts",
        },
      },
      {
        $addFields: {
          escortCount: { $size: "$escorts" },
        },
      },
      {
        $match: {
          escortCount: { $gt: 0 },
        },
      },
      {
        $project: {
          name: 1,
          countyCode: 1,
          escortCount: 1,
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    return regions.map((r) => ({
      _id: r._id.toString(),
      name: r.name,
      escortCount: r.escortCount,
    }));
  } catch (error) {
    console.error("Error getting regions by county:", error);
    throw new Error("Failed to get regions");
  }
}

// Get escorts by specific county name
export async function getEscortsByCountyName(
  countyName: string,
  page: number = 1,
) {
  return fetchEscorts({ countyName, page });
}

// Get escorts by specific region name
export async function getEscortsByRegionName(
  regionName: string,
  page: number = 1,
) {
  return fetchEscorts({ regionName, page });
}

// Get escorts by practice
export async function getEscortsByPractice(practice: string, page: number = 1) {
  return fetchEscorts({ practice, page });
}
