"use server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User"; // Import User model
import { auth } from "@clerk/nextjs/server";

interface CreateUserParams {
  clerkUserId: string;
  email: string;
  username?: string;
}

// export async function createUser({
//   clerkUserId,
//   email,
//   username,
// }: CreateUserParams) {
//   await connectToDB();

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ clerkUserId });
//     if (existingUser) {
//       return { success: false, message: "User already exists." };
//     }

//     // Create new user
//     const newUser = await User.create({
//       clerkUserId,
//       email,
//       username,
//     });

//     return { success: true, user: newUser };
//   } catch (error: any) {
//     console.error("Error creating user:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to create user.",
//     };
//   }
// }
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
