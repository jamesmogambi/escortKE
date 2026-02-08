"use server";

import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";
import mongoose from "mongoose";

interface SearchEscortsOptions {
  query: string;
  limit?: number;
  page?: number;
  filters?: {
    county?: string;
    region?: string;
    gender?: string;
  };
}

export async function searchEscorts({
  query,
  limit = 20,
  page = 1,
  filters = {},
}: SearchEscortsOptions) {
  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery: any = { isActive: true };

    // Text search across multiple fields
    if (query && query.trim().length > 0) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { about: { $regex: query, $options: "i" } },
        { town: { $regex: query, $options: "i" } },
        { estate: { $regex: query, $options: "i" } },
        { categories: { $in: [new RegExp(query, "i")] } },
        { practices: { $in: [new RegExp(query, "i")] } },
      ];
    }

    // Apply additional filters
    if (filters.county) {
      if (mongoose.Types.ObjectId.isValid(filters.county)) {
        searchQuery.county = new mongoose.Types.ObjectId(filters.county);
      } else {
        searchQuery["countyDetails.name"] = {
          $regex: filters.county,
          $options: "i",
        };
      }
    }

    if (filters.region) {
      searchQuery["regionDetails.name"] = {
        $regex: filters.region,
        $options: "i",
      };
    }

    if (filters.gender) {
      searchQuery.gender = filters.gender;
    }

    // Get results with pagination
    const [escorts, total] = await Promise.all([
      Escort.find(searchQuery)
        .populate("countyDetails", "name code")
        .populate("regionDetails", "name")
        .sort({
          isFeatured: -1,
          rating: -1,
          totalReviews: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Escort.countDocuments(searchQuery),
    ]);

    // Get search suggestions for autocomplete
    const suggestions = await getSearchSuggestions(query);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        escorts: JSON.parse(JSON.stringify(escorts)),
        suggestions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        stats: {
          query,
          filters,
          executionTime: new Date().toISOString(),
        },
      },
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      success: false,
      error: "Failed to search escorts",
    };
  }
}

// Get search suggestions for autocomplete
async function getSearchSuggestions(query: string) {
  if (!query || query.trim().length < 2) return [];

  try {
    const suggestions = await Escort.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
            { town: { $regex: query, $options: "i" } },
          ],
          isActive: true,
        },
      },
      {
        $project: {
          _id: 0,
          type: "escort",
          name: 1,
          username: 1,
          town: 1,
          county: 1,
          previewPhoto: 1,
          score: {
            $cond: [
              { $regexMatch: { input: "$name", regex: query, options: "i" } },
              3,
              {
                $cond: [
                  {
                    $regexMatch: {
                      input: "$username",
                      regex: query,
                      options: "i",
                    },
                  },
                  2,
                  1,
                ],
              },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 8 },
    ]);

    // Also get location suggestions
    const locationSuggestions = await Escort.aggregate([
      {
        $match: {
          $or: [
            { town: { $regex: query, $options: "i" } },
            { "countyDetails.name": { $regex: query, $options: "i" } },
          ],
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$town",
          type: { $first: "location" },
          name: { $first: "$town" },
          county: { $first: "$countyDetails.name" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return [...suggestions, ...locationSuggestions];
  } catch (error) {
    console.error("Suggestions error:", error);
    return [];
  }
}

// Get trending searches
// export async function getTrendingSearches(limit: number = 10) {
//   try {
//     await connectToDB();

//     // In production, you'd want to track actual search queries
//     // For now, return popular categories/locations
//     const trending  = await Escort.aggregate([
//       { $match: { isActive: true } },
//       { $unwind: "$categories" },
//       {
//         $group: {
//           _id: "$categories",
//           count: { $sum: 1 },
//           type: "category",
//         },
//       },
//       { $sort: { count: -1 } },
//       { $limit: limit },
//     ]);

//     return {
//       success: true,
//       data: trending,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: "Failed to get trending searches",
//     };
//   }
// }

// Get recent searches (client-side usually, but here's server version)
export async function saveSearchQuery(query: string, userId?: string) {
  // In production, you'd save this to a database
  // For now, we'll just log it
  console.log(`Search query saved: ${query} by user: ${userId || "anonymous"}`);
  return { success: true };
}
