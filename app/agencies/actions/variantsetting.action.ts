// // app/actions/getVariantSettings.ts
// "use server";

// // import { VariantSetting } from "@/models/VariantSetting";
// import { connectToDB, safeClone } from "@/lib/mongoose";
// import { VariantSetting } from "@/models/Settings";

// export async function getVariantSettings() {
//   await connectToDB();
//   const res = await VariantSetting.findOne({}).lean();
//   const settings = safeClone(res);
//   return settings;
// }
"use server";

import { connectToDB } from "@/lib/mongoose";
import { VariantSetting } from "@/models/Settings";

export async function getVariantSettings() {
  try {
    await connectToDB();
    const settings = await VariantSetting.findOne({}).lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch (error) {
    console.error("Error fetching variant settings:", error);
    return null;
  }
}

// Get all practices for /girls?practice= URLs
export async function getPractices() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("practices")
      .lean();

    return settings?.practices || [];
  } catch (error) {
    console.error("Error fetching practices:", error);
    return [];
  }
}

// Get all massage types for /erotic-massages?massageType= URLs
export async function getMassageTypes() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("massage")
      .lean();

    return settings?.massage || [];
  } catch (error) {
    console.error("Error fetching massage types:", error);
    return [];
  }
}

// Get all BDSM types for /bdsm?type= URLs
export async function getBDSMTypes() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("bdsm")
      .lean();

    return settings?.bdsm || [];
  } catch (error) {
    console.error("Error fetching BDSM types:", error);
    return [];
  }
}

// Get all categories
export async function getCategories() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("categories")
      .lean();

    return settings?.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get all availability options
export async function getAvailabilityOptions() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("availability")
      .lean();

    return settings?.availability || [];
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
}

// Get all nationalities
export async function getNationalities() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("nationality")
      .lean();

    return settings?.nationality || [];
  } catch (error) {
    console.error("Error fetching nationalities:", error);
    return [];
  }
}

// Get all languages
export async function getLanguages() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({})
      .select("languages")
      .lean();

    return settings?.languages || [];
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

// Get all filter options grouped (useful for multiple sitemap sections)
export async function getAllVariantFilters() {
  try {
    await connectToDB();
    const settings: any = await VariantSetting.findOne({}).lean();

    if (!settings) return null;

    const plainSettings = JSON.parse(JSON.stringify(settings));

    return {
      practices: plainSettings.practices || [],
      massage: plainSettings.massage || [],
      bdsm: plainSettings.bdsm || [],
      categories: plainSettings.categories || [],
      availability: plainSettings.availability || [],
      nationality: plainSettings.nationality || [],
      languages: plainSettings.languages || [],
      age: plainSettings.age || [],
      breast: plainSettings.breast || [],
      character: plainSettings.character || [],
      hairColor: plainSettings.hairColor || [],
      experience: plainSettings.experience || [],
    };
  } catch (error) {
    console.error("Error fetching all variant filters:", error);
    return null;
  }
}
