// Define a proper type for the match stage
interface FilterMatchStage {
  gender: string;
  isActive: boolean;
  role: string;
  county?: Types.ObjectId;
  regions?: Types.ObjectId;
  ethnicity?: { $ne: string };
  nationality?: { $ne: string };
  categories?: { $ne: never[] };
  practices?: { $ne: never[] };
  languages?: { $ne: never[] };
  [key: string]: any; // Allow other dynamic properties
}

// Helper function to get filter options
async function getFilterOptions(currentFilters: any) {
  try {
    const baseMatch: FilterMatchStage = {
      gender: "girl",
      isActive: true,
      role: "escort",
    };

    // Apply current location filters to filter options
    if (currentFilters.countyName) {
      const county = await County.findOne({
        name: { $regex: new RegExp(`^${currentFilters.countyName}$`, "i") },
      });
      if (county) {
        baseMatch.county = county._id;
      }
    }

    if (currentFilters.regionName) {
      const region = await Region.findOne({
        name: { $regex: new RegExp(`^${currentFilters.regionName}$`, "i") },
      });
      if (region) {
        baseMatch.regions = region._id;
      }
    }

    // Add non-empty filters
    if (currentFilters.practice) {
      baseMatch.practices = { $in: [currentFilters.practice] };
    }

    if (currentFilters.category) {
      baseMatch.categories = { $in: [currentFilters.category] };
    }

    const [
      ethnicities,
      nationalities,
      categories,
      practices,
      languages,
      ageRange,
    ] = await Promise.all([
      Escort.distinct("ethnicity", { ...baseMatch, ethnicity: { $ne: "" } }),
      Escort.distinct("nationality", {
        ...baseMatch,
        nationality: { $ne: "" },
      }),
      Escort.distinct("categories", { ...baseMatch, categories: { $ne: [] } }),
      Escort.distinct("practices", { ...baseMatch, practices: { $ne: [] } }),
      Escort.distinct("languages", { ...baseMatch, languages: { $ne: [] } }),
      Escort.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            minAge: { $min: { $toInt: "$age" } },
            maxAge: { $max: { $toInt: "$age" } },
          },
        },
      ]),
    ]);

    return {
      ethnicities: ethnicities.filter(Boolean).sort(),
      nationalities: nationalities.filter(Boolean).sort(),
      categories: categories.filter(Boolean).sort(),
      practices: practices.filter(Boolean).sort(),
      languages: languages.filter(Boolean).sort(),
      ageRange: {
        min: ageRange[0]?.minAge || 18,
        max: ageRange[0]?.maxAge || 65,
      },
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return null;
  }
}
