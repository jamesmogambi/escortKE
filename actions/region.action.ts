// app/actions/county.actions.ts
"use server";

import { connectToDB, serializeMongoDocs } from "@/lib/mongoose";
import { County } from "@/models/County";
import { Region } from "@/models/Region";

// Get all counties
export async function getAllCounties() {
  try {
    await connectToDB();

    const counties = await County.find({})
      .sort({ name: 1 })
      .select("name code description isPopular population area capital")
      .lean();

    return {
      success: true,
      data: serializeMongoDocs(counties),
      message: "Counties fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching counties:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch counties",
    };
  }
}

// Get popular counties (first 20)
export async function getPopularCounties() {
  try {
    await connectToDB();

    const popularCounties = await County.find({})
      .sort({ name: 1 })
      .limit(20)
      .select("name code")
      .lean();

    return {
      success: true,
      data: popularCounties,
      message: "Popular counties fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching popular counties:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch popular counties",
    };
  }
}

// Get county by code
export async function getCountyByCode(code: string) {
  try {
    await connectToDB();

    const county = await County.findOne({ code }).select("name code").lean();

    if (!county) {
      return {
        success: false,
        data: null,
        message: "County not found",
      };
    }

    return {
      success: true,
      data: county,
      message: "County fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching county:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch county",
    };
  }
}

// Search counties by name
export async function searchCounties(query: string) {
  try {
    await connectToDB();

    const counties = await County.find({
      name: { $regex: query, $options: "i" },
    })
      .sort({ name: 1 })
      .limit(10)
      .select("name code")
      .lean();

    return {
      success: true,
      data: serializeMongoDocs(counties),
      message: "Counties search completed",
    };
  } catch (error: any) {
    console.error("Error searching counties:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to search counties",
    };
  }
}

// Get counties for dropdown (formatted)
export async function getCountiesForDropdown() {
  try {
    await connectToDB();

    const counties = await County.find({})
      .sort({ name: 1 })
      .select("name code")
      .lean();

    // Format for dropdown/select components
    const formattedCounties = counties.map((county) => ({
      value: county.code || "",
      label: county.name,
      ...county,
    }));

    return {
      success: true,
      data: formattedCounties,
      message: "Counties formatted for dropdown",
    };
  } catch (error: any) {
    console.error("Error formatting counties:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to format counties",
    };
  }
}

// Get all locations/areas for a specific county
export async function getRegionsByCounty(countyCode: string) {
  try {
    await connectToDB();

    const locations = await Region.find({ countyCode })
      .sort({ name: 1 }) // Popular first, then alphabetical
      .select("name countyCode type description isPopular")
      .lean();

    // Get county name for context
    const county = await County.findOne({ code: countyCode })
      .select("name")
      .lean();

    return {
      success: true,
      data: {
        county: county || null,
        regions: locations,
        count: locations.length,
      },
      message: `Found ${locations.length} locations in ${county?.name || "this county"}`,
    };
  } catch (error: any) {
    console.error("Error fetching locations:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch locations",
    };
  }
}

// Get all regions
export async function getAllRegions() {
  try {
    await connectToDB();

    const regions = await Region.find({})
      .sort({ countyCode: 1, name: 1 })
      .select("name countyCode ")
      .lean();

    return {
      success: true,
      data: serializeMongoDocs(regions),
      message: "Regions fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching regions:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch regions",
    };
  }
}

// Get popular counties with optional limit
export async function getPopularCountiesLimited(limit?: number) {
  try {
    await connectToDB();

    const query = County.find({ isPopular: true })
      .sort({ name: 1 })
      .select("name code description isPopular population area capital");

    if (limit && limit > 0) {
      query.limit(limit);
    }

    const popularCounties = await query.lean();

    // Convert ObjectId to string for client-side compatibility
    const serializedCounties = popularCounties.map((county) => ({
      ...county,
      _id: county._id.toString(),
    }));

    return {
      success: true,
      data: serializedCounties,
      count: serializedCounties.length,
      message: "Popular counties fetched successfully",
    };
  } catch (error: any) {
    console.error("Error fetching popular counties:", error);
    return {
      success: false,
      data: [],
      count: 0,
      message: error.message || "Failed to fetch popular counties",
    };
  }
}
