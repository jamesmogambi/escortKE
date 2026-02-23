"use server";

import { connectToDB, safeClone } from "@/lib/mongoose";
import Escort, { EscortDoc } from "@/models/Escort";
import { User } from "@/models/User";
// import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
// import User from "@/models/User";
import axios from "axios";
import { success } from "zod";
import { getMongoUserIdByClerkId } from "./user";

interface CreateNewEscortParam {
  imageFiles: any;
  videoFiles?: any;
  previewPhoto?: any;
}

const baseURL = `${process.env.NEXT_PUBLIC_SITE_URL}`;

interface FetchEscortsParams {
  town?: string;
  region?: string;
  practices?: string[];
  page?: number;
  limit?: number;
}
// get escorts form DB
export async function fetchEscorts({
  town,
  region,
  practices,
  page = 1,
  limit = 20,
}: FetchEscortsParams) {
  try {
    await connectToDB();

    const query: Record<string, any> = {
      role: "escort",
      isActive: true,
    };

    if (town) {
      query.town = town;
    }

    if (region) {
      query.region = region;
    }

    if (practices && practices.length > 0) {
      query.practices = { $in: practices }; // Match escorts with ANY of the selected practices
    }

    const skip = (page - 1) * limit;

    const [escorts, total] = await Promise.all([
      Escort.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Escort.countDocuments(query),
    ]);

    return {
      data: escorts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("fetchEscorts error:", error);

    return {
      data: [],
      total: 0,
      page,
      totalPages: 0,
      error: "Failed to fetch escorts",
    };
  }
}

// create escort profile in DB after registration
export async function createEscort(escortData: any) {
  await connectToDB();

  const { clerkUserId } = escortData;

  try {
    console.log("escortData keys:", Object.keys(escortData));

    const data = {
      source: "custom",
      ...escortData,
    };

    // check if escort already exists
    const existingEscort = await Escort.findOne({ clerkUserId });

    if (existingEscort) {
      throw new Error("Escort profile already exists for this user.");
    }

    await Escort.create(data);

    return {
      success: true,
    };
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

export async function saveNewEscortProfile(data: Partial<EscortDoc>) {
  try {
    // 🔐 Authenticate user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // 🔌 Connect to DB
    await connectToDB();

    // 🚫 Check if escort already exists
    const existingEscort = await Escort.findOne({ clerkUserId: userId });

    if (existingEscort) {
      throw new Error("Escort profile already exists");
    }

    // 🧠 Generate slug
    const slug =
      `${data.name || "escort"}`.toLowerCase().trim().replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 8);

    // 📝 Save escort
    const escort = await Escort.create({
      ...data,
      clerkUserId: userId, // ✅ authoritative source
      slug,
      role: "escort",
      isActive: true,
      isVerified: false,
    });

    return safeClone(escort);
  } catch (error: any) {
    console.error("❌ saveEscortProfile error:", error);

    // Normalize error message
    throw new Error(error?.message || "Failed to create escort profile");
  }
}

export async function getCurrentEscort() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await connectToDB();

    const escort = await Escort.findOne({ clerkUserId: userId }).lean();

    if (!escort) {
      return null;
    }

    return safeClone(escort);
  } catch (error) {
    console.error("❌ Error fetching current escort:", error);
    throw new Error("Failed to fetch current escort");
  }
}

export async function updateEscortProfile(data: any) {
  try {
    // 🔐 Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await connectToDB();

    const updatedEscort = await Escort.findOneAndUpdate(
      { clerkUserId: userId }, // ✅ match by Clerk ID
      { $set: data },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedEscort) {
      throw new Error("Escort profile not found");
    }

    return {
      success: true,
      data: updatedEscort,
    };
  } catch (error: any) {
    console.error("❌ Failed to update escort profile:", error);

    throw new Error(error?.message || "Failed to update escort profile");
  }
}

export async function getEscortByUsername(username: string) {
  try {
    await connectToDB();

    const escort = await Escort.findOne({ username })
      .populate("countyDetails", "name code")
      .populate("regionDetails", "name")
      .populate("agencyDetails", "name slug isVerified")
      .lean()
      .exec();

    if (!escort) {
      return { success: false, error: "Escort not found" };
    }

    // Convert MongoDB ObjectId and Date to strings for serialization
    const serializedEscort = JSON.parse(JSON.stringify(escort));

    return {
      success: true,
      data: serializedEscort,
    };
  } catch (error) {
    console.error("Error fetching escort by username:", error);
    return {
      success: false,
      error: "Failed to fetch escort",
    };
  }
}
