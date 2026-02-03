// MongoDB Shell script to update massage types for escorts
// Run in MongoDB Atlas Shell: load("mongodb-queries/update-massage-types.js")

/**
 * Updates the first N escorts with random erotic massage types
 * @param {number} limit - Number of escorts to update (default: 15)
 */
function updateEscortsMassageTypes(limit = 15) {
  print("Starting to update escorts with massage types...");

  const allMassages = [
    "Erotic",
    "Sensual",
    "Tantric",
    "Nuru",
    "Body to Body",
    "Happy Ending",
  ];
  const escorts = db.escorts.find({}).limit(limit).toArray();

  let updatedCount = 0;

  escorts.forEach((escort) => {
    // Shuffle array and pick 2-3 random massages
    const shuffled = [...allMassages].sort(() => 0.5 - Math.random());
    const selectedMassages = shuffled.slice(
      0,
      2 + Math.floor(Math.random() * 2),
    );

    const result = db.escorts.updateOne(
      { _id: escort._id },
      {
        $set: {
          massage: selectedMassages,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount > 0) {
      updatedCount++;
      print(
        `Updated escort: ${escort.name || escort._id} with massages: ${selectedMassages.join(", ")}`,
      );
    }
  });

  print(
    `\n✅ Successfully updated ${updatedCount} out of ${escorts.length} escorts`,
  );
  return { updated: updatedCount, total: escorts.length };
}

// Export for use in shell
if (typeof module !== "undefined") {
  module.exports = { updateEscortsMassageTypes };
}
