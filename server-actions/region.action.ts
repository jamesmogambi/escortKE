"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export interface ICounty {
  id: string;
  name: string;
  code: string;
  description?: string;
  isPopular: boolean;
  population?: number;
  area?: string;
  capital?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simple in-memory cache
let cachedPopularCounties: {
  data: ICounty[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getPopularCounties(options?: {
  forceRefresh?: boolean;
  limit?: number;
}) {
  try {
    // Check cache
    if (
      !options?.forceRefresh &&
      cachedPopularCounties &&
      Date.now() - cachedPopularCounties.timestamp < CACHE_DURATION
    ) {
      console.log("Returning cached popular counties");
      return {
        success: true,
        data: cachedPopularCounties.data,
        count: cachedPopularCounties.data.length,
        fromCache: true,
      };
    }

    // Build query
    const countiesRef = collection(db, "counties");
    let constraints: any[] = [
      where("isPopular", "==", true),
      orderBy("name", "asc"),
    ];

    const q = query(countiesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let popularCounties = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ICounty[];

    // Apply limit if specified
    if (options?.limit && options.limit > 0) {
      popularCounties = popularCounties.slice(0, options.limit);
    }

    // Update cache
    cachedPopularCounties = {
      data: popularCounties,
      timestamp: Date.now(),
    };

    return {
      success: true,
      data: popularCounties,
      count: popularCounties.length,
      fromCache: false,
    };
  } catch (error) {
    console.error("Error fetching popular counties:", error);
    return {
      success: false,
      error: "Failed to fetch popular counties",
      data: [],
    };
  }
}

// Optional: Function to clear cache
export async function clearPopularCountiesCache() {
  cachedPopularCounties = null;
  return { success: true, message: "Cache cleared" };
}

export async function getAllCounties() {
  try {
    const countiesRef = collection(db, "counties");
    const q = query(countiesRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);

    const counties = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ICounty[];

    return {
      success: true,
      data: counties,
      count: counties.length,
    };
  } catch (error) {
    console.error("Error fetching all counties:", error);
    return {
      success: false,
      error: "Failed to fetch counties",
      data: [],
    };
  }
}
