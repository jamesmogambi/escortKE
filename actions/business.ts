"use server";
// app/actions/agency.actions.ts

import { connectToDB, safeClone } from "@/lib/mongoose";
import Agency, { AgencyDoc } from "@/models/Agency";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import Escort from "@/models/Escort";
import { BUSINESS_TYPES } from "@/constants";

export interface AgencyFilters {
  county?: string;
  region?: string;
  business?: string;
  town?: string;
  verified?: string;
  featured?: string;
  categories?: string[];
  minRating?: number;
  search?: string;
  hasEmployees?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  includeEmployees?: boolean;
}

export async function getAgencies(
  filters: AgencyFilters = {},
  options: PaginationOptions = {},
) {
  try {
    await connectToDB();

    const {
      page = 1,
      limit = 12,
      sortBy = "featured",
      includeEmployees = false,
    } = options;

    // Build query
    const query: any = { isActive: true };

    // County filter
    if (filters.county) {
      if (Types.ObjectId.isValid(filters.county)) {
        query.county = new Types.ObjectId(filters.county);
      } else {
        query.countyCode = filters.county;
      }
    }

    // Region filter
    if (filters.region && Types.ObjectId.isValid(filters.region)) {
      query.region = new Types.ObjectId(filters.region);
    }

    // Business type filter
    if (filters.business) {
      const businessTypes = ["agency", "spa", "massage_parlor", "brothel"];
      if (businessTypes.includes(filters.business)) {
        query.businessType = filters.business;
      }
    }

    // Town filter
    if (filters.town) {
      query.town = { $regex: new RegExp(filters.town, "i") };
    }

    // Search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: new RegExp(filters.search, "i") } },
        { description: { $regex: new RegExp(filters.search, "i") } },
        { estate: { $regex: new RegExp(filters.search, "i") } },
      ];
    }

    // Status filters
    if (filters.verified === "true") query.isVerified = true;
    if (filters.featured === "true") query.isFeatured = true;

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      query.categories = { $in: filters.categories };
    }

    // Rating filter
    if (filters.minRating) {
      query.rating = { $gte: filters.minRating };
    }

    // Sort options
    let sort: any = {};
    switch (sortBy) {
      case "rating":
        sort = { rating: -1, totalReviews: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "popular":
        sort = { totalBookings: -1, totalViews: -1 };
        break;
      case "employees":
        sort = { featuredEmployeesCount: -1 };
        break;
      default:
        sort = { isFeatured: -1, rating: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get agencies with populated data
    const agencies = await Agency.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("county", "name code")
      .populate("region", "name")
      .populate("owner", "name email isVerified")
      .select("-verificationDocuments -__v")
      .lean();

    // Get total count
    const total = await Agency.countDocuments(query);

    // Include employees if requested
    let agenciesWithEmployees = agencies;
    if (includeEmployees || filters.hasEmployees) {
      agenciesWithEmployees = await Promise.all(
        agencies.map(async (agency) => {
          const employees = await Escort.find({
            agencyId: agency._id,
            workType: "agency_employee",
            isActive: true,
          })
            .select(
              "name previewPhoto age rating totalReviews categories isAgencyFeatured rates",
            )
            .limit(6)
            .sort({ isAgencyFeatured: -1, rating: -1 })
            .lean();

          const totalEmployees = await Escort.countDocuments({
            agencyId: agency._id,
            workType: "agency_employee",
            isActive: true,
          });

          return {
            ...agency,
            employees,
            totalEmployees,
            hasEmployees: totalEmployees > 0,
          };
        }),
      );

      // Filter out agencies without employees if requested
      if (filters.hasEmployees) {
        agenciesWithEmployees = agenciesWithEmployees.filter(
          (agency) => agency.hasEmployees,
        );
      }
    }

    return {
      success: true,
      data: safeClone(agenciesWithEmployees),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("Error fetching agencies:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getAgencyBySlug(slug: string) {
  try {
    await connectToDB();

    const agency = await Agency.findOne({ slug, isActive: true })
      .populate("county", "name code")
      .populate("region", "name")
      .populate("owner", "name email isVerified")
      .select("-verificationDocuments -__v")
      .lean();

    if (!agency) {
      return { success: false, error: "Agency not found" };
    }

    return { success: true, data: agency };
  } catch (error: any) {
    console.error("Error fetching agency:", error);
    return { success: false, error: error.message };
  }
}

export async function getAgencyEmployees(
  agencyId: string,
  filters: {
    featured?: string;
    verified?: string;
    categories?: string[];
    minRating?: string;
    maxRate?: string;
  } = {},
  options: { page?: number; limit?: number; sortBy?: string } = {},
) {
  try {
    await connectToDB();

    const { page = 1, limit = 20, sortBy = "featured" } = options;

    const query: any = {
      agencyId: new Types.ObjectId(agencyId),
      workType: "agency_employee",
      isActive: true,
    };

    // Filters
    if (filters.featured === "true") query.isAgencyFeatured = true;
    if (filters.verified === "true") query.isVerified = true;
    if (filters.categories && filters.categories.length > 0) {
      query.categories = { $in: filters.categories };
    }
    if (filters.minRating) {
      query.rating = { $gte: parseFloat(filters.minRating) };
    }
    if (filters.maxRate) {
      query["rates.incall"] = { $lte: filters.maxRate };
    }

    // Sort options
    let sort: any = {};
    switch (sortBy) {
      case "rating":
        sort = { rating: -1, totalReviews: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "price_low":
        sort = { "rates.incall": 1 };
        break;
      case "price_high":
        sort = { "rates.incall": -1 };
        break;
      default:
        sort = { isAgencyFeatured: -1, rating: -1 };
    }

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Escort.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(
          "name previewPhoto age rating totalReviews categories rates isAgencyFeatured about",
        )
        .lean(),
      Escort.countDocuments(query),
    ]);

    return {
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("Error fetching agency employees:", error);
    return { success: false, error: error.message };
  }
}

export async function getBusinessTypes() {
  return {
    success: true,
    data: BUSINESS_TYPES,
  };
}

export async function createAgency(data: any) {
  try {
    await connectToDB();

    // Generate slug
    const slug = data.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    const agency = new Agency({
      ...data,
      slug,
      isActive: true,
      verificationStatus: "pending",
    });

    await agency.save();

    revalidatePath("/agencies");
    return { success: true, data: agency };
  } catch (error: any) {
    console.error("Error creating agency:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAgency(id: string, data: any) {
  try {
    await connectToDB();

    const agency = await Agency.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!agency) {
      return { success: false, error: "Agency not found" };
    }

    revalidatePath("/agencies");
    revalidatePath(`/agencies/${agency.slug}`);
    return { success: true, data: agency };
  } catch (error: any) {
    console.error("Error updating agency:", error);
    return { success: false, error: error.message };
  }
}
