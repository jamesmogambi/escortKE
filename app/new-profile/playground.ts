// app/actions/escort.actions.ts
"use server";

import { connectToDatabase } from "@/lib/db";
import Escort from "@/models/escort.model";
import { Types } from "mongoose";
import {
  EscortsResponse,
  FetchEscortsParams,
  EscortCardData,
} from "@/types/escort.types";

export async function fetchEscorts(
  params: FetchEscortsParams = {},
): Promise<EscortsResponse> {
  try {
    // Connect to database
    await connectToDatabase();

    const {
      page = 1,
      limit = 10,
      sortBy = "featured",
      gender,
      county,
      region,
      isActive = true,
      isVerified,
    } = params;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Basic filters
    if (isActive !== undefined) query.isActive = isActive;
    if (isVerified !== undefined) query.isVerified = isVerified;
    if (gender) query.gender = gender;

    // Location filters
    if (county) {
      // Check if county is ObjectId or string
      if (Types.ObjectId.isValid(county)) {
        query.county = new Types.ObjectId(county);
      } else {
        query.countyCode = county;
      }
    }

    if (region) {
      if (Types.ObjectId.isValid(region)) {
        query.regions = new Types.ObjectId(region);
      } else {
        // If region is slug/name, you might need to lookup region ID first
        // This is simplified - you might want to handle this differently
        query.regions = region;
      }
    }

    // Determine sort order
    let sortOptions: any = {};
    switch (sortBy) {
      case "featured":
        sortOptions = { isFeatured: -1, createdAt: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1, totalReviews: -1 };
        break;
      case "views":
        sortOptions = { totalViews: -1 };
        break;
      default:
        sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    // Execute count query for pagination
    const totalEscorts = await Escort.countDocuments(query);

    // Fetch escorts with population
    const escorts = await Escort.find(query)
      .populate({
        path: "countyDetails",
        select: "name code",
      })
      .populate({
        path: "primaryRegionDetails",
        select: "name",
      })
      .populate({
        path: "regionsDetails",
        select: "name",
      })
      .populate({
        path: "agencyDetails",
        select: "name logo",
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Transform data for client
    const formattedEscorts: EscortCardData[] = escorts.map((escort: any) => ({
      _id: escort._id.toString(),
      name: escort.name || "Anonymous",
      username: escort.username,
      previewPhoto: escort.previewPhoto || escort.images?.[0],
      images: escort.images || [],
      age: escort.age,
      gender: escort.gender,
      workType: escort.workType,
      isVerified: escort.isVerified,
      isFeatured: escort.isFeatured,
      rating: escort.rating || 0,
      totalReviews: escort.totalReviews || 0,
      primaryLocationDisplay: getPrimaryLocationDisplay(escort),
      workTypeDisplay: getWorkTypeDisplay(escort),
      rates: (escort.rates || []).map((rate: any) => ({
        duration: rate.duration,
        incall: rate.incall,
        outcall: rate.outcall,
      })),
      categories: escort.categories || [],
      agencyDetails: escort.agencyDetails
        ? {
            name: escort.agencyDetails.name,
            logo: escort.agencyDetails.logo,
          }
        : undefined,
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalEscorts / limit);

    return {
      escorts: formattedEscorts,
      pagination: {
        currentPage: page,
        totalPages,
        totalEscorts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching escorts:", error);
    throw new Error("Failed to fetch escorts");
  }
}

// Helper function to get primary location display
function getPrimaryLocationDisplay(escort: any): string {
  if (escort.primaryLocationDisplay) {
    return escort.primaryLocationDisplay;
  }

  // Manual construction if virtual isn't available in lean()
  const primaryLocation =
    escort.locations?.find(
      (loc: any) => loc.region?.toString() === escort.primaryRegion?.toString(),
    ) || escort.locations?.[0];

  if (primaryLocation) {
    const parts: string[] = [];
    if (primaryLocation.estate) parts.push(primaryLocation.estate);
    if (primaryLocation.town) parts.push(primaryLocation.town);
    if (escort.primaryRegionDetails?.name)
      parts.push(escort.primaryRegionDetails.name);
    if (escort.countyDetails?.name)
      parts.push(`${escort.countyDetails.name} County`);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  }

  return "Location not specified";
}

// Helper function to get work type display
function getWorkTypeDisplay(escort: any): string {
  if (escort.workType === "independent") {
    return "Independent Escort";
  } else if (escort.agencyDetails) {
    return `Agency: ${escort.agencyDetails.name}`;
  }
  return "Escort";
}

// Additional useful server actions
export async function fetchFeaturedEscorts(
  limit: number = 6,
): Promise<EscortsResponse> {
  return fetchEscorts({
    page: 1,
    limit,
    sortBy: "featured",
    isActive: true,
    isVerified: true,
  });
}

export async function fetchEscortById(id: string) {
  try {
    await connectToDatabase();

    const escort = await Escort.findById(id)
      .populate("countyDetails")
      .populate("regionsDetails")
      .populate("primaryRegionDetails")
      .populate("agencyDetails")
      .populate({
        path: "locationsWithDetails",
        select: "name",
      })
      .lean()
      .exec();

    if (!escort) {
      return null;
    }

    return escort;
  } catch (error) {
    console.error("Error fetching escort by ID:", error);
    throw new Error("Failed to fetch escort");
  }
}

export async function fetchEscortBySlug(slug: string) {
  try {
    await connectToDatabase();

    const escort = await Escort.findOne({ slug, isActive: true })
      .populate("countyDetails")
      .populate("regionsDetails")
      .populate("primaryRegionDetails")
      .populate("agencyDetails")
      .populate({
        path: "locationsWithDetails",
        select: "name",
      })
      .lean()
      .exec();

    if (!escort) {
      return null;
    }

    return escort;
  } catch (error) {
    console.error("Error fetching escort by slug:", error);
    throw new Error("Failed to fetch escort");
  }
}
