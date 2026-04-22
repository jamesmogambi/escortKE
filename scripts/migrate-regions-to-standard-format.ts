// scripts/migrate-regions-to-standard-format.ts
import * as admin from "firebase-admin";
import { slugify } from "../lib/utils";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // Try to use service account key
  try {
    const serviceAccount = require("../service-account-key.json");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized with service account");
  } catch (error) {
    // Fallback to default credentials (for local development with emulators)
    admin.initializeApp({
      projectId:
        process.env.NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID || "your-project-id",
    });
    console.log("⚠️ Firebase Admin initialized with default credentials");
  }
}

const db = admin.firestore();

// Mapping of numeric county codes to county names (Kenya counties)
const COUNTY_MAP: Record<string, string> = {
  "001": "Mombasa",
  "002": "Kwale",
  "003": "Kilifi",
  "004": "Tana River",
  "005": "Lamu",
  "006": "Taita Taveta",
  "007": "Garissa",
  "008": "Wajir",
  "009": "Mandera",
  "010": "Marsabit",
  "011": "Isiolo",
  "012": "Meru",
  "013": "Tharaka Nithi",
  "014": "Embu",
  "015": "Kitui",
  "016": "Machakos",
  "017": "Makueni",
  "018": "Nyandarua",
  "019": "Nyeri",
  "020": "Kirinyaga",
  "021": "Murang'a",
  "022": "Kiambu",
  "023": "Turkana",
  "024": "West Pokot",
  "025": "Samburu",
  "026": "Trans Nzoia",
  "027": "Uasin Gishu",
  "028": "Elgeyo Marakwet",
  "029": "Nandi",
  "030": "Baringo",
  "031": "Laikipia",
  "032": "Nakuru",
  "033": "Narok",
  "034": "Kajiado",
  "035": "Kericho",
  "036": "Bomet",
  "037": "Kakamega",
  "038": "Vihiga",
  "039": "Bungoma",
  "040": "Busia",
  "041": "Siaya",
  "042": "Kisumu",
  "043": "Homa Bay",
  "044": "Migori",
  "045": "Kisii",
  "046": "Nyamira",
  "047": "Nairobi",
};

interface OldRegion {
  name?: string;
  countyCode?: string;
  isActive?: boolean;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

async function migrateRegionsToStandardFormat() {
  console.log("🚀 Starting region migration to standard format...");

  const regionsRef = db.collection("regions");
  const snapshot = await regionsRef.get();

  let updated = 0;
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const document of snapshot.docs) {
    try {
      const data = document.data() as OldRegion;
      const docId = document.id;

      // Check if already in new standard format
      if (
        data.countyCode &&
        typeof data.countyCode === "string" &&
        !data.countyCode.match(/^\d+$/)
      ) {
        console.log(`✅ Already in standard format: ${data.name} (${docId})`);
        skipped++;
        continue;
      }

      console.log(`\n📝 Processing region: ${docId}`);
      console.log(`   Current data:`, JSON.stringify(data, null, 2));

      // Get region name
      const regionName = data.name;
      if (!regionName) {
        console.log(`   ⚠️ Skipping - no name found`);
        skipped++;
        continue;
      }

      // Get numeric county code
      const numericCountyCode = data.countyCode;

      // Determine county name from numeric code
      let countyName = "";
      if (numericCountyCode && COUNTY_MAP[numericCountyCode]) {
        countyName = COUNTY_MAP[numericCountyCode];
      } else {
        // Try to derive from document ID
        console.log(
          `   ⚠️ Unknown county code: ${numericCountyCode}, trying to derive...`,
        );
        const idParts = docId.split("_");
        if (idParts.length > 0) {
          const possibleCounty = idParts[0];
          for (const [code, name] of Object.entries(COUNTY_MAP)) {
            if (name.toLowerCase() === possibleCounty.toLowerCase()) {
              countyName = name;
              break;
            }
          }
        }
      }

      if (!countyName) {
        console.log(
          `   ❌ Cannot determine county for ${regionName}, skipping`,
        );
        errors++;
        continue;
      }

      const countySlug = slugify(countyName);
      const regionSlug = slugify(regionName);
      const newId = `${countySlug}_${regionSlug}`;

      // Create standard format
      const standardRegion = {
        name: regionName,
        countyCode: countySlug,
        county: countyName,
        countyNumericCode: numericCountyCode || "",
        countyId: countySlug,
        isActive: data.isActive !== false,
        createdAt: data.createdAt || admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        town: regionName,
        estate: "",
        address: "",
        street: "",
        postalCode: "",
        notes: `Migrated from original format. Original ID: ${docId}, Original county code: ${numericCountyCode}`,
      };

      console.log(`   New format:`, JSON.stringify(standardRegion, null, 2));
      console.log(`   Old ID: ${docId} -> New ID: ${newId}`);
      console.log(`   County: ${countyName} (Code: ${numericCountyCode})`);

      // Create or update the standard document
      const newDocRef = db.collection("regions").doc(newId);
      await newDocRef.set(standardRegion, { merge: true });
      created++;

      console.log(`   ✅ Created/Updated: ${newId}`);
    } catch (error) {
      console.error(`   ❌ Error processing ${document.id}:`, error);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Created/Updated standard regions: ${created}`);
  console.log(`👍 Already in standard format: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📁 Total processed: ${snapshot.size}`);
  console.log("=".repeat(50));
  console.log(
    "\n💡 Old documents were kept for safety. Verify the new regions first, then delete old ones.",
  );
}

// Run the migration
migrateRegionsToStandardFormat()
  .then(() => {
    console.log("\n✅ Migration completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
