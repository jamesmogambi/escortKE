"use server";

import { connectToDB } from "@/lib/mongoose";
import Escort from "@/models/Escort";
import User from "@/models/User";
import axios from "axios";
import { success } from "zod";

interface CreateNewEscortParam {
  imageFiles: any;
  videoFiles?: any;
  previewPhoto?: any;
}

const baseURL = `${process.env.NEXT_PUBLIC_SITE_URL}`;

export async function createNewEscort(escortData: any) {
  await connectToDB();

  const { clerkUserId } = escortData;

  try {
    // console.log("Uploading to:", `${baseURL}/api/s3/upload-escort-images`);
    console.log("escord---data>>>", { ...escortData });
    // 1// SAVE ESCORT TO ESCORT SCHEMA

    const escort = await Escort.create(escortData);

    // 2// UPDATE USER ROLE TO 'escort' in USER SCHEMA
    const user = await User.findOneAndUpdate(
      { clerkUserId: clerkUserId },
      { role: "escort" },
      { new: true }
    );

    // 3. mux will call webhook to save video playback ids to db

    // console.log("imgUrls", s3Res);
    return {
      success: true,
      escort,
    };

    // return newUser;
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
}
