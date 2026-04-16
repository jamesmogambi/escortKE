import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import lookupData from "./lookup-data.json";

export async function POST(request: Request) {
  try {
    // Security check - only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Seeding only allowed in development environment" },
        { status: 403 },
      );
    }

    const results: any = {};
    let totalAdded = 0;
    let totalSkipped = 0;

    // Process each collection
    for (const [collectionName, items] of Object.entries(lookupData)) {
      console.log(`📊 Processing ${collectionName}...`);

      let added = 0;
      let skipped = 0;

      // Handle different data structures
      let itemsArray: any[] = [];

      if (Array.isArray(items)) {
        itemsArray = items;
      } else if (typeof items === "object" && items !== null) {
        itemsArray = Object.values(items);
      }

      for (const item of itemsArray) {
        try {
          // Check if item already exists
          let existingQuery;

          if (item.id) {
            // For items with custom IDs (practices, bdsm, massage)
            existingQuery = await adminDb
              .collection(collectionName)
              .where("id", "==", item.id)
              .get();
          } else {
            // For items without IDs (age, breast, etc.)
            existingQuery = await adminDb
              .collection(collectionName)
              .where("name", "==", item.name)
              .get();
          }

          if (!existingQuery.empty) {
            console.log(`⚠️ Skipping ${item.name || item.id} - already exists`);
            skipped++;
            continue;
          }

          // Add document
          const docData = {
            ...item,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await adminDb.collection(collectionName).add(docData);
          console.log(
            `✅ Added: ${item.name || item.id || "item"} to ${collectionName}`,
          );
          added++;
        } catch (error) {
          console.error(`❌ Error adding item to ${collectionName}:`, error);
        }
      }

      results[collectionName] = { added, skipped };
      totalAdded += added;
      totalSkipped += skipped;
    }

    return NextResponse.json({
      success: true,
      message: "Lookup data seeded successfully",
      stats: {
        totalAdded,
        totalSkipped,
        collections: results,
      },
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json(
      {
        error: "Failed to seed lookup data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
