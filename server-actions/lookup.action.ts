"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { serializeDocs } from "@/lib/firebase-serializer";

// Generic function to get all items from a collection
export async function getLookupCollection(collectionName: string) {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);

    const items = serializeDocs(querySnapshot.docs);

    return {
      success: true,
      data: items,
      count: items.length,
    };
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return {
      success: false,
      error: `Failed to fetch ${collectionName}`,
      data: [],
    };
  }
}

// Specific getter functions
export async function getAges() {
  return getLookupCollection("age");
}

export async function getBreastSizes() {
  return getLookupCollection("breast");
}

export async function getCharacters() {
  return getLookupCollection("character");
}

export async function getHairColors() {
  return getLookupCollection("hairColor");
}

export async function getNationalities() {
  return getLookupCollection("nationality");
}

export async function getExperienceLevels() {
  return getLookupCollection("experience");
}

export async function getLanguages() {
  return getLookupCollection("languages");
}

export async function getAvailability() {
  return getLookupCollection("availability");
}

export async function getCategories() {
  return getLookupCollection("categories");
}

export async function getPractices() {
  return getLookupCollection("practices");
}

export async function getBDSM() {
  return getLookupCollection("bdsm");
}

export async function getMassageTypes() {
  return getLookupCollection("massage");
}

// Get item by ID (for collections with IDs)
export async function getLookupItemById(collectionName: string, id: number) {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: true,
        data: { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() },
      };
    }

    return {
      success: false,
      error: "Item not found",
      data: null,
    };
  } catch (error) {
    console.error("Error fetching item:", error);
    return {
      success: false,
      error: "Failed to fetch item",
      data: null,
    };
  }
}

// Get all lookup data at once (for forms)
export async function getAllLookupData() {
  try {
    const collections = [
      "age",
      "breast",
      "character",
      "hairColor",
      "nationality",
      "experience",
      "languages",
      "availability",
      "categories",
      "practices",
      "bdsm",
      "massage",
    ];

    const results = await Promise.all(
      collections.map((name) => getLookupCollection(name)),
    );

    const data: any = {};
    collections.forEach((name, index) => {
      data[name] = results[index].success ? results[index].data : [];
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching all lookup data:", error);
    return {
      success: false,
      error: "Failed to fetch lookup data",
      data: null,
    };
  }
}
