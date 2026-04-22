// app/api/regions/migrate/route.ts (updated)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { slugify } from "@/lib/utils";

const COUNTY_MAP: Record<
  string,
  { code: string; name: string; numericCode: string }
> = {
  "001": { code: "mombasa", name: "Mombasa", numericCode: "001" },
  "002": { code: "kwale", name: "Kwale", numericCode: "002" },
  "003": { code: "kilifi", name: "Kilifi", numericCode: "003" },
  "004": { code: "tana-river", name: "Tana River", numericCode: "004" },
  "005": { code: "lamu", name: "Lamu", numericCode: "005" },
  "006": { code: "taita-taveta", name: "Taita Taveta", numericCode: "006" },
  "007": { code: "garissa", name: "Garissa", numericCode: "007" },
  "008": { code: "wajir", name: "Wajir", numericCode: "008" },
  "009": { code: "mandera", name: "Mandera", numericCode: "009" },
  "010": { code: "marsabit", name: "Marsabit", numericCode: "010" },
  "011": { code: "isiolo", name: "Isiolo", numericCode: "011" },
  "012": { code: "meru", name: "Meru", numericCode: "012" },
  "013": { code: "tharaka-nithi", name: "Tharaka Nithi", numericCode: "013" },
  "014": { code: "embu", name: "Embu", numericCode: "014" },
  "015": { code: "kitui", name: "Kitui", numericCode: "015" },
  "016": { code: "machakos", name: "Machakos", numericCode: "016" },
  "017": { code: "makueni", name: "Makueni", numericCode: "017" },
  "018": { code: "nyandarua", name: "Nyandarua", numericCode: "018" },
  "019": { code: "nyeri", name: "Nyeri", numericCode: "019" },
  "020": { code: "kirinyaga", name: "Kirinyaga", numericCode: "020" },
  "021": { code: "muranga", name: "Murang'a", numericCode: "021" },
  "022": { code: "kiambu", name: "Kiambu", numericCode: "022" },
  "023": { code: "turkana", name: "Turkana", numericCode: "023" },
  "024": { code: "west-pokot", name: "West Pokot", numericCode: "024" },
  "025": { code: "samburu", name: "Samburu", numericCode: "025" },
  "026": { code: "trans-nzoia", name: "Trans Nzoia", numericCode: "026" },
  "027": { code: "uasin-gishu", name: "Uasin Gishu", numericCode: "027" },
  "028": {
    code: "elgeyo-marakwet",
    name: "Elgeyo Marakwet",
    numericCode: "028",
  },
  "029": { code: "nandi", name: "Nandi", numericCode: "029" },
  "030": { code: "baringo", name: "Baringo", numericCode: "030" },
  "031": { code: "laikipia", name: "Laikipia", numericCode: "031" },
  "032": { code: "nakuru", name: "Nakuru", numericCode: "032" },
  "033": { code: "narok", name: "Narok", numericCode: "033" },
  "034": { code: "kajiado", name: "Kajiado", numericCode: "034" },
  "035": { code: "kericho", name: "Kericho", numericCode: "035" },
  "036": { code: "bomet", name: "Bomet", numericCode: "036" },
  "037": { code: "kakamega", name: "Kakamega", numericCode: "037" },
  "038": { code: "vihiga", name: "Vihiga", numericCode: "038" },
  "039": { code: "bungoma", name: "Bungoma", numericCode: "039" },
  "040": { code: "busia", name: "Busia", numericCode: "040" },
  "041": { code: "siaya", name: "Siaya", numericCode: "041" },
  "042": { code: "kisumu", name: "Kisumu", numericCode: "042" },
  "043": { code: "homa-bay", name: "Homa Bay", numericCode: "043" },
  "044": { code: "migori", name: "Migori", numericCode: "044" },
  "045": { code: "kisii", name: "Kisii", numericCode: "045" },
  "046": { code: "nyamira", name: "Nyamira", numericCode: "046" },
  "047": { code: "nairobi", name: "Nairobi", numericCode: "047" },
};

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting region migration with cleanup...");

    const regionsRef = collection(db, "regions");
    const snapshot = await getDocs(regionsRef);

    let converted = 0;
    let deleted = 0;
    let skipped = 0;

    for (const document of snapshot.docs) {
      const data = document.data();
      const docId = document.id;

      // Skip if already in new format
      if (
        data.county &&
        data.countyCode &&
        typeof data.countyCode === "string" &&
        !data.countyCode.match(/^\d+$/)
      ) {
        skipped++;
        continue;
      }

      const regionName = data.name;
      if (!regionName) {
        skipped++;
        continue;
      }

      const numericCountyCode = data.countyCode;
      const countyInfo = COUNTY_MAP[numericCountyCode];

      if (!countyInfo) {
        console.log(
          `⚠️ Unknown county code: ${numericCountyCode} for ${regionName}, skipping`,
        );
        skipped++;
        continue;
      }

      const regionSlug = slugify(regionName);
      const newId = `${countyInfo.code}_${regionSlug}`;

      // Check if new region already exists
      const newDocRef = doc(db, "regions", newId);
      const newDocSnap = await getDocs(collection(db, "regions"));
      let exists = false;
      for (const doc of newDocSnap.docs) {
        if (doc.id === newId) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        // Create new standard region
        const standardRegion = {
          name: regionName,
          countyCode: countyInfo.code,
          county: countyInfo.name,
          countyNumericCode: numericCountyCode,
          countyId: countyInfo.code,
          isActive: data.isActive !== false,
          createdAt: data.createdAt || new Date(),
          updatedAt: new Date(),
          town: regionName,
          estate: "",
          address: "",
          street: "",
          postalCode: "",
          notes: `Migrated from original format. Original ID: ${docId}`,
        };

        await setDoc(newDocRef, standardRegion);
        converted++;
        console.log(`✅ Converted: ${regionName} (${docId} -> ${newId})`);
      }

      // Delete the old document
      await deleteDoc(document.ref);
      deleted++;
      console.log(`🗑️ Deleted old: ${docId}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Converted to new format: ${converted}`);
    console.log(`🗑️ Deleted old duplicates: ${deleted}`);
    console.log(`⏭️ Skipped (already new format): ${skipped}`);
    console.log(`📁 Total processed: ${snapshot.size}`);
    console.log("=".repeat(50));

    return NextResponse.json({
      success: true,
      message: "Migration completed with cleanup",
      stats: {
        converted,
        deleted,
        skipped,
        total: snapshot.size,
      },
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Preview duplicates without deleting
export async function GET(request: NextRequest) {
  try {
    const regionsRef = collection(db, "regions");
    const snapshot = await getDocs(regionsRef);

    const oldFormat: any[] = [];
    const newFormat: any[] = [];
    const duplicates: any[] = [];

    for (const document of snapshot.docs) {
      const data = document.data();
      const isNewFormat =
        data.county &&
        typeof data.countyCode === "string" &&
        !data.countyCode.match(/^\d+$/);

      if (isNewFormat) {
        newFormat.push({
          id: document.id,
          name: data.name,
          county: data.county,
        });
      } else {
        oldFormat.push({
          id: document.id,
          name: data.name,
          countyCode: data.countyCode,
        });
      }
    }

    return NextResponse.json({
      total: snapshot.size,
      newFormatCount: newFormat.length,
      oldFormatCount: oldFormat.length,
      oldFormatSamples: oldFormat.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
