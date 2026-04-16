import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import regionsData from "../../../data/development/regions.json";

export interface IRegion {
  name: string;
  countyCode: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function POST(request: Request) {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Seeding only allowed in development environment" },
        { status: 403 },
      );
    }

    // Ensure data is an array
    const regions = Array.isArray(regionsData) ? regionsData : [regionsData];

    console.log(`📊 Processing ${regions.length} regions...`);

    let added = 0;
    let skipped = 0;
    let errors = 0;

    // Use Firestore batch with Admin SDK
    const batch = adminDb.batch();
    let batchCount = 0;
    const BATCH_LIMIT = 500;

    for (const region of regions) {
      try {
        // Validate required fields
        if (!region.name || !region.countyCode) {
          console.error(`❌ Invalid region data: missing name or countyCode`);
          errors++;
          continue;
        }

        // Check if region already exists using Admin SDK
        const existingQuery = await adminDb
          .collection("regions")
          .where("name", "==", region.name)
          .where("countyCode", "==", region.countyCode)
          .get();

        if (!existingQuery.empty) {
          console.log(
            `⚠️ Skipping ${region.name} (${region.countyCode}) - already exists`,
          );
          skipped++;
          continue;
        }

        // Create document reference with auto-generated ID
        const docRef = adminDb.collection("regions").doc();

        // Add to batch
        batch.set(docRef, {
          name: region.name,
          countyCode: region.countyCode,
          isActive: region.isActive !== undefined ? region.isActive : true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        batchCount++;
        added++;

        // Commit batch when limit reached
        if (batchCount >= BATCH_LIMIT) {
          await batch.commit();
          console.log(`📦 Committed batch of ${batchCount} regions`);
          batchCount = 0;
        }

        console.log(`✅ Added: ${region.name} (County: ${region.countyCode})`);
      } catch (error) {
        console.error(`❌ Error processing ${region.name}:`, error);
        errors++;
      }
    }

    // Commit remaining
    if (batchCount > 0) {
      await batch.commit();
      console.log(`📦 Committed final batch of ${batchCount} regions`);
    }

    return NextResponse.json({
      success: true,
      stats: {
        added,
        skipped,
        errors,
        total: regions.length,
      },
      message: `Successfully added ${added} regions to Firestore`,
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json(
      {
        error: "Failed to seed regions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
