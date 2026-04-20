// scripts/fix-invalid-ages.ts
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

async function fixInvalidAges() {
  console.log("🔍 Starting age fix migration...");

  const escortsRef = collection(db, "escorts");
  const snapshot = await getDocs(escortsRef);

  let fixed = 0;
  let skipped = 0;
  let invalidCount = 0;

  for (const document of snapshot.docs) {
    const data = document.data();
    const currentAge = data.age;

    if (!currentAge || currentAge === "") {
      skipped++;
      continue;
    }

    // Check if age is invalid
    const ageNum = parseInt(currentAge, 10);
    const isValid = !isNaN(ageNum) && ageNum >= 18 && ageNum <= 65;

    if (!isValid) {
      invalidCount++;
      console.log(`\n❌ Invalid age found for ${data.name}: "${currentAge}"`);

      // Try to extract a valid age from the string
      const match = currentAge.match(/\b([1-5][0-9]|6[0-5])\b/);
      if (match && parseInt(match[1]) >= 18 && parseInt(match[1]) <= 65) {
        const newAge = match[1];
        const newCategory =
          parseInt(newAge) < 25
            ? "Young"
            : parseInt(newAge) < 35
              ? "Adult"
              : "Mature";

        console.log(`  ✅ Fixing to: ${newAge} (${newCategory})`);
        await updateDoc(document.ref, {
          age: newAge,
          ageCategory: newCategory,
        });
        fixed++;
      } else {
        console.log(`  ⚠️ Could not extract valid age, setting to empty`);
        await updateDoc(document.ref, {
          age: "",
          ageCategory: "",
        });
        fixed++;
      }
    } else {
      skipped++;
    }
  }

  console.log("\n📊 Migration Summary:");
  console.log(`   Total escorts checked: ${snapshot.size}`);
  console.log(`   Invalid ages found: ${invalidCount}`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Skipped (already valid or empty): ${skipped}`);
}

// Run the migration
fixInvalidAges()
  .then(() => {
    console.log("\n✅ Age fix migration completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
