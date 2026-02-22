// app/actions/escort.actions.ts
import { connectToDB, safeClone } from "@/lib/mongoose";
import { paginate, ITEMS_PER_PAGE, PaginationResult } from "@/lib/pagination";
import { County, ICounty } from "@/models/County";
import Escort, { EscortDoc } from "@/models/Escort";
import { IRegion, Region } from "@/models/Region";
import { BDSMFilterParams, PaginatedResponse } from "@/types/bdsm";
import mongoose, { Types } from "mongoose";
import { cache } from "react";

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
// export async function getSimpleFeaturedEscorts(limit: number = 20) {
//   try {
//     await connectToDB();

//     const escorts = (await Escort.find({
//       isActive: true,
//       previewPhoto: { $exists: true, $ne: "" }, // Has profile photo
//       images: { $exists: true, $ne: [] }, // Has at least one image
//     })
//       // .select(
//       //   "name age nationality previewPhoto city plan slug bustSize about isVerified images",
//       // )
//       .populate<{ regionDetails: IRegion }>({
//         path: "region",
//         select: "name _id countyCode",
//       })
//       .populate<{ countyDetails: ICounty }>({
//         path: "county",
//         select: "name _id code",
//       })
//       // .populate<{ regionDetails: IRegion }>("regionDetails")
//       // .populate<{ countyDetails: ICounty }>("countyDetails")
//       .sort({
//         // plan: -1, // VIP/Premium first
//         // isVerified: -1, // Verified profiles
//         images: -1, // More images first
//         createdAt: -1, // Newest
//       })
//       .limit(20)) as any; // Cast to any to resolve type mismatch

//     const transformed = safeClone(escorts);
//     return {
//       success: true,
//       data: transformed,
//       count: transformed.length,
//     };
//   } catch (error) {
//     console.error("Error in simple fetch:", error);
//     return {
//       success: false,
//       data: [],
//       count: 0,
//       error: "Failed to fetch data",
//     };
//   }
// }

// export async function getSimpleFeaturedEscorts(limit: number = 20) {
//   try {
//     await connectToDB();

//     const escorts = await Escort.find({
//       isActive: true,
//       previewPhoto: { $exists: true, $ne: "" },
//       images: { $exists: true, $ne: [] },
//       gender: "girl",
//     })
//       .select(
//         "name age nationality previewPhoto slug bustSize about isVerified images",
//       )
//       .populate("countyDetails") // Virtual
//       .populate("primaryRegionDetails") // Virtual
//       .populate("regionsDetails") // Virtual
//       .sort({
//         isFeatured: -1,
//         isVerified: -1,
//         createdAt: -1,
//       })
//       .limit(limit)
//       .lean();

//     // Use the virtual getters
//     const transformed = escorts.map((escort) => {
//       // Create a mongoose document-like object to access virtuals
//       const doc = escort as any;

//       return {
//         ...escort,
//         // Use the virtual getters from schema
//         primaryLocationDisplay:
//           doc.primaryLocationDisplay ||
//           `${doc.primaryRegionDetails?.name || ""} ${doc.countyDetails?.name || ""}`.trim(),
//         workingAreas: doc.workingAreas || [],
//         allLocationsDisplay: doc.allLocationsDisplay || [],
//       };
//     });

//     return {
//       success: true,
//       data: safeClone(transformed),
//       count: transformed.length,
//     };
//   } catch (error) {
//     console.error("Error in simple fetch:", error);
//     return {
//       success: false,
//       data: [],
//       count: 0,
//       error: "Failed to fetch data",
//     };
//   }
// }

// Helper function to fix URLs

// ============ CLIENT-SAFE TYPES ============
export interface HomeEscort {
  _id: string;
  name: string;
  slug: string;
  previewPhoto: string;
  images: string[];
  videos: string[];
  age?: string;
  nationality?: string;
  about?: string;
  bustSize?: string;

  // Contact Info
  telephone?: string;
  whatsappPhone?: string;

  // Badges
  isVerified: boolean;
  isFeatured: boolean;
  isVip: boolean;
  isNew: boolean;

  // Stats
  rating: number;
  totalReviews: number;

  // Location
  location: {
    primaryDisplay: string;
    countyName: string;
    regionName: string;
    town?: string;
    estate?: string;
  };

  // Services (limited for card display)
  services: string[];
}

export interface HomeEscortsResponse {
  success: boolean;
  data: {
    featured: HomeEscort[];
    recent: HomeEscort[];
    verified: HomeEscort[];
    popular: HomeEscort[];
  };
  error?: string;
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedSection<T> {
  items: T[];
  pagination: PaginationMetadata;
}

export interface SectionParams {
  page?: number;
  limit?: number;
  county?: string;
  region?: string;
  minRating?: number;
}

// ============ HELPER FUNCTIONS ============

function fixImageUrl(url: string): string {
  if (!url) return "/images/placeholder.jpg";

  // Remove duplicate domain
  if (url.includes("https://escort254.com https://escort254.com")) {
    url = url.replace(
      "https://escort254.com https://escort254.com",
      "https://escort254.com",
    );
  }
  if (url.includes("https://escort254.com https://")) {
    url = url.replace("https://escort254.com ", "");
  }

  return url.trim();
}

function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, "");

  // Format Kenyan numbers
  if (cleaned.startsWith("254")) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("0")) {
    return "+254" + cleaned.substring(1);
  }
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    return "+254" + cleaned;
  }

  return phone;
}

function isNewEscort(createdAt: Date): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(createdAt) > sevenDaysAgo;
}

// actions/get-home-escorts.ts - IMPROVED TRANSFORM

function transformToHomeEscort(escort: any): HomeEscort {
  // Fix URLs
  const previewPhoto = fixImageUrl(escort.previewPhoto || "");
  const images = (escort.images || []).map(fixImageUrl).filter(Boolean);

  // Format phone numbers
  const telephone = escort.telephone
    ? formatPhoneNumber(escort.telephone)
    : undefined;
  const whatsappPhone = escort.whatsappPhone
    ? formatPhoneNumber(escort.whatsappPhone)
    : undefined;

  // ============ FIXED LOCATION DISPLAY ============

  // Try multiple ways to get location display
  let primaryDisplay = "Location not specified";

  // Method 1: Use virtual if available
  if (
    escort.primaryLocationDisplay &&
    escort.primaryLocationDisplay !== "Location not specified"
  ) {
    primaryDisplay = escort.primaryLocationDisplay;
  }
  // Method 2: Build from primaryRegion and county
  else if (escort.primaryRegionDetails?.name || escort.countyDetails?.name) {
    const parts = [];

    // Add estate/town from locations
    if (escort.locations?.[0]?.estate) parts.push(escort.locations[0].estate);
    if (escort.locations?.[0]?.town) parts.push(escort.locations[0].town);

    // Add region name
    if (escort.primaryRegionDetails?.name) {
      parts.push(escort.primaryRegionDetails.name);
    }

    // Add county name
    if (escort.countyDetails?.name) {
      parts.push(`${escort.countyDetails.name} County`);
    }

    if (parts.length > 0) {
      primaryDisplay = parts.join(", ");
    }
  }
  // Method 3: Use first location string
  else if (escort.locations?.[0]?.notes) {
    primaryDisplay = escort.locations[0].notes;
  }
  // Method 4: Use region from regions array
  else if (escort.regionsDetails?.[0]?.name) {
    primaryDisplay = escort.regionsDetails[0].name;
    if (escort.countyDetails?.name) {
      primaryDisplay += `, ${escort.countyDetails.name} County`;
    }
  }
  // Method 5: Use county name only
  else if (escort.countyDetails?.name) {
    primaryDisplay = `${escort.countyDetails.name} County`;
  }

  // Extract location components with fallbacks
  let countyName = escort.countyDetails?.name || "Unknown";
  let regionName =
    escort.primaryRegionDetails?.name || escort.regionsDetails?.[0]?.name || "";
  let town = escort.locations?.[0]?.town || "";
  let estate = escort.locations?.[0]?.estate || "";

  // Get top 3 services for display
  const services = [
    ...(escort.practices || []).slice(0, 2),
    ...(escort.massage || []).slice(0, 1),
    ...(escort.extraServices || []).slice(0, 1),
  ].slice(0, 3);

  return {
    _id: escort._id.toString(),
    name: escort.name || "Anonymous",
    slug: escort.slug || "",
    previewPhoto,
    images,
    video: escort.videos || "",
    age: escort.age,
    nationality: escort.nationality || "Kenyan",
    about: escort.about
      ? escort.about.length > 120
        ? `${escort.about.substring(0, 120)}...`
        : escort.about
      : undefined,
    bustSize: escort.bustSize,
    telephone,
    whatsappPhone,
    isVerified: escort.isVerified || false,
    isFeatured: escort.isFeatured || false,
    isVip: escort.isFeatured || false,
    isNew: isNewEscort(escort.createdAt),
    rating: escort.rating || 0,
    totalReviews: escort.totalReviews || 0,
    location: {
      primaryDisplay,
      countyName,
      regionName,
      town,
      estate,
    },
    services,
  };
}
function createPaginationMetadata(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
): PaginationMetadata {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

// ============ BASE QUERY BUILDER ============
function buildBaseQuery(filters?: {
  county?: string;
  region?: string;
  minRating?: number;
  search?: string;
}) {
  const query: any = {
    isActive: true,
    gender: "girl",
    previewPhoto: { $exists: true, $ne: "" },
    images: { $exists: true, $ne: [] },
  };

  if (filters?.county) {
    query.county = new Types.ObjectId(filters.county);
  }

  if (filters?.region) {
    query.regions = new Types.ObjectId(filters.region);
  }

  if (filters?.minRating) {
    query.rating = { $gte: filters.minRating };
  }

  if (filters?.search) {
    query.$text = { $search: filters.search };
  }

  return query;
}

// ============ CACHED PAGINATED FETCHERS ============
// actions/get-home-escorts.ts - FIXED VERSION

export const getPaginatedFeaturedEscorts = cache(
  async (
    page: number = 1,
    limit: number = 8,
    filters?: Omit<SectionParams, "page" | "limit">,
  ): Promise<PaginatedSection<HomeEscort>> => {
    await connectToDB();

    const skip = (page - 1) * limit;

    const query = {
      ...buildBaseQuery(filters),
      isFeatured: true,
    };

    const [totalItems, escorts] = await Promise.all([
      Escort.countDocuments(query),
      Escort.find(query)
        .select(
          "name slug previewPhoto images age nationality about bustSize telephone whatsappPhone isVerified isFeatured rating totalReviews createdAt practices massage extraServices locations county primaryRegion regions",
        )
        .populate("countyDetails")
        .populate("primaryRegionDetails")
        .populate("regionsDetails")
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      // DON'T USE lean() - we need virtuals and methods
    ]);

    // Transform with virtuals properly included
    const items = escorts.map((escort) => {
      // Convert to object WITH virtuals
      const escortObj = escort.toObject({ virtuals: true });
      return transformToHomeEscort(escortObj);
    });

    return {
      items,
      pagination: createPaginationMetadata(totalItems, page, limit),
    };
  },
);
export const getPaginatedRecentEscorts = cache(
  async (
    page: number = 1,
    limit: number = 8,
    filters?: Omit<SectionParams, "page" | "limit">,
  ): Promise<PaginatedSection<HomeEscort>> => {
    await connectToDB();

    const skip = (page - 1) * limit;

    const query = buildBaseQuery(filters);

    const [totalItems, escorts] = await Promise.all([
      Escort.countDocuments(query),
      Escort.find(query)
        .select(
          "name slug previewPhoto images age nationality about bustSize telephone whatsappPhone isVerified isFeatured rating totalReviews createdAt practices massage extraServices locations county primaryRegion",
        )
        .populate("countyDetails")
        .populate("primaryRegionDetails")
        .populate("regionsDetails")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      items: escorts.map(transformToHomeEscort),
      pagination: createPaginationMetadata(totalItems, page, limit),
    };
  },
);

export const getPaginatedVerifiedEscorts = cache(
  async (
    page: number = 1,
    limit: number = 8,
    filters?: Omit<SectionParams, "page" | "limit">,
  ): Promise<PaginatedSection<HomeEscort>> => {
    await connectToDB();

    const skip = (page - 1) * limit;

    const query = {
      ...buildBaseQuery(filters),
      isVerified: true,
    };

    const [totalItems, escorts] = await Promise.all([
      Escort.countDocuments(query),
      Escort.find(query)
        .select(
          "name slug previewPhoto images age nationality about bustSize telephone whatsappPhone isVerified isFeatured rating totalReviews createdAt practices massage extraServices locations county primaryRegion",
        )
        .populate("countyDetails")
        .populate("primaryRegionDetails")
        .populate("regionsDetails")
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      items: escorts.map(transformToHomeEscort),
      pagination: createPaginationMetadata(totalItems, page, limit),
    };
  },
);

export const getPaginatedPopularEscorts = cache(
  async (
    page: number = 1,
    limit: number = 8,
    filters?: Omit<SectionParams, "page" | "limit">,
  ): Promise<PaginatedSection<HomeEscort>> => {
    await connectToDB();

    const skip = (page - 1) * limit;

    const query = {
      ...buildBaseQuery(filters),
      rating: { $gt: 0 },
    };

    const [totalItems, escorts] = await Promise.all([
      Escort.countDocuments(query),
      Escort.find(query)
        .select(
          "name slug previewPhoto images age nationality about bustSize telephone whatsappPhone isVerified isFeatured rating totalReviews totalViews createdAt practices massage extraServices locations county primaryRegion",
        )
        .populate("countyDetails")
        .populate("primaryRegionDetails")
        .populate("regionsDetails")
        .sort({ rating: -1, totalViews: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      items: escorts.map(transformToHomeEscort),
      pagination: createPaginationMetadata(totalItems, page, limit),
    };
  },
);
// ============ MAIN SERVER ACTION ============
export async function getHomeEscorts(
  featuredPage: number = 1,
  recentPage: number = 1,
  verifiedPage: number = 1,
  popularPage: number = 1,
): Promise<{
  featured: PaginatedSection<HomeEscort>;
  recent: PaginatedSection<HomeEscort>;
  verified: PaginatedSection<HomeEscort>;
  popular: PaginatedSection<HomeEscort>;
}> {
  try {
    await connectToDB();

    // Run all paginated queries in parallel
    const [featured, recent, verified, popular] = await Promise.all([
      getPaginatedFeaturedEscorts(featuredPage, 8),
      getPaginatedRecentEscorts(recentPage, 8),
      getPaginatedVerifiedEscorts(verifiedPage, 8),
      getPaginatedPopularEscorts(popularPage, 8),
    ]);

    return {
      featured,
      recent,
      verified,
      popular,
    };
  } catch (error) {
    console.error("Error fetching home escorts:", error);
    return {
      featured: {
        items: [],
        pagination: createPaginationMetadata(0, featuredPage, 8),
      },
      recent: {
        items: [],
        pagination: createPaginationMetadata(0, recentPage, 8),
      },
      verified: {
        items: [],
        pagination: createPaginationMetadata(0, verifiedPage, 8),
      },
      popular: {
        items: [],
        pagination: createPaginationMetadata(0, popularPage, 8),
      },
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
  sortBy?:
    | "newest"
    | "oldest"
    | "rating"
    | "popular"
    | "featured"
    | "price_low"
    | "price_high";
}

export interface FetchEscortsResponse {
  escorts: Array<{
    _id: string;
    name: string;
    username: string;
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
  success: boolean;
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
      case "featured":
        sortOptions = { isFeatured: -1, createdAt: -1 };
        break;
      case "price_low":
        sortOptions = { price: 1 };
        break;
      case "price_high":
        sortOptions = { price: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
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
          username: 1,
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
      success: true,
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
