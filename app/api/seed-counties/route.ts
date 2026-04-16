import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Your Firebase client config
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import countiesData from "../../../data/development/counties.json";

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Seeding only allowed in development" },
        { status: 403 },
      );
    }

    // Convert to array and process
    const countiesArray = Array.isArray(countiesData)
      ? countiesData
      : [countiesData];

    console.log(`Processing ${countiesArray.length} counties...`);

    let added = 0;
    let skipped = 0;

    for (const county of countiesArray) {
      // Check if exists
      const existingQuery = query(
        collection(db, "counties"),
        where("code", "==", county.code),
      );
      const existingDocs = await getDocs(existingQuery);

      if (existingDocs.empty) {
        await addDoc(collection(db, "counties"), {
          ...county,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        added++;
        console.log(`✅ Added: ${county.name}`);
      } else {
        skipped++;
        console.log(`⚠️ Skipped: ${county.name} (already exists)`);
      }
    }

    return NextResponse.json({
      success: true,
      added,
      skipped,
      total: countiesArray.length,
    });
  } catch (error) {
    console.error("Error seeding counties:", error);
    return NextResponse.json(
      { error: "Failed to seed counties" },
      { status: 500 },
    );
  }
}
