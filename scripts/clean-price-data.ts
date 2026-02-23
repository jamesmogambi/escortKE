// scripts/clean-price-data.ts
import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";

async function cleanPriceData() {
  try {
    await connectToDB();
    console.log("Connected to DB");

    // Find all escorts with string prices that might have commas
    const escorts = await Escort.find({
      "rates.incall": { $type: "string" },
    });

    console.log(`Found ${escorts.length} escorts with string prices`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const escort of escorts) {
      try {
        let modified = false;

        // Process each rate
        escort.rates = escort.rates.map((rate: any) => {
          if (typeof rate.incall === "string" && rate.incall) {
            // Remove commas and convert to number
            const cleaned = rate.incall.replace(/,/g, "").trim();
            const num = parseFloat(cleaned);

            if (!isNaN(num)) {
              rate.incall = num.toString(); // Keep as string but without commas
              modified = true;
            }
          }

          if (
            rate.outcall &&
            typeof rate.outcall === "string" &&
            rate.outcall
          ) {
            const cleaned = rate.outcall.replace(/,/g, "").trim();
            const num = parseFloat(cleaned);

            if (!isNaN(num)) {
              rate.outcall = num.toString(); // Keep as string but without commas
              modified = true;
            }
          }

          return rate;
        });

        if (modified) {
          await escort.save();
          updatedCount++;
          console.log(
            `Updated escort: ${escort._id} (${escort.name || "No name"})`,
          );
        }
      } catch (error) {
        errorCount++;
        console.error(`Error processing escort ${escort._id}:`, error);
      }
    }

    console.log(`\nMigration complete:`);
    console.log(`- Updated: ${updatedCount} escorts`);
    console.log(`- Errors: ${errorCount} escorts`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

// Run the migration
cleanPriceData();
