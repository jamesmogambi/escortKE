import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
