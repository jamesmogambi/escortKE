// scripts/check-massage-types.ts
import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";

async function checkMassageTypes() {
  try {
    await connectToDB();

    // Check all distinct massage types
    const massageTypes = await Escort.distinct("massage", {
      massage: { $exists: true, $ne: [] },
    });

    console.log("All massage types in database:");
    console.log(massageTypes);

    // Check for "erotic" specifically
    const eroticEscorts = await Escort.countDocuments({
      massage: { $in: [/erotic/i] },
    });

    console.log(`\nEscorts with 'erotic' massage: ${eroticEscorts}`);

    // Get a sample of escorts with erotic massage
    const sample = await Escort.find({
      massage: { $in: [/erotic/i] },
    })
      .limit(5)
      .select("name massage");

    console.log("\nSample escorts with erotic massage:");
    sample.forEach((e) => {
      console.log(`- ${e.name || "Unknown"}: ${e.massage.join(", ")}`);
    });
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    process.exit(0);
  }
}

checkMassageTypes();
