"use server";

import { connectToDB, serializeMongoDocs } from "@/lib/mongoose";
import { County } from "@/models/County";
import { Region } from "@/models/Region";
import { Town } from "@/models/Town";
import mongoose from "mongoose";

export async function getRegions() {
  try {
    await connectToDB();
    const res = await Region.find({}).lean();
    const regions = serializeMongoDocs(res);
    return regions;
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    throw new Error("Could not load regions");
  }
}

export async function getTowns() {
  try {
    await connectToDB();

    const res = await Town.find({})
      .populate({
        path: "region",
        select: "name country", // only include region name and country
      })
      .lean();
    const towns = serializeMongoDocs(res);
    return towns;
  } catch (error) {
    console.error("Failed to fetch towns:", error);
    throw new Error("Could not load towns");
  }
}

// utils/locationHelpers.ts
export interface LocationIds {
  countyId: mongoose.Types.ObjectId | null;
  countyCode: string | null;
  regionId: mongoose.Types.ObjectId | null;
}

export async function getLocationIds(
  countyName: string,
  regionName: string,
  autoCreateRegion: boolean = true, // Default to auto-create regions
): Promise<LocationIds> {
  try {
    console.log(
      `🔍 Looking for location: County="${countyName}", Region="${regionName}"`,
    );

    // 1. Find COUNTY (Do NOT auto-create)
    const county = await County.findOne({
      $or: [
        { name: new RegExp(`^${countyName}$`, "i") },
        { code: countyName },
        { name: { $regex: countyName, $options: "i" } },
      ],
    });

    if (!county) {
      console.warn(
        `❌ County not found: "${countyName}". County will NOT be created automatically.`,
      );
      return { countyId: null, countyCode: null, regionId: null };
    }

    console.log(
      `✅ Found county: ${county.name} (ID: ${county._id}, Code: ${county.code})`,
    );

    // 2. Find or CREATE REGION
    let region = await Region.findOne({
      countyCode: county.code,
      name: new RegExp(`^${regionName}$`, "i"),
    });

    if (!region) {
      console.warn(
        `⚠️ Region not found: "${regionName}" in county "${county.name}"`,
      );

      if (autoCreateRegion) {
        console.log(
          `🔄 Auto-creating region: "${regionName}" for county "${county.name}"`,
        );

        try {
          // Create the new region
          region = await Region.create({
            name: regionName,
            countyCode: county.code,
            isActive: true,
          });

          console.log(
            `✅ Created new region: ${region.name} (ID: ${region._id})`,
          );
        } catch (createError: any) {
          // Handle duplicate key error (if region was created concurrently)
          if (createError.code === 11000) {
            console.log(`⚠️ Region already exists, fetching it...`);
            region = await Region.findOne({
              countyCode: county.code,
              name: new RegExp(`^${regionName}$`, "i"),
            });
          } else {
            console.error(`❌ Failed to create region:`, createError);
            return {
              countyId: county._id as mongoose.Types.ObjectId,
              countyCode: county.code || null,
              regionId: null,
            };
          }
        }
      } else {
        console.log(
          `⏭️ Region not created (autoCreateRegion=${autoCreateRegion})`,
        );
        return {
          countyId: county._id as mongoose.Types.ObjectId,
          countyCode: county.code || null,
          regionId: null,
        };
      }
    } else {
      console.log(
        `✅ Found existing region: ${region.name} (ID: ${region._id})`,
      );
    }

    return {
      countyId: county._id as mongoose.Types.ObjectId,
      countyCode: county.code || null,
      regionId: (region?._id as mongoose.Types.ObjectId) || null,
    };
  } catch (error) {
    console.error("❌ Error getting location IDs:", error);
    return { countyId: null, countyCode: null, regionId: null };
  }
}

// Alternative function with more flexible region name matching
export async function getLocationIdsWithFuzzyMatch(
  countyName: string,
  regionName: string,
  autoCreateRegion: boolean = true,
): Promise<LocationIds> {
  try {
    // Clean and normalize input
    const cleanedCountyName = countyName.trim();
    const cleanedRegionName = regionName.trim();

    // 1. Find COUNTY
    const county = await County.findOne({
      $or: [
        { name: { $regex: `^${cleanedCountyName}$`, $options: "i" } },
        { code: cleanedCountyName },
        // Try partial match as last resort
        { name: { $regex: cleanedCountyName, $options: "i" } },
      ],
    });

    if (!county) {
      console.warn(
        `❌ County not found: "${cleanedCountyName}". Skipping location.`,
      );
      return { countyId: null, countyCode: null, regionId: null };
    }

    // 2. Try multiple strategies to find region
    let region = null;

    // Strategy 1: Exact match (case-insensitive)
    region = await Region.findOne({
      countyCode: county.code,
      name: { $regex: `^${cleanedRegionName}$`, $options: "i" },
    });

    // Strategy 2: Remove common prefixes/suffixes and try again
    if (!region) {
      const normalizedRegionName = cleanedRegionName
        .replace(/^(area of |around |near |in )/i, "")
        .replace(/( area| district| estate| ward)$/i, "")
        .trim();

      if (normalizedRegionName !== cleanedRegionName) {
        region = await Region.findOne({
          countyCode: county.code,
          name: { $regex: `^${normalizedRegionName}$`, $options: "i" },
        });
      }
    }

    // Strategy 3: Check if region contains the name (for sub-regions)
    if (!region) {
      region = await Region.findOne({
        countyCode: county.code,
        name: { $regex: cleanedRegionName, $options: "i" },
      });
    }

    // 3. Create region if not found and autoCreateRegion is true
    if (!region && autoCreateRegion) {
      console.log(
        `🔄 Creating new region: "${cleanedRegionName}" in ${county.name}`,
      );

      region = await Region.create({
        name: cleanedRegionName,
        countyCode: county.code,
        isActive: true,
      });

      console.log(`✅ Created region: ${region.name}`);
    }

    return {
      countyId: county._id as mongoose.Types.ObjectId,
      countyCode: county.code || null,
      regionId: (region?._id as mongoose.Types.ObjectId) || null,
    };
  } catch (error) {
    console.error("Error in getLocationIdsWithFuzzyMatch:", error);
    return { countyId: null, countyCode: null, regionId: null };
  }
}

// Helper to check if county exists
export async function checkCountyExists(countyName: string): Promise<boolean> {
  const county = await County.findOne({
    name: new RegExp(`^${countyName}$`, "i"),
  });
  return !!county;
}

// Get all available counties for validation
export async function getAvailableCounties(): Promise<
  Array<{ name: string; code: string }>
> {
  const counties = await County.find({}).select("name code").lean();
  return counties.map((c) => ({
    name: c.name,
    code: c.code || "",
  }));
}

// Get regions for a specific county
export async function getRegionsForCounty(
  countyCode: string,
): Promise<string[]> {
  const regions = await Region.find({
    countyCode,
    isActive: true,
  })
    .select("name")
    .lean();

  return regions.map((r) => r.name);
}
