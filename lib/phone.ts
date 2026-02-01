// lib/utils/phoneFormatter.ts

export function convertToLocalPhone(phone?: string | null): string {
  // Handle undefined, null, or empty input
  if (!phone) {
    return "";
  }

  // Ensure phone is a string
  const phoneStr = String(phone);

  // Remove all whitespace
  const cleaned = phoneStr.replace(/\s+/g, "");

  // Check if phone is actually a string with content
  if (!cleaned || cleaned.length === 0) {
    return "";
  }

  // Replace +254 with 0
  if (cleaned.startsWith("+254")) {
    return "0" + cleaned.slice(4);
  }

  // If already starts with 0 and valid length, return as is
  if (cleaned.startsWith("0") && cleaned.length >= 10) {
    return cleaned;
  }

  // Handle other formats
  // If starts with 254 (without +)
  if (cleaned.startsWith("254") && cleaned.length >= 12) {
    return "0" + cleaned.slice(3);
  }

  // If starts with international format like 011254...
  if (cleaned.startsWith("011254") && cleaned.length >= 13) {
    return "0" + cleaned.slice(5);
  }

  // Fallback: return original cleaned number
  return cleaned;
}

// Enhanced version with more features
export function formatPhoneNumber(
  phone?: string | null,
  options: {
    format?: "local" | "international" | "e164";
    countryCode?: string;
    allowInvalid?: boolean;
  } = {},
): string {
  const {
    format = "local",
    countryCode = "254",
    allowInvalid = false,
  } = options;

  // Handle undefined/null/empty
  if (!phone) {
    return allowInvalid ? "" : "";
  }

  const phoneStr = String(phone).trim();

  // If empty after trimming
  if (phoneStr.length === 0) {
    return "";
  }

  try {
    // Clean the phone number (remove all non-digits except +)
    let cleaned = phoneStr.replace(/[^\d\+]/g, "");

    // If empty after cleaning
    if (cleaned.length === 0) {
      return allowInvalid ? phoneStr : "";
    }

    // Convert to local format (Kenya specific)
    if (format === "local") {
      return convertToLocalPhoneEnhanced(cleaned, countryCode);
    }

    // Convert to international format
    if (format === "international") {
      return convertToInternational(cleaned, countryCode);
    }

    // Convert to E.164 format
    if (format === "e164") {
      return convertToE164(cleaned, countryCode);
    }

    return cleaned;
  } catch (error) {
    console.error("Phone formatting error:", error);
    return allowInvalid ? phoneStr : "";
  }
}

// Enhanced local phone converter
function convertToLocalPhoneEnhanced(
  phone: string,
  countryCode: string,
): string {
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, "");

  // Kenya specific conversions
  if (countryCode === "254") {
    // Already in local format (starts with 0)
    if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
      return digitsOnly;
    }

    // International format with +254
    if (digitsOnly.startsWith("254") && digitsOnly.length === 12) {
      return "0" + digitsOnly.slice(3);
    }

    // Just 254 (without +) but longer
    if (digitsOnly.startsWith("254") && digitsOnly.length > 12) {
      const nationalNumber = digitsOnly.slice(3);
      if (nationalNumber.length === 9) {
        return "0" + nationalNumber;
      }
    }

    // Try to extract valid Kenyan number
    const kenyanRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    const match = digitsOnly.match(kenyanRegex);
    if (match) {
      return "0" + match[1];
    }
  }

  // Generic fallback for other countries
  if (digitsOnly.startsWith(countryCode)) {
    return "0" + digitsOnly.slice(countryCode.length);
  }

  // If starts with + and country code
  if (phone.startsWith(`+${countryCode}`)) {
    return "0" + digitsOnly.slice(countryCode.length);
  }

  // Return cleaned digits if it looks like a local number
  if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
    return digitsOnly;
  }

  return phone;
}

// Convert to international format
function convertToInternational(phone: string, countryCode: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  // If already in international format
  if (digitsOnly.startsWith(countryCode)) {
    return `+${digitsOnly}`;
  }

  // If in local format (starts with 0)
  if (digitsOnly.startsWith("0")) {
    return `+${countryCode}${digitsOnly.slice(1)}`;
  }

  // If just the national number
  if (digitsOnly.length >= 7 && digitsOnly.length <= 10) {
    return `+${countryCode}${digitsOnly}`;
  }

  return `+${digitsOnly}`;
}

// Convert to E.164 format
function convertToE164(phone: string, countryCode: string): string {
  const digitsOnly = phone.replace(/\D/g, "");

  // Remove leading zeros
  const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");

  // Add country code if missing
  if (!withoutLeadingZeros.startsWith(countryCode)) {
    return `+${countryCode}${withoutLeadingZeros}`;
  }

  return `+${withoutLeadingZeros}`;
}

// Validation functions
export function isValidPhoneNumber(phone?: string | null): boolean {
  if (!phone) return false;

  const phoneStr = String(phone);
  const digitsOnly = phoneStr.replace(/\D/g, "");

  // Kenyan phone validation (for example)
  const kenyanRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;

  // Generic validation (7-15 digits)
  const genericRegex = /^[\d\+][\d\s\-\(\)]{7,15}$/;

  return kenyanRegex.test(digitsOnly) || genericRegex.test(phoneStr);
}

export function getPhoneNumberParts(phone?: string | null): {
  countryCode: string;
  nationalNumber: string;
  isValid: boolean;
} {
  const defaultResult = {
    countryCode: "",
    nationalNumber: "",
    isValid: false,
  };

  if (!phone) return defaultResult;

  const phoneStr = String(phone).trim();
  const digitsOnly = phoneStr.replace(/\D/g, "");

  // Kenyan numbers
  if (digitsOnly.startsWith("254") && digitsOnly.length === 12) {
    return {
      countryCode: "254",
      nationalNumber: digitsOnly.slice(3),
      isValid: true,
    };
  }

  // Local Kenyan numbers
  if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
    return {
      countryCode: "254",
      nationalNumber: digitsOnly.slice(1),
      isValid: true,
    };
  }

  // International format with +
  if (phoneStr.startsWith("+")) {
    // Extract country code (1-3 digits after +)
    const match = phoneStr.match(/^\+\d{1,3}/);
    if (match) {
      const countryCode = match[0].slice(1);
      const nationalNumber = digitsOnly.slice(countryCode.length);
      return {
        countryCode,
        nationalNumber,
        isValid: nationalNumber.length >= 7,
      };
    }
  }

  return defaultResult;
}

// Usage examples
export const phoneUtils = {
  toLocal: (phone?: string) => formatPhoneNumber(phone, { format: "local" }),
  toInternational: (phone?: string) =>
    formatPhoneNumber(phone, { format: "international" }),
  toE164: (phone?: string) => formatPhoneNumber(phone, { format: "e164" }),
  isValid: isValidPhoneNumber,
  getParts: getPhoneNumberParts,
  clean: (phone?: string) => phone?.replace(/\D/g, "") || "",
};
