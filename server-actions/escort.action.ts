"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

// Types
export interface Escort {
  id: string;
  name: string;
  username: string;
  previewPhoto: string;
  labels: string[];
  email: string;
  age: string;
  telephone: string;
  whatsappPhone: string;
  images: string[];
  videos: string[];
  about: string;
  availability: string[];
  ethnicity: string;
  nationality: string;
  bustSize: string;
  weight: string;
  zodiacSign: string;
  sexualOrientation: string;
  gender: string;
  languages: string[];
  categories: string[];
  country: string;
  county: string;
  countyCode: string;
  regions: string[];
  primaryRegion: string;
  locations: Location[];
  source: string;
  practices: string[];
  bdsm: string[];
  massage: string[];
  extraServices: string[];
  slug: string;
  role: string;
  openingHours: OpeningHours;
  rates: Rate[];
  breastSize: string;
  ageCategory: string;
  character: string;
  hairColor: string;
  experience: string;
  workType: string;
  isAgencyFeatured: boolean;
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  plan: Plan;
  totalBookings: number;
  totalReviews: number;
  rating: number;
  totalViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  region: string;
  town: string;
  estate: string;
  address: string;
  street: string;
  postalCode: string;
  isActive: boolean;
  notes: string;
  _id?: string;
}

export interface Rate {
  duration: string;
  incall: string;
  outcall: string;
  _id?: string;
}

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Plan {
  type: string;
  isActive: boolean;
  features: string[];
}

export interface GetEscortsParams {
  page?: number;
  limit?: number;
  county?: string; // countyCode
  region?: string; // region ID
  town?: string;
  estate?: string;
  practice?: string; // single practice
  practices?: string[]; // multiple practices
  category?: string;
  categories?: string[];
  nationality?: string;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  search?: string;
  minRating?: number;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "age"
    | "totalViews"
    | "rating"
    | "totalBookings";
  sortOrder?: "asc" | "desc";
}

export interface GetEscortsResponse {
  escorts: Escort[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Helper function to convert Firestore DocumentSnapshot to Escort type (for single documents)
const convertDocSnapshotToEscort = (
  doc: FirebaseFirestore.DocumentSnapshot,
): Escort | null => {
  if (!doc.exists) return null;

  const data = doc.data();
  if (!data) return null;

  return {
    id: doc.id,
    name: data.name,
    username: data.username,
    previewPhoto: data.previewPhoto,
    labels: data.labels || [],
    email: data.email,
    age: data.age,
    telephone: data.telephone,
    whatsappPhone: data.whatsappPhone,
    images: data.images || [],
    videos: data.videos || [],
    about: data.about,
    availability: data.availability || [],
    ethnicity: data.ethnicity,
    nationality: data.nationality,
    bustSize: data.bustSize,
    weight: data.weight,
    zodiacSign: data.zodiacSign,
    sexualOrientation: data.sexualOrientation,
    gender: data.gender,
    languages: data.languages || [],
    categories: data.categories || [],
    country: data.country,
    county: data.county, // This is now a string (county name), not an ObjectId
    countyCode: data.countyCode,
    regions: data.regions || [],
    primaryRegion: data.primaryRegion,
    locations: data.locations || [],
    source: data.source,
    practices: data.practices || [],
    bdsm: data.bdsm || [],
    massage: data.massage || [],
    extraServices: data.extraServices || [],
    slug: data.slug,
    role: data.role,
    openingHours: data.openingHours || {
      monday: "Not Specified",
      tuesday: "Not Specified",
      wednesday: "Not Specified",
      thursday: "Not Specified",
      friday: "Not Specified",
      saturday: "Not Specified",
      sunday: "Not Specified",
    },
    rates: data.rates || [],
    breastSize: data.breastSize,
    ageCategory: data.ageCategory,
    character: data.character,
    hairColor: data.hairColor,
    experience: data.experience,
    workType: data.workType,
    isAgencyFeatured: data.isAgencyFeatured,
    isActive: data.isActive,
    isVerified: data.isVerified,
    isFeatured: data.isFeatured,
    plan: data.plan,
    totalBookings: data.totalBookings || 0,
    totalReviews: data.totalReviews || 0,
    rating: data.rating || 0,
    totalViews: data.totalViews || 0,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  };
};
// Helper function to convert Firestore QueryDocumentSnapshot to Escort type (for collections)
const convertQueryDocToEscort = (
  doc: FirebaseFirestore.QueryDocumentSnapshot,
): Escort => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    username: data.username,
    previewPhoto: data.previewPhoto,
    labels: data.labels || [],
    email: data.email,
    age: data.age,
    telephone: data.telephone,
    whatsappPhone: data.whatsappPhone,
    images: data.images || [],
    videos: data.videos || [],
    about: data.about,
    availability: data.availability || [],
    ethnicity: data.ethnicity,
    nationality: data.nationality,
    bustSize: data.bustSize,
    weight: data.weight,
    zodiacSign: data.zodiacSign,
    sexualOrientation: data.sexualOrientation,
    gender: data.gender,
    languages: data.languages || [],
    categories: data.categories || [],
    country: data.country,
    county: data.county,
    countyCode: data.countyCode,
    regions: data.regions || [],
    primaryRegion: data.primaryRegion,
    locations: data.locations || [],
    source: data.source,
    practices: data.practices || [],
    bdsm: data.bdsm || [],
    massage: data.massage || [],
    extraServices: data.extraServices || [],
    slug: data.slug,
    role: data.role,
    openingHours: data.openingHours || {
      monday: "Not Specified",
      tuesday: "Not Specified",
      wednesday: "Not Specified",
      thursday: "Not Specified",
      friday: "Not Specified",
      saturday: "Not Specified",
      sunday: "Not Specified",
    },
    rates: data.rates || [],
    breastSize: data.breastSize,
    ageCategory: data.ageCategory,
    character: data.character,
    hairColor: data.hairColor,
    experience: data.experience,
    workType: data.workType,
    isAgencyFeatured: data.isAgencyFeatured,
    isActive: data.isActive,
    isVerified: data.isVerified,
    isFeatured: data.isFeatured,
    plan: data.plan,
    totalBookings: data.totalBookings || 0,
    totalReviews: data.totalReviews || 0,
    rating: data.rating || 0,
    totalViews: data.totalViews || 0,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  };
};

// Main get escorts function with all filters
export async function getEscorts(
  params: GetEscortsParams = {},
): Promise<GetEscortsResponse> {
  try {
    const {
      page = 1,
      limit = 20,
      county,
      region,
      town,
      estate,
      practice,
      practices,
      category,
      categories,
      nationality,
      minAge,
      maxAge,
      isActive = true,
      isVerified,
      isFeatured,
      search,
      minRating,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    let query: FirebaseFirestore.Query = adminDb.collection("escorts");

    // Apply basic filters
    if (isActive !== undefined) {
      query = query.where("isActive", "==", isActive);
    }

    if (isVerified !== undefined) {
      query = query.where("isVerified", "==", isVerified);
    }

    if (isFeatured !== undefined) {
      query = query.where("isFeatured", "==", isFeatured);
    }

    // County filter
    if (county) {
      query = query.where("countyCode", "==", county);
    }

    // Region filter - regions is an array
    if (region) {
      query = query.where("regions", "array-contains", region);
    }

    // Practice filter - practices is an array
    if (practice) {
      query = query.where("practices", "array-contains", practice);
    }

    // Category filter
    if (category) {
      query = query.where("categories", "array-contains", category);
    }

    // Nationality filter
    if (nationality) {
      query = query.where("nationality", "==", nationality);
    }

    // Age range filter
    if (minAge !== undefined && maxAge !== undefined) {
      query = query
        .where("age", ">=", minAge.toString())
        .where("age", "<=", maxAge.toString());
    } else if (minAge !== undefined) {
      query = query.where("age", ">=", minAge.toString());
    } else if (maxAge !== undefined) {
      query = query.where("age", "<=", maxAge.toString());
    }

    // Rating filter
    if (minRating !== undefined) {
      query = query.where("rating", ">=", minRating);
    }

    // Search by name or username
    if (search) {
      query = query
        .where("name", ">=", search)
        .where("name", "<=", search + "\uf8ff");
    }

    // Apply sorting
    query = query.orderBy(sortBy, sortOrder);

    // Get total count (without pagination)
    const totalSnapshot = await query.count().get();
    const total = totalSnapshot.data().count;

    // Apply pagination
    const startAt = (page - 1) * limit;
    let snapshot = await query.limit(limit).offset(startAt).get();

    let escorts = snapshot.docs.map(convertQueryDocToEscort);

    // Filter by town/estate (client-side since it's nested)
    if (town || estate) {
      escorts = escorts.filter((escort) => {
        const hasLocation = escort.locations.some((loc) => {
          let match = true;
          if (town) {
            match = match && (loc.town === town || loc.estate === town);
          }
          if (estate) {
            match = match && loc.estate === estate;
          }
          return match;
        });
        return hasLocation;
      });
    }

    // Filter by multiple practices (client-side)
    if (practices && practices.length > 0) {
      escorts = escorts.filter((escort) => {
        return practices.some((practice) =>
          escort.practices.includes(practice),
        );
      });
    }

    // Filter by multiple categories (client-side)
    if (categories && categories.length > 0) {
      escorts = escorts.filter((escort) => {
        return categories.some((cat) => escort.categories.includes(cat));
      });
    }

    return {
      escorts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    };
  } catch (error) {
    console.error("Error fetching escorts:", error);
    throw new Error("Failed to fetch escorts");
  }
}

// Get escorts by county
export async function getEscortsByCounty(
  countyCode: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    county: countyCode,
    isActive: true,
    limit,
    page,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
}

// Get escorts by region
export async function getEscortsByRegion(
  regionId: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    region: regionId,
    isActive: true,
    limit,
    page,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
}

// Get escorts by town/city
export async function getEscortsByTown(
  town: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  const { escorts, total, totalPages, hasMore } = await getEscorts({
    isActive: true,
    limit: limit * 2,
    page,
  });

  const filteredEscorts = escorts.filter((escort) =>
    escort.locations.some((loc) => loc.town === town || loc.estate === town),
  );

  return {
    escorts: filteredEscorts.slice(0, limit),
    total: filteredEscorts.length,
    page,
    totalPages: Math.ceil(filteredEscorts.length / limit),
    hasMore: filteredEscorts.length > page * limit,
  };
}

// Get escorts by practice/service
export async function getEscortsByPractice(
  practice: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    practice,
    isActive: true,
    limit,
    page,
    sortBy: "rating",
    sortOrder: "desc",
  });
}

// Get escorts by multiple practices
export async function getEscortsByPractices(
  practices: string[],
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    practices,
    isActive: true,
    limit,
    page,
    sortBy: "rating",
    sortOrder: "desc",
  });
}

// Get escorts by category
export async function getEscortsByCategory(
  category: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    category,
    isActive: true,
    limit,
    page,
    sortBy: "rating",
    sortOrder: "desc",
  });
}

// Get escorts by county and practice combined
export async function getEscortsByCountyAndPractice(
  countyCode: string,
  practice: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    county: countyCode,
    practice,
    isActive: true,
    limit,
    page,
    sortBy: "rating",
    sortOrder: "desc",
  });
}

// Get escorts by region and practice combined
export async function getEscortsByRegionAndPractice(
  regionId: string,
  practice: string,
  limit: number = 20,
  page: number = 1,
): Promise<GetEscortsResponse> {
  return getEscorts({
    region: regionId,
    practice,
    isActive: true,
    limit,
    page,
    sortBy: "rating",
    sortOrder: "desc",
  });
}

// Get single escort by ID - FIXED
export async function getEscortById(id: string): Promise<Escort | null> {
  try {
    // Add debugging
    console.log("getEscortById called with id:", id);
    console.log("id type:", typeof id);
    console.log("id length:", id?.length);

    if (!id || id.trim() === "") {
      console.error("Empty ID provided to getEscortById");
      return null;
    }
    const doc = await adminDb.collection("escorts").doc(id).get();

    if (!doc.exists) {
      return null;
    }

    // Increment view count asynchronously without waiting
    adminDb
      .collection("escorts")
      .doc(id)
      .update({
        totalViews: FieldValue.increment(1),
      })
      .catch((error) => {
        console.error("Error incrementing view count:", error);
      });

    return convertDocSnapshotToEscort(doc);
  } catch (error) {
    console.error("Error fetching escort:", error);
    throw new Error("Failed to fetch escort");
  }
}

// Get escort by username - FIXED
export async function getEscortByUsername(
  username: string,
): Promise<Escort | null> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .where("username", "==", username)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];

    // Increment view count asynchronously without waiting
    adminDb
      .collection("escorts")
      .doc(doc.id)
      .update({
        totalViews: FieldValue.increment(1),
      })
      .catch((error) => {
        console.error("Error incrementing view count:", error);
      });

    return convertDocSnapshotToEscort(doc);
  } catch (error) {
    console.error("Error fetching escort by username:", error);
    throw new Error("Failed to fetch escort");
  }
}

// Get featured escorts - UPDATED to use convertQueryDocToEscort
export async function getFeaturedEscorts(
  limit: number = 10,
): Promise<Escort[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .where("isActive", "==", true)
      .where("isFeatured", "==", true)
      .orderBy("rating", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map(convertQueryDocToEscort);
  } catch (error) {
    console.error("Error fetching featured escorts:", error);
    throw new Error("Failed to fetch featured escorts");
  }
}

// Get top rated escorts - UPDATED to use convertQueryDocToEscort
export async function getTopRatedEscorts(
  limit: number = 10,
): Promise<Escort[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .where("isActive", "==", true)
      .orderBy("rating", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map(convertQueryDocToEscort);
  } catch (error) {
    console.error("Error fetching top rated escorts:", error);
    throw new Error("Failed to fetch top rated escorts");
  }
}

// Get most viewed escorts - UPDATED to use convertQueryDocToEscort
export async function getMostViewedEscorts(
  limit: number = 10,
): Promise<Escort[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .where("isActive", "==", true)
      .orderBy("totalViews", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map(convertQueryDocToEscort);
  } catch (error) {
    console.error("Error fetching most viewed escorts:", error);
    throw new Error("Failed to fetch most viewed escorts");
  }
}

// Get recent escorts - UPDATED to use convertQueryDocToEscort
export async function getRecentEscorts(limit: number = 10): Promise<Escort[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map(convertQueryDocToEscort);
  } catch (error) {
    console.error("Error fetching recent escorts:", error);
    throw new Error("Failed to fetch recent escorts");
  }
}

// Get all unique practices
export async function getAllPractices(): Promise<string[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .select("practices")
      .get();

    const practicesSet = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const practices = doc.data().practices || [];
      practices.forEach((practice: string) => practicesSet.add(practice));
    });

    return Array.from(practicesSet).sort();
  } catch (error) {
    console.error("Error fetching practices:", error);
    throw new Error("Failed to fetch practices");
  }
}

// Get all unique categories
export async function getAllCategories(): Promise<string[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .select("categories")
      .get();

    const categoriesSet = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const categories = doc.data().categories || [];
      categories.forEach((category: string) => categoriesSet.add(category));
    });

    return Array.from(categoriesSet).sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Get all unique nationalities
export async function getAllNationalities(): Promise<string[]> {
  try {
    const snapshot = await adminDb
      .collection("escorts")
      .select("nationality")
      .get();

    const nationalitiesSet = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const nationality = doc.data().nationality;
      if (nationality) {
        nationalitiesSet.add(nationality);
      }
    });

    return Array.from(nationalitiesSet).sort();
  } catch (error) {
    console.error("Error fetching nationalities:", error);
    throw new Error("Failed to fetch nationalities");
  }
}

// Get escorts statistics
export async function getEscortsStatistics() {
  try {
    const totalSnapshot = await adminDb.collection("escorts").count().get();
    const total = totalSnapshot.data().count;

    const activeSnapshot = await adminDb
      .collection("escorts")
      .where("isActive", "==", true)
      .count()
      .get();
    const active = activeSnapshot.data().count;

    const verifiedSnapshot = await adminDb
      .collection("escorts")
      .where("isVerified", "==", true)
      .count()
      .get();
    const verified = verifiedSnapshot.data().count;

    const featuredSnapshot = await adminDb
      .collection("escorts")
      .where("isFeatured", "==", true)
      .count()
      .get();
    const featured = featuredSnapshot.data().count;

    // Get county distribution
    const countiesSnapshot = await adminDb
      .collection("escorts")
      .select("countyCode", "county")
      .get();

    const countyDistribution: Record<
      string,
      { code: string; name: string; count: number }
    > = {};
    countiesSnapshot.docs.forEach((doc) => {
      const countyCode = doc.data().countyCode;
      const countyName = doc.data().county;
      if (countyCode) {
        if (!countyDistribution[countyCode]) {
          countyDistribution[countyCode] = {
            code: countyCode,
            name: countyName || countyCode,
            count: 0,
          };
        }
        countyDistribution[countyCode].count++;
      }
    });

    // Get practice distribution
    const practicesSnapshot = await adminDb
      .collection("escorts")
      .select("practices")
      .get();

    const practiceDistribution: Record<string, number> = {};
    practicesSnapshot.docs.forEach((doc) => {
      const practices = doc.data().practices || [];
      practices.forEach((practice: string) => {
        practiceDistribution[practice] =
          (practiceDistribution[practice] || 0) + 1;
      });
    });

    // Get age distribution
    const agesSnapshot = await adminDb
      .collection("escorts")
      .select("age")
      .get();
    const ageDistribution: Record<string, number> = {};
    agesSnapshot.docs.forEach((doc) => {
      const age = doc.data().age;
      if (age) {
        const ageNum = parseInt(age);
        const ageGroup = `${Math.floor(ageNum / 5) * 5}-${Math.floor(ageNum / 5) * 5 + 4}`;
        ageDistribution[ageGroup] = (ageDistribution[ageGroup] || 0) + 1;
      }
    });

    return {
      total,
      active,
      inactive: total - active,
      verified,
      unverified: total - verified,
      featured,
      countyDistribution: Object.values(countyDistribution),
      practiceDistribution,
      ageDistribution,
    };
  } catch (error) {
    console.error("Error fetching escort statistics:", error);
    throw new Error("Failed to fetch escort statistics");
  }
}

// Create new escort
export async function createEscort(
  escortData: Omit<Escort, "id" | "createdAt" | "updatedAt">,
): Promise<Escort> {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Creation only allowed in development environment");
    }

    const now = new Date();
    const docRef = adminDb.collection("escorts").doc();

    const newEscort = {
      ...escortData,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      totalBookings: 0,
      totalReviews: 0,
      rating: 0,
      totalViews: 0,
    };

    await docRef.set(newEscort);

    revalidatePath("/escorts");
    revalidatePath(`/escorts/${docRef.id}`);

    return {
      id: docRef.id,
      ...escortData,
      createdAt: now,
      updatedAt: now,
      totalBookings: 0,
      totalReviews: 0,
      rating: 0,
      totalViews: 0,
    };
  } catch (error) {
    console.error("Error creating escort:", error);
    throw new Error("Failed to create escort");
  }
}

// Update escort
export async function updateEscort(
  id: string,
  updates: Partial<Escort>,
): Promise<void> {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Updates only allowed in development environment");
    }

    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await adminDb.collection("escorts").doc(id).update(updateData);

    revalidatePath("/escorts");
    revalidatePath(`/escorts/${id}`);
  } catch (error) {
    console.error("Error updating escort:", error);
    throw new Error("Failed to update escort");
  }
}

// Delete escort
export async function deleteEscort(id: string): Promise<void> {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Deletion only allowed in development environment");
    }

    await adminDb.collection("escorts").doc(id).delete();

    revalidatePath("/escorts");
  } catch (error) {
    console.error("Error deleting escort:", error);
    throw new Error("Failed to delete escort");
  }
}

// Update escort rating
export async function updateEscortRating(
  id: string,
  newRating: number,
): Promise<void> {
  try {
    const doc = await adminDb.collection("escorts").doc(id).get();
    const data = doc.data();

    const totalReviews = (data?.totalReviews || 0) + 1;
    const currentTotalRating = (data?.rating || 0) * (data?.totalReviews || 0);
    const newAverageRating = (currentTotalRating + newRating) / totalReviews;

    await adminDb
      .collection("escorts")
      .doc(id)
      .update({
        rating: newAverageRating,
        totalReviews,
        updatedAt: Timestamp.fromDate(new Date()),
      });

    revalidatePath(`/escorts/${id}`);
  } catch (error) {
    console.error("Error updating escort rating:", error);
    throw new Error("Failed to update escort rating");
  }
}

// Increment booking count
export async function incrementBookingCount(id: string): Promise<void> {
  try {
    await adminDb
      .collection("escorts")
      .doc(id)
      .update({
        totalBookings: FieldValue.increment(1),
        updatedAt: Timestamp.fromDate(new Date()),
      });
  } catch (error) {
    console.error("Error incrementing booking count:", error);
    throw new Error("Failed to update booking count");
  }
}
