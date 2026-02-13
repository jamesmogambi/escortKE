//

// actions/escort.actions.ts
"use server";

import { connectToDB, safeClone } from "@/lib/mongoose";
import { County } from "@/models/County";
import Escort from "@/models/Escort";
import Region from "@/models/Region";
import { EscortCardData } from "@/types/escort.types";
import { Types } from "mongoose";

export async function fetchGirlEscorts(
  params: FetchEscortsParams,
): Promise<EscortPaginatedResponse> {
  try {
    await connectToDB();

    const {
      countyName,
      regionName,
      town,
      practice,
      category,
      page = 1,
      limit = 20,
      minAge = 18,
      maxAge = 65,
      sortBy = "newest",
      isVerified,
      isFeatured,
      workType,
    } = params;

    const skip = (page - 1) * limit;

    // Build base filter query
    const query: any = {
      gender: "girl",
      isActive: true,
      role: "escort",
    };

    // Age filter
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = minAge.toString();
      if (maxAge) query.age.$lte = maxAge.toString();
    }

    // Practice/Service filter
    if (practice) {
      query.practices = { $in: [practice] };
    }

    // Category filter
    if (category) {
      query.categories = { $in: [category] };
    }

    // Status filters
    if (isVerified !== undefined) {
      query.isVerified = isVerified;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    // Work type filter
    if (workType) {
      query.workType = workType;
    }

    // Location-based filtering
    if (countyName || regionName || town) {
      const locationConditions: any[] = [];

      // Handle county filter
      if (countyName) {
        const county = await County.findOne({
          name: { $regex: new RegExp(`^${countyName}$`, "i") },
        }).select("_id code");

        if (county) {
          locationConditions.push({
            $or: [{ county: county._id }, { countyCode: county.code }],
          });
        }
      }

      // Handle region filter
      if (regionName) {
        const region = await Region.findOne({
          name: { $regex: new RegExp(`^${regionName}$`, "i") },
        }).select("_id");

        if (region) {
          locationConditions.push({ regions: region._id });
        }
      }

      // Handle town filter
      if (town) {
        locationConditions.push({
          "locations.town": { $regex: new RegExp(town, "i") },
        });
      }

      if (locationConditions.length > 0) {
        query.$and = locationConditions;
      }
    }

    // Execute main query with populate - THIS ENABLES VIRTUALS
    const [escorts, total] = await Promise.all([
      Escort.find(query)
        .populate("countyDetails", "name code")
        .populate("regionsDetails", "name county")
        .populate("primaryRegionDetails", "name county")
        .populate("agencyDetails", "name slug logo description isVerified")
        .select({
          // Basic Info
          name: 1,
          username: 1,
          age: 1,
          gender: 1,
          previewPhoto: 1,
          images: { $slice: 1 }, // Only first image
          about: { $substr: ["$about", 0, 200] },
          ethnicity: 1,
          nationality: 1,
          bustSize: 1,
          weight: 1,
          zodiacSign: 1,
          languages: { $slice: 5 },

          // Services
          practices: { $slice: 5 },
          categories: { $slice: 5 },

          // Contact (conditional)
          telephone: 1,
          whatsappPhone: 1,

          // Rates
          rates: {
            $filter: {
              input: "$rates",
              as: "rate",
              cond: { $eq: ["$$rate.duration", "1 hour"] },
            },
          },

          // Status
          isVerified: 1,
          isFeatured: 1,
          isActive: 1,
          workType: 1,

          // Stats
          rating: 1,
          totalReviews: 1,
          totalViews: 1,

          // SEO
          slug: 1,

          // Location fields
          county: 1,
          countyCode: 1,
          regions: 1,
          primaryRegion: 1,
          locations: { $slice: 1 },

          // Agency
          agencyId: 1,
          // workType: 1,
          isAgencyFeatured: 1,

          // Timestamps
          createdAt: 1,
          updatedAt: 1,
        })
        .sort(getSortOptions(sortBy))
        .skip(skip)
        .limit(limit)
        .lean({ virtuals: true }), // 👈 CRITICAL: This enables virtual fields!

      Escort.countDocuments(query),
    ]);

    // Format the escorts for client consumption
    const formattedEscorts = escorts.map((escort) =>
      formatEscortForClient(escort),
    );

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get filter options for UI
    const filterOptions = await getFilterOptions({
      countyName,
      regionName,
      practice,
      category,
    });

    return {
      escorts: safeClone(formattedEscorts),
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
      success: true,
      filters: {
        county: countyName || undefined,
        region: regionName || undefined,
        town: town || undefined,
        practice: practice || undefined,
        category: category || undefined,
        minAge,
        maxAge,
        isVerified,
        isFeatured,
        workType,
      },
      filterOptions,
    };
  } catch (error) {
    console.error("Error fetching girl escorts:", error);
    throw new Error("Failed to fetch escorts");
  }
}

/**
 * Format escort document for client consumption
 * This ensures virtual fields are properly structured and adds additional formatting
 */
function formatEscortForClient(escort: any): EscortCardData {
  // Format contact info - only show if verified
  const telephone = escort.isVerified ? escort.telephone : undefined;
  const whatsappPhone = escort.isVerified ? escort.whatsappPhone : undefined;

  // Format the primary location display (virtual should be available now)
  const primaryLocationDisplay =
    escort.primaryLocationDisplay || formatPrimaryLocationManually(escort);

  // Format the first rate
  const rate = escort.rates && escort.rates.length > 0 ? escort.rates[0] : null;

  // Format agency info
  const agency =
    escort.workType === "agency_employee" && escort.agencyDetails?.[0]
      ? {
          _id: escort.agencyDetails[0]._id.toString(),
          name: escort.agencyDetails[0].name,
          slug: escort.agencyDetails[0].slug,
          logo: escort.agencyDetails[0].logo || null,
          isVerified: escort.agencyDetails[0].isVerified || false,
        }
      : null;

  return {
    _id: escort._id.toString(),
    name: escort.name || null,
    username: escort.username || null,
    slug: escort.slug || escort._id.toString(),

    // Media
    previewPhoto: escort.previewPhoto || null,
    images: escort.images || [],

    // Basic Info
    age: escort.age || null,
    gender: escort.gender || null,

    // Status
    isVerified: escort.isVerified || false,
    isFeatured: escort.isFeatured || false,
    isActive: escort.isActive || false,

    // Stats
    rating: escort.rating || 0,
    totalReviews: escort.totalReviews || 0,

    // Location - now populated via virtual
    primaryLocationDisplay,

    // Work Type
    workType: escort.workType || null,
    workTypeDisplay:
      escort.workTypeDisplay ||
      (escort.workType === "independent"
        ? "Independent Escort"
        : "Agency Escort"),

    // Agency
    agency,

    // Rate
    rate: rate
      ? {
          duration: rate.duration,
          incall: rate.incall,
          outcall: rate.outcall || null,
        }
      : null,

    // About excerpt
    aboutExcerpt: escort.about || null,

    // Timestamps
    createdAt: escort.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: escort.updatedAt?.toISOString() || new Date().toISOString(),
  } as any;
}

/**
 * Manual formatter for primary location (fallback if virtual doesn't work)
 */
function formatPrimaryLocationManually(escort: any): string {
  try {
    const { locations, primaryRegion, regionsDetails, countyDetails } = escort;

    if (!locations || locations.length === 0) {
      return "Location not specified";
    }

    // Find primary location or use first
    const primaryLocation =
      locations.find(
        (loc: any) => loc.region?.toString() === primaryRegion?.toString(),
      ) || locations[0];

    const parts: string[] = [];

    // Add estate/town
    if (primaryLocation?.estate) parts.push(primaryLocation.estate);
    if (primaryLocation?.town) parts.push(primaryLocation.town);

    // Add region name
    if (regionsDetails && primaryLocation?.region) {
      const region = regionsDetails.find(
        (r: any) => r._id?.toString() === primaryLocation.region?.toString(),
      );
      if (region?.name) parts.push(region.name);
    }

    // Add county
    if (countyDetails && countyDetails[0]?.name) {
      parts.push(`${countyDetails[0].name} County`);
    }

    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  } catch (error) {
    return "Location not specified";
  }
}

// Helper function for sort options
function getSortOptions(sortBy: string): any {
  switch (sortBy) {
    case "rating":
      return { rating: -1, totalReviews: -1, isVerified: -1 };
    case "popular":
      return { totalViews: -1, rating: -1, isVerified: -1 };
    case "featured":
      return { isFeatured: -1, createdAt: -1 };
    case "price_low":
      return { "rates.0.incall": 1 };
    case "price_high":
      return { "rates.0.incall": -1 };
    case "oldest":
      return { createdAt: 1 };
    case "newest":
    default:
      return { isFeatured: -1, createdAt: -1 };
  }
}

// Helper function to get filter options
async function getFilterOptions(currentFilters: any) {
  try {
    const baseMatch: Record<string, any> = {
      gender: "girl",
      isActive: true,
      role: "escort",
    };

    // Apply current location filters to filter options
    if (currentFilters.countyName) {
      const county = await County.findOne({
        name: { $regex: new RegExp(`^${currentFilters.countyName}$`, "i") },
      });
      if (county) {
        baseMatch.county = county._id;
      }
    }

    if (currentFilters.regionName) {
      const region = await Region.findOne({
        name: { $regex: new RegExp(`^${currentFilters.regionName}$`, "i") },
      });
      if (region) {
        baseMatch.regions = region._id;
      }
    }

    const [
      ethnicities,
      nationalities,
      categories,
      practices,
      languages,
      ageRange,
    ] = await Promise.all([
      Escort.distinct("ethnicity", { ...baseMatch, ethnicity: { $ne: "" } }),
      Escort.distinct("nationality", {
        ...baseMatch,
        nationality: { $ne: "" },
      }),
      Escort.distinct("categories", { ...baseMatch, categories: { $ne: [] } }),
      Escort.distinct("practices", { ...baseMatch, practices: { $ne: [] } }),
      Escort.distinct("languages", { ...baseMatch, languages: { $ne: [] } }),
      Escort.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            minAge: { $min: { $toInt: "$age" } },
            maxAge: { $max: { $toInt: "$age" } },
          },
        },
      ]),
    ]);

    return {
      ethnicities: ethnicities.filter(Boolean).sort(),
      nationalities: nationalities.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      practices: practices.filter(Boolean).sort(),
      languages: languages.filter(Boolean).sort(),
      ageRange: {
        min: ageRange[0]?.minAge || 18,
        max: ageRange[0]?.maxAge || 65,
      },
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return null;
  }
}

// ============ TYPE DEFINITIONS ============

export interface FetchEscortsParams {
  countyName?: string;
  regionName?: string;
  town?: string;
  practice?: string;
  category?: string;
  page?: number;
  limit?: number;
  minAge?: number;
  maxAge?: number;
  sortBy?:
    | "newest"
    | "oldest"
    | "rating"
    | "popular"
    | "featured"
    | "price_low"
    | "price_high";
  isVerified?: boolean;
  isFeatured?: boolean;
  workType?: "independent" | "agency_employee";
}

export interface EscortPaginatedResponse {
  escorts: EscortCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  success: boolean;
  filters: {
    county?: string;
    region?: string;
    town?: string;
    practice?: string;
    category?: string;
    minAge?: number;
    maxAge?: number;
    isVerified?: boolean;
    isFeatured?: boolean;
    workType?: string;
  };
  filterOptions?: {
    ethnicities: string[];
    nationalities: string[];
    categories: string[];
    practices: string[];
    languages: string[];
    ageRange: { min: number; max: number };
  } | null;
}
