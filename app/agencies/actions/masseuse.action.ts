// actions/masseuse.action.ts
"use server";

import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";
import { County } from "@/models/County";
import { Region } from "@/models/Region";
import { Types } from "mongoose";
import { EscortCardData } from "@/types/escort.types";

// ============ TYPES ============

export interface FetchMassageEscortsParams {
  county?: string;
  region?: string;
  massageType?: string;
  page?: number;
  limit?: number;
  gender?: "girl" | "boy" | "transgender" | "non-binary" | "other";
  minAge?: number;
  maxAge?: number;
  minRating?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  hasOutcall?: boolean;
  hasIncall?: boolean;
  sortBy?:
    | "newest"
    | "rating"
    | "popular"
    | "featured"
    | "price_low"
    | "price_high";
}

export interface FetchMassageEscortsResponse {
  escorts: EscortCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filters: {
    county?: string;
    region?: string;
    massageType?: string;
    gender: string;
  };
  filterOptions: {
    massageTypes: string[];
    counties: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}

// ============ MAIN SERVER ACTION ============

export async function fetchMassageEscorts(
  params: FetchMassageEscortsParams = {},
): Promise<FetchMassageEscortsResponse> {
  try {
    await connectToDB();

    const {
      county,
      region,
      massageType,
      page = 1,
      limit = 20,
      gender = "girl",
      minAge,
      maxAge,
      minRating,
      isVerified,
      isFeatured,
      hasOutcall,
      hasIncall,
      sortBy = "newest",
    } = params;

    const skip = (page - 1) * limit;

    // Build the base query
    const query: any = {
      gender,
      isActive: true,
      role: "escort",
      // Must have at least one massage service
      massage: { $exists: true, $ne: [] },
    };

    // Filter by massage type (case-insensitive)
    if (massageType) {
      query.massage = {
        $in: [new RegExp(massageType, "i")],
      };
    }

    // Age filter (stored as string in schema)
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) {
        query.age.$gte = minAge.toString();
      }
      if (maxAge) {
        query.age.$lte = maxAge.toString();
      }
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: minRating };
    }

    // Status filters
    if (isVerified !== undefined) {
      query.isVerified = isVerified;
    }
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured;
    }

    // Location-based filtering
    const locationConditions: any[] = [];

    if (county) {
      const countyDoc = await County.findOne({
        name: { $regex: new RegExp(`^${county}$`, "i") },
      }).select("_id");

      if (countyDoc) {
        locationConditions.push({ county: countyDoc._id });
      }
    }

    if (region) {
      const regionDoc = await Region.findOne({
        name: { $regex: new RegExp(`^${region}$`, "i") },
      }).select("_id");

      if (regionDoc) {
        locationConditions.push({ regions: regionDoc._id });
      }
    }

    if (locationConditions.length > 0) {
      query.$and = locationConditions;
    }

    // Service type filters
    if (hasOutcall || hasIncall) {
      query.rates = { $elemMatch: {} };

      if (hasOutcall) {
        query.rates.$elemMatch.outcall = { $ne: "", $exists: true };
      }
      if (hasIncall) {
        query.rates.$elemMatch.incall = { $ne: "", $exists: true };
      }
    }

    // Determine sort order
    let sortOptions: any = {};
    switch (sortBy) {
      case "rating":
        sortOptions = { rating: -1, totalReviews: -1 };
        break;
      case "popular":
        sortOptions = { totalViews: -1, rating: -1 };
        break;
      case "featured":
        sortOptions = { isFeatured: -1, createdAt: -1 };
        break;
      case "price_low":
        sortOptions = { "rates.0.incall": 1 };
        break;
      case "price_high":
        sortOptions = { "rates.0.incall": -1 };
        break;
      case "newest":
      default:
        sortOptions = { isFeatured: -1, createdAt: -1 };
        break;
    }

    // Execute main query with population
    const [escorts, total] = await Promise.all([
      Escort.find(query)
        .populate("countyDetails", "name code")
        .populate("regionsDetails", "name county")
        .populate("primaryRegionDetails", "name county")
        .populate("agencyDetails", "name slug logo isVerified")
        .populate("locationsWithDetails", "name county")
        .select({
          // Basic Info
          name: 1,
          username: 1,
          slug: 1,
          age: 1,
          gender: 1,
          previewPhoto: 1,
          images: 1,
          videos: 1,
          about: 1,
          ethnicity: 1,
          nationality: 1,
          bustSize: 1,
          weight: 1,
          zodiacSign: 1,
          languages: 1,

          // Services
          practices: 1,
          categories: 1,
          massage: 1,
          extraServices: 1,

          // Contact
          telephone: 1,
          whatsappPhone: 1,
          email: 1,

          // Location fields
          county: 1,
          countyCode: 1,
          regions: 1,
          primaryRegion: 1,
          locations: 1,

          // Rates
          rates: 1,

          // Status
          isVerified: 1,
          isFeatured: 1,
          isActive: 1,
          workType: 1,

          // Stats
          rating: 1,
          totalReviews: 1,
          totalViews: 1,

          // Agency
          agencyId: 1,
          isAgencyFeatured: 1,

          // Timestamps
          createdAt: 1,
          updatedAt: 1,
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),

      Escort.countDocuments(query),
    ]);

    // Format escorts for client with the correct EscortCardData type
    const formattedEscorts = escorts.map((escort) =>
      formatEscortToCardData(escort),
    );

    // Get filter options for the sidebar/filters
    const filterOptions = await getMassageFilterOptions({
      county,
      region,
      gender,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      escorts: formattedEscorts,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      filters: {
        county,
        region,
        massageType,
        gender,
      },
      filterOptions,
    };
  } catch (error) {
    console.error("Error fetching massage escorts:", error);
    throw new Error("Failed to fetch massage escorts");
  }
}

// ============ FORMATTING FUNCTION ============

function formatEscortToCardData(escort: any): EscortCardData {
  // Helper function to clean image URLs
  const cleanImageUrl = (url: string): string | null => {
    if (!url) return null;
    url = url.trim();
    if (url.includes(" ") && url.includes("https://")) {
      const parts = url.split(" ");
      const validPart = parts.find(
        (part) => part.startsWith("https://") || part.startsWith("http://"),
      );
      if (validPart) return validPart;
    }
    if (url.startsWith("https://https://")) {
      return url.replace("https://https://", "https://");
    }
    return url;
  };

  // Clean images
  const previewPhoto = cleanImageUrl(escort.previewPhoto);
  const images = (escort.images || [])
    .map((img: string) => cleanImageUrl(img))
    .filter((img: string): img is string => img !== null);

  // Create about excerpt
  const aboutExcerpt = escort.about
    ? escort.about.length > 200
      ? escort.about.substring(0, 200) + "..."
      : escort.about
    : null;

  // Process locations
  const locations = (escort.locations || []).map((loc: any) => {
    const regionName =
      escort.regionsDetails?.find(
        (r: any) => r._id.toString() === loc.region?.toString(),
      )?.name || null;

    return {
      _id: loc._id?.toString(),
      region: loc.region?.toString(),
      regionName,
      town: loc.town || undefined,
      estate: loc.estate || undefined,
      address: loc.address || undefined,
      street: loc.street || undefined,
      postalCode: loc.postalCode || undefined,
      isActive: loc.isActive,
      notes: loc.notes || undefined,
    };
  });

  // Get primary location display
  let primaryLocationDisplay = "Location not specified";
  const primaryLoc = escort.primaryRegion
    ? locations.find(
        (l: { region: any }) => l.region === escort.primaryRegion?.toString(),
      )
    : locations[0];

  if (primaryLoc) {
    const parts: string[] = [];
    if (primaryLoc.estate) parts.push(primaryLoc.estate);
    if (primaryLoc.town) parts.push(primaryLoc.town);
    if (primaryLoc.regionName) parts.push(primaryLoc.regionName);
    if (escort.countyDetails?.name)
      parts.push(`${escort.countyDetails.name} County`);
    primaryLocationDisplay =
      parts.length > 0 ? parts.join(", ") : "Location not specified";
  }

  // Get all locations display
  const allLocationsDisplay = locations
    .map((loc: { estate: string; town: string; regionName: string }) => {
      const parts: string[] = [];
      if (loc.estate) parts.push(loc.estate);
      if (loc.town) parts.push(loc.town);
      if (loc.regionName) parts.push(loc.regionName);
      return parts.join(", ");
    })
    .filter(Boolean);

  // Get location details for primary location
  const locationDetails = primaryLoc
    ? {
        town: primaryLoc.town || null,
        estate: primaryLoc.estate || null,
        address: primaryLoc.address || null,
        street: primaryLoc.street || null,
        postalCode: primaryLoc.postalCode || null,
        notes: primaryLoc.notes || null,
        isActive: primaryLoc.isActive,
      }
    : null;

  // Create working areas
  const workingAreas = (escort.regionsDetails || []).map((region: any) => {
    const location = locations.find(
      (l: { region: any }) => l.region === region._id.toString(),
    );
    return {
      id: region._id.toString(),
      name: region.name,
      countyName: region.county ? escort.countyDetails?.name || null : null,
      isPrimary: escort.primaryRegion?.toString() === region._id.toString(),
      locationDetails: location
        ? {
            town: location.town,
            estate: location.estate,
            address: location.address,
          }
        : null,
    };
  });

  // Process rates
  const rates = (escort.rates || []).map((rate: any) => ({
    duration: rate.duration,
    incall: rate.incall || "",
    outcall: rate.outcall || null,
    region: rate.region?.toString(),
  }));

  // Find hourly rate (prefer 1 hour rate)
  const hourlyRate =
    rates.find(
      (r: { duration: string }) =>
        r.duration.toLowerCase().includes("1 hour") ||
        r.duration.toLowerCase().includes("60 min"),
    ) ||
    rates[0] ||
    null;

  // Work type display
  const workTypeDisplay =
    escort.workType === "independent"
      ? "Independent Escort"
      : escort.agencyDetails?.name
        ? `Agency: ${escort.agencyDetails.name}`
        : "Escort";

  return {
    _id: escort._id.toString(),
    name: escort.name || null,
    username: escort.username || null,
    slug: escort.slug || escort._id.toString(),

    // Media
    previewPhoto,
    images,

    // Contact Info
    telephone: escort.telephone || null,
    whatsappPhone: escort.whatsappPhone || null,
    email: escort.email || null,

    // Basic Info
    age: escort.age || null,
    gender: escort.gender || null,
    about: escort.about || null,
    aboutExcerpt,
    ethnicity: escort.ethnicity || null,
    nationality: escort.nationality || null,
    bustSize: escort.bustSize || null,
    weight: escort.weight || null,
    zodiacSign: escort.zodiacSign || null,
    languages: escort.languages || [],

    // Services
    practices: escort.practices || [],
    categories: escort.categories || [],

    // Status
    isVerified: escort.isVerified || false,
    isFeatured: escort.isFeatured || false,
    isActive: escort.isActive || false,

    // Stats
    rating: escort.rating || 0,
    totalReviews: escort.totalReviews || 0,
    totalViews: escort.totalViews || 0,

    // Location
    primaryRegion: escort.primaryRegionDetails
      ? {
          _id: escort.primaryRegionDetails._id.toString(),
          name: escort.primaryRegionDetails.name,
          county: escort.primaryRegionDetails.county?.toString(),
        }
      : null,

    countyDetails: escort.countyDetails
      ? {
          _id: escort.countyDetails._id.toString(),
          name: escort.countyDetails.name,
          code: escort.countyDetails.code,
        }
      : null,

    primaryLocationDisplay,
    allLocationsDisplay,
    locationDetails,
    locations,
    workingAreas,

    // Rates
    rates,
    hourlyRate,

    // Work Type
    workType: escort.workType || null,
    workTypeDisplay,

    // Agency
    agency: escort.agencyDetails
      ? {
          _id: escort.agencyDetails._id.toString(),
          name: escort.agencyDetails.name,
          slug: escort.agencyDetails.slug,
          logo: escort.agencyDetails.logo || null,
          isVerified: escort.agencyDetails.isVerified || false,
        }
      : null,

    // Videos
    videos: escort.videos || [],

    // Timestamps
    createdAt: escort.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: escort.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

// ============ FILTER OPTIONS FUNCTION ============

async function getMassageFilterOptions(filters: {
  county?: string;
  region?: string;
  gender: string;
}) {
  try {
    const baseMatch: any = {
      gender: filters.gender,
      isActive: true,
      role: "escort",
      massage: { $exists: true, $ne: [] },
    };

    // Apply location filters to base match
    if (filters.county) {
      const county = await County.findOne({
        name: { $regex: new RegExp(`^${filters.county}$`, "i") },
      });
      if (county) {
        baseMatch.county = county._id;
      }
    }

    if (filters.region) {
      const region = await Region.findOne({
        name: { $regex: new RegExp(`^${filters.region}$`, "i") },
      });
      if (region) {
        baseMatch.regions = region._id;
      }
    }

    // Get all distinct massage types
    const massageTypes = await Escort.distinct("massage", baseMatch);

    // Filter out empty values and sort
    const filteredMassageTypes = massageTypes
      .filter((type: string) => type && type.trim() !== "")
      .sort();

    // Get counties with counts
    const countiesWithCounts = await Escort.aggregate([
      { $match: baseMatch },
      {
        $lookup: {
          from: "counties",
          localField: "county",
          foreignField: "_id",
          as: "countyInfo",
        },
      },
      { $unwind: "$countyInfo" },
      {
        $group: {
          _id: "$county",
          name: { $first: "$countyInfo.name" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          name: 1,
          count: 1,
        },
      },
    ]);

    // Get price range
    const priceRange = await Escort.aggregate([
      { $match: baseMatch },
      { $unwind: "$rates" },
      {
        $match: {
          $or: [
            { "rates.duration": /massage|hour|min/i },
            {
              "rates.duration": {
                $in: ["1 hour", "60 min", "90 min", "120 min"],
              },
            },
          ],
        },
      },
      {
        $addFields: {
          numericPrice: {
            $convert: {
              input: {
                $trim: {
                  input: {
                    $replaceAll: {
                      input: { $toString: "$rates.incall" },
                      find: ",",
                      replacement: "",
                    },
                  },
                },
              },
              to: "double",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $match: {
          numericPrice: { $ne: null, $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          min: { $min: "$numericPrice" },
          max: { $max: "$numericPrice" },
        },
      },
    ]);

    return {
      massageTypes: filteredMassageTypes,
      counties: countiesWithCounts,
      priceRange: {
        min: priceRange[0]?.min || 0,
        max: priceRange[0]?.max || 1000,
      },
    };
  } catch (error) {
    console.error("Error getting filter options:", error);
    return {
      massageTypes: [],
      counties: [],
      priceRange: { min: 0, max: 1000 },
    };
  }
}

// ============ ADDITIONAL HELPER FUNCTIONS ============

/**
 * Get popular massage types
 */
export async function getPopularMassageTypes(limit: number = 10) {
  try {
    await connectToDB();

    const popular = await Escort.aggregate([
      {
        $match: {
          isActive: true,
          role: "escort",
          massage: { $exists: true, $ne: [] },
        },
      },
      { $unwind: "$massage" },
      {
        $group: {
          _id: "$massage",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          name: "$_id",
          count: 1,
          avgRating: { $round: ["$avgRating", 1] },
          _id: 0,
        },
      },
    ]);

    return popular;
  } catch (error) {
    console.error("Error getting popular massage types:", error);
    return [];
  }
}

/**
 * Get massage escort by ID
 */
export async function getMassageEscortById(
  id: string,
): Promise<EscortCardData | null> {
  try {
    await connectToDB();

    const escort = await Escort.findOne({
      _id: new Types.ObjectId(id),
      isActive: true,
      role: "escort",
      massage: { $exists: true, $ne: [] },
    })
      .populate("countyDetails", "name code")
      .populate("regionsDetails", "name county")
      .populate("primaryRegionDetails", "name county")
      .populate("agencyDetails", "name slug logo isVerified")
      .populate("locationsWithDetails", "name county")
      .lean();

    if (!escort) {
      return null;
    }

    return formatEscortToCardData(escort);
  } catch (error) {
    console.error("Error getting massage escort by ID:", error);
    return null;
  }
}
