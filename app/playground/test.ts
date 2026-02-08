export function formatKenyanPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw new Error("Phone number is required and must be a string");
  }

  // Remove all spaces, dashes, parentheses, and other separators
  const cleaned = phoneNumber.trim().replace(/[\s\-().+]/g, "");

  // Handle empty string after cleaning
  if (!cleaned) {
    throw new Error("Phone number cannot be empty");
  }

  let digitsOnly = cleaned;

  // If it starts with +, remove it for processing
  if (phoneNumber.startsWith("+")) {
    digitsOnly = cleaned;
  }

  let localNumber: string;

  // Handle different formats
  if (digitsOnly.startsWith("254") && digitsOnly.length === 12) {
    // Format: 254701694004 (international without +)
    localNumber = "0" + digitsOnly.slice(3);
  } else if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
    // Format: 0701694004 (local format)
    localNumber = digitsOnly;
  } else if (digitsOnly.match(/^[17]\d{8}$/)) {
    // Format: 701694004 (9 digits, no leading zero)
    localNumber = "0" + digitsOnly;
  } else if (digitsOnly.length === 9 && /^\d{9}$/.test(digitsOnly)) {
    // Any 9-digit number (e.g., 701694004)
    localNumber = "0" + digitsOnly;
  } else {
    // Check for common mistakes
    if (digitsOnly.length < 9 || digitsOnly.length > 12) {
      throw new Error(
        `Invalid phone number length. Must be 9-12 digits. Got: ${digitsOnly.length} digits`,
      );
    }

    if (!/^\d+$/.test(digitsOnly)) {
      throw new Error(
        `Phone number must contain only digits after removing spaces/symbols. Got: ${phoneNumber}`,
      );
    }

    // Try to infer format
    if (digitsOnly.length === 10 && digitsOnly.startsWith("0")) {
      localNumber = digitsOnly;
    } else if (digitsOnly.length === 9) {
      localNumber = "0" + digitsOnly;
    } else {
      throw new Error(
        `Invalid Kenyan phone number format. Received: ${phoneNumber}\n` +
          `Accepted formats: 0701694004 (10 digits), 701694004 (9 digits), or 254701694004 (12 digits)`,
      );
    }
  }

  // Validate the local number format
  if (!/^0[17]\d{8}$/.test(localNumber)) {
    throw new Error(
      `Invalid Kenyan phone number. Must start with 07 (mobile) or 01 (landline). ` +
        `Got: ${localNumber}`,
    );
  }

  // Format with spaces for display: 0701 694 004
  return `${localNumber.slice(0, 4)} ${localNumber.slice(4, 7)} ${localNumber.slice(7)}`;
}

// Alternative: More lenient version that handles edge cases
export function formatKenyanPhoneNumberLax(phoneNumber: string): string {
  if (!phoneNumber) return "";

  try {
    return formatKenyanPhoneNumber(phoneNumber);
  } catch {
    // Return the original or a cleaned version
    const cleaned = phoneNumber.replace(/[\s\-().+]/g, "");

    // If it looks like a valid 9-10 digit number, try to format it
    if (/^\d{9,10}$/.test(cleaned)) {
      const localNum = cleaned.length === 9 ? "0" + cleaned : cleaned;
      if (/^0[17]\d{8}$/.test(localNum)) {
        return `${localNum.slice(0, 4)} ${localNum.slice(4, 7)} ${localNum.slice(7)}`;
      }
    }

    // Return original if we can't format it
    return phoneNumber;
  }
}

// Function to normalize to standard local format (0701694004)
export function toStandardLocalFormat(phoneNumber: string): string {
  const formatted = formatKenyanPhoneNumber(phoneNumber);
  return formatted.replace(/\s/g, "");
}

// Function to normalize to international format (+254701694004)
export function toInternationalFormat(phoneNumber: string): string {
  const localNumber = toStandardLocalFormat(phoneNumber);
  return "+254" + localNumber.slice(1);
}

// Function to check if a number is valid (doesn't throw)
export function isValidKenyanPhoneNumber(phoneNumber: string): boolean {
  try {
    formatKenyanPhoneNumber(phoneNumber);
    return true;
  } catch {
    return false;
  }
}

// Function to extract the service provider
export function getPhoneProvider(phoneNumber: string): string {
  try {
    const localNumber = toStandardLocalFormat(phoneNumber);
    const prefix = localNumber.slice(0, 3);

    const providers: { [key: string]: string } = {
      "070": "Safaricom",
      "071": "Safaricom",
      "072": "Safaricom",
      "074": "Safaricom",
      "075": "Airtel",
      "076": "Airtel",
      "077": "Telkom",
      "078": "Airtel",
      "079": "Safaricom",
      "010": "Telkom",
      "011": "Telkom",
    };

    return providers[prefix] || "Unknown";
  } catch {
    return "Invalid";
  }
}

// Examples of accepted formats:
const examples = [
  "0701694004", // ✓ Local format
  "701694004", // ✓ Without leading zero
  "254701694004", // ✓ International without +
  " 0701 694 004 ", // ✓ With spaces
  "0701-694-004", // ✓ With dashes
  "(0701)694004", // ✓ With parentheses
];

console.log("Formatting examples:");
examples.forEach((phone) => {
  try {
    const result = formatKenyanPhoneNumber(phone);
    console.log(`${phone} → ${result} (${getPhoneProvider(phone)})`);
  } catch (error) {
    console.error(`${phone} → Error: ${(error as Error).message}`);
  }
});
