import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Types
interface ICounty {
  id: string;
  name: string;
  code: string;
  description?: string;
  isPopular: boolean;
  population?: number;
  area?: string;
  capital?: string;
  createdAt: string;
  updatedAt: string;
}

interface Region {
  id: string;
  name: string;
  countyCode: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Location {
  region: string;
  town: string;
  estate: string;
  address: string;
  street: string;
  postalCode: string;
  isActive: boolean;
  notes: string;
  _id?: string;
}

export async function POST(request: Request) {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development environment" },
        { status: 403 },
      );
    }

    console.log("🚀 Starting escorts update process...");

    // Step 1: Fetch all counties
    const countiesSnapshot = await adminDb.collection("counties").get();
    const counties = new Map<string, ICounty>(); // Map by code
    const countiesById = new Map<string, ICounty>(); // Map by ID

    countiesSnapshot.docs.forEach((doc) => {
      const county = { id: doc.id, ...doc.data() } as ICounty;
      counties.set(county.code, county);
      countiesById.set(doc.id, county);
    });

    console.log(`✅ Loaded ${counties.size} counties`);

    // Step 2: Fetch all regions
    const regionsSnapshot = await adminDb.collection("regions").get();
    const regions = new Map<string, Region>(); // Map by ID
    const regionsByName = new Map<string, Region>(); // Map by name

    regionsSnapshot.docs.forEach((doc) => {
      const region = { id: doc.id, ...doc.data() } as Region;
      regions.set(doc.id, region);
      regionsByName.set(region.name, region);
    });

    console.log(`✅ Loaded ${regions.size} regions`);

    // Step 3: Fetch all escorts
    const escortsSnapshot = await adminDb.collection("escorts").get();
    const totalEscorts = escortsSnapshot.size;
    console.log(`📊 Processing ${totalEscorts} escorts...`);

    let updatedCount = 0;
    let errorCount = 0;
    let batch = adminDb.batch();
    let batchCount = 0;
    const BATCH_LIMIT = 500;

    for (const doc of escortsSnapshot.docs) {
      try {
        const data = doc.data();
        const updates: any = {};
        let needsUpdate = false;

        // Update county field from code to name
        if (data.countyCode && counties.has(data.countyCode)) {
          const county = counties.get(data.countyCode);
          if (county && data.county !== county.name) {
            updates.county = county.name;
            needsUpdate = true;
            console.log(
              `  📍 Escort ${data.name}: County ${data.countyCode} -> ${county.name}`,
            );
          }
        } else if (data.countyCode && !counties.has(data.countyCode)) {
          console.warn(
            `  ⚠️ County code ${data.countyCode} not found for escort ${data.name}`,
          );
        }

        // Update locations array - set region and street to be the same value
        if (data.locations && Array.isArray(data.locations)) {
          const updatedLocations = data.locations.map((location: Location) => {
            const updatedLocation = { ...location };

            // Get the region name from region ID if needed
            let regionName = location.region;
            if (location.region && regions.has(location.region)) {
              const region = regions.get(location.region);
              if (region) {
                regionName = region.name;
              }
            } else if (location.region && regionsByName.has(location.region)) {
              // Already a name
              regionName = location.region;
            }

            // Set region to the region name
            if (regionName && updatedLocation.region !== regionName) {
              updatedLocation.region = regionName;
              console.log(
                `    🏙️ Location region: ${location.region} -> ${regionName}`,
              );
            }

            // IMPORTANT: Set street to be the SAME as region
            if (regionName && updatedLocation.street !== regionName) {
              updatedLocation.street = regionName;
              console.log(
                `    🛣️ Setting street to match region: ${regionName}`,
              );
            }

            return updatedLocation;
          });

          // Check if any location was updated
          const hasLocationChanges =
            JSON.stringify(data.locations) !== JSON.stringify(updatedLocations);
          if (hasLocationChanges) {
            updates.locations = updatedLocations;
            needsUpdate = true;
          }
        }

        // Update primaryRegion from ID to name
        if (data.primaryRegion) {
          let primaryRegionName = data.primaryRegion;
          if (regions.has(data.primaryRegion)) {
            const region = regions.get(data.primaryRegion);
            if (region) {
              primaryRegionName = region.name;
            }
          } else if (regionsByName.has(data.primaryRegion)) {
            primaryRegionName = data.primaryRegion;
          }

          if (data.primaryRegion !== primaryRegionName) {
            updates.primaryRegion = primaryRegionName;
            needsUpdate = true;
            console.log(
              `  🎯 Primary region: ${data.primaryRegion} -> ${primaryRegionName}`,
            );
          }
        }

        // Update regions array from IDs to names
        if (
          data.regions &&
          Array.isArray(data.regions) &&
          data.regions.length > 0
        ) {
          const updatedRegions = data.regions.map((regionId: string) => {
            if (regions.has(regionId)) {
              const region = regions.get(regionId);
              return region ? region.name : regionId;
            } else if (regionsByName.has(regionId)) {
              return regionId;
            }
            return regionId;
          });

          const hasRegionChanges =
            JSON.stringify(data.regions) !== JSON.stringify(updatedRegions);
          if (hasRegionChanges) {
            updates.regions = updatedRegions;
            needsUpdate = true;
            console.log(`  📌 Regions updated for escort ${data.name}`);
          }
        }

        // If updates are needed, add to batch
        if (needsUpdate) {
          updates.updatedAt = FieldValue.serverTimestamp();
          const docRef = adminDb.collection("escorts").doc(doc.id);
          batch.update(docRef, updates);
          batchCount++;
          updatedCount++;

          // Commit batch when limit reached
          if (batchCount >= BATCH_LIMIT) {
            await batch.commit();
            console.log(`📦 Committed batch of ${batchCount} escorts`);
            batch = adminDb.batch();
            batchCount = 0;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing escort ${doc.id}:`, error);
        errorCount++;
      }
    }

    // Commit remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`📦 Committed final batch of ${batchCount} escorts`);
    }

    console.log(`
    ✅ Update completed!
    📊 Total escorts: ${totalEscorts}
    🔄 Updated: ${updatedCount}
    ❌ Errors: ${errorCount}
    `);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} escorts`,
      stats: {
        total: totalEscorts,
        updated: updatedCount,
        errors: errorCount,
      },
    });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update escorts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint to preview updates without applying
export async function GET(request: Request) {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development environment" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch counties
    const countiesSnapshot = await adminDb.collection("counties").get();
    const counties = new Map<string, ICounty>();
    const countiesById = new Map<string, ICounty>();

    countiesSnapshot.docs.forEach((doc) => {
      const county = { id: doc.id, ...doc.data() } as ICounty;
      counties.set(county.code, county);
      countiesById.set(doc.id, county);
    });

    // Fetch regions
    const regionsSnapshot = await adminDb.collection("regions").get();
    const regions = new Map<string, Region>();
    const regionsByName = new Map<string, Region>();

    regionsSnapshot.docs.forEach((doc) => {
      const region = { id: doc.id, ...doc.data() } as Region;
      regions.set(doc.id, region);
      regionsByName.set(region.name, region);
    });

    // Fetch escorts
    const escortsSnapshot = await adminDb
      .collection("escorts")
      .limit(limit)
      .get();
    const previews: any[] = [];

    for (const doc of escortsSnapshot.docs) {
      const data = doc.data();

      // Get region name for primary region
      let primaryRegionName = data.primaryRegion;
      if (regions.has(data.primaryRegion)) {
        primaryRegionName = regions.get(data.primaryRegion)?.name;
      }

      const preview: any = {
        id: doc.id,
        name: data.name,
        currentCounty: data.county,
        currentCountyCode: data.countyCode,
        proposedCounty: counties.get(data.countyCode)?.name || data.county,
        currentPrimaryRegion: data.primaryRegion,
        proposedPrimaryRegion: primaryRegionName,
        locations: data.locations?.map((loc: Location) => {
          // Get region name
          let regionName: any = loc.region;
          if (regions.has(loc.region)) {
            regionName = regions.get(loc.region)?.name;
          } else if (regionsByName.has(loc.region)) {
            regionName = loc.region;
          }

          return {
            town: loc.town,
            estate: loc.estate,
            currentRegion: loc.region,
            proposedRegion: regionName,
            currentStreet: loc.street,
            proposedStreet: regionName, // Street will be set to same as region
            willBeUpdated:
              loc.region !== regionName || loc.street !== regionName,
          };
        }),
      };

      previews.push(preview);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalCounties: counties.size,
        totalRegions: regions.size,
        previewCount: previews.length,
      },
      previews,
      message:
        "Use POST method to apply these updates. This will set region and street to the same value in locations array.",
    });
  } catch (error) {
    console.error("Preview failed:", error);
    return NextResponse.json(
      {
        error: "Failed to preview updates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
