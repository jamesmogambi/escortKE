import { localeToFlagEmoji } from "@/fixtures/flags";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import mongoose from "mongoose";
import { User } from "@/models/User";
// import { User } from "@clerk/nextjs/server";
// import User from "@/models/User";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove non-alphanumeric (except hyphen)
}

export function convertToLocalPhone(phone: string): string {
  // Remove all whitespace
  const cleaned = phone.replace(/\s+/g, "");

  // Replace +254 with 0
  if (cleaned.startsWith("+254")) {
    return "0" + cleaned.slice(4);
  }

  // If already starts with 0 and valid length, return as is
  if (cleaned.startsWith("0")) {
    return cleaned;
  }

  // Fallback: return original
  return phone;
}

export function formatKenyanPhoneNumber(phoneNumber: string): string {
  // Remove any spaces just in case
  const cleaned = phoneNumber.replace(/\s+/g, "");

  // Validate input
  if (!cleaned.startsWith("+254") || cleaned.length !== 13) {
    throw new Error(
      "Phone number must start with +254 and be 13 characters long"
    );
  }

  // Convert to local format: +254701694004 → 0701694004
  const localNumber = "0" + cleaned.slice(4); // slice from index 4 to remove '+254'

  // Format: 0701 694 004
  return `${localNumber.slice(0, 4)} ${localNumber.slice(
    4,
    7
  )} ${localNumber.slice(7)}`;
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(" ")[0];
}

// const normalizeWorkingHours = (data: any["workingHours"]) => {
//   return Object.entries(data).map(([day, val]) => {
//     if (!val.enabled) return { day, off: true };
//     return { day, start: val.start, end: val.end };
//   });
// };

export function formatCategory(input: string): string {
  return input
    .split(/[^a-zA-Z0-9]+/) // Split by non-word characters
    .filter((word) => word.length > 0) // Remove empty fragments
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
    .join(" ");
}

export function splitIntoThreeColumns<T>(items: T[]): [T[], T[], T[]] {
  const columns: [T[], T[], T[]] = [[], [], []];

  items.forEach((item, index) => {
    columns[index % 3].push(item);
  });

  return columns;
}

export const getFlagEmoji = (locale: string): string =>
  localeToFlagEmoji[locale] ?? "🏳️"; // fallback to white flag

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
