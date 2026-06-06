"use server";
import { connectToDB } from "@/lib/mongoose";
import { User } from "@/models/User";
// import User from "@/models/User";
// import User from "@/models/User"; // Import User model
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

interface CreateUserParams {
  clerkUserId: string;
  email: string;
  username?: string;
}

export async function createUser({
  clerkUserId,
  email,
  username,
}: CreateUserParams) {
  await connectToDB();

  // Validate required fields
  if (!clerkUserId || !email) {
    throw new Error(
      "Missing required fields: clerkUserId and email are mandatory."
    );
  }

  // Check for existing user
  const existingUser = await User.findOne({ clerkUserId });
  if (existingUser) {
    throw new Error(`User with clerkUserId "${clerkUserId}" already exists.`);
  }

  try {
    const newUser = await User.create({
      clerkUserId,
      email,
      username,
    });

    return newUser;
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

// utils/getMongoUserIdByClerkId.ts

/**
 * Finds a user's MongoDB _id using their Clerk userId.
 * Throws if no user is found.
 */
export async function getMongoUserIdByClerkId(
  clerkUserId: string
): Promise<mongoose.Types.ObjectId> {
  const user = await User.findOne({ clerkUserId }).select("_id");

  if (!user) {
    throw new Error(`No user found with Clerk ID: ${clerkUserId}`);
  }

  return user._id;
}
