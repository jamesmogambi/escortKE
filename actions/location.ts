"use server";

import { connectToDB, serializeMongoDocs } from "@/lib/mongoose";
import { Region } from "@/models/Region";
import { Town } from "@/models/Town";

export async function getRegions() {
  try {
    await connectToDB();
    const res = await Region.find({}).lean();
    const regions = serializeMongoDocs(res);
    return regions;
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    throw new Error("Could not load regions");
  }
}

export async function getTowns() {
  try {
    await connectToDB();

    const res = await Town.find({})
      .populate({
        path: "region",
        select: "name country", // only include region name and country
      })
      .lean();
    const towns = serializeMongoDocs(res);
    return towns;
  } catch (error) {
    console.error("Failed to fetch towns:", error);
    throw new Error("Could not load towns");
  }
}
