"use server";

import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";
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

export async function createNewEscort(escortData: any) {
  await connectToDB();

  // const { clerkUserId } = escortData;

  // get clerkuserid

  try {
    // console.log("Uploading to:", `${baseURL}/api/s3/upload-escort-images`);
    // console.log("escord---data>>>", { ...escortData });
    console.log("escortData keys:", Object.keys(escortData));
    // 1// SAVE ESCORT TO ESCORT SCHEMA

    const session = await auth(); // ✅ Await the promise
    const { userId } = session;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userRef = await getMongoUserIdByClerkId(userId);

    const data = {
      user: userRef,
      source: "custom",
      ...escortData,
    };

    // check if escort already exists
    const existingEscort = await Escort.findOne({ user: userRef });

    if (existingEscort) {
      throw new Error("Escort profile already exists for this user.");
    }

    await Escort.create(data);

    // 2// UPDATE USER ROLE TO 'escort' in USER SCHEMA
    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { role: "escort" },
      { new: true }
    );

    if (!user) {
      console.warn("User not found for clerkUserId:", userId);
    }

    // 3. mux will call webhook to save video playback ids to db

    // console.log("imgUrls", s3Res);
    return {
      success: true,

      // escort,
    };

    // return newUser;
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
}
