// lib/scrapers/escort254.parser.ts
export interface ScrapedEscort {
  name: string;
  profileUrl: string;
  previewPhoto: string;
  telephone: string;
  location: string;
  description: string;
  isVip: boolean;
  isOffline: boolean;
  images?: string[];
  countyName: string;
}

export class Escort254Parser {
  /**
   * Parse county name from location text
   */
  static parseCountyName(locationText: string): string {
    // First, check for explicit county mention
    const countyMatch = locationText.match(/(\w+\s?\w*)\s+County/i);
    if (countyMatch) {
      return countyMatch[1].trim();
    }

    // Map of areas to counties based on your database
    const areaCountyMap: Record<string, string> = {
      // Nairobi
      kilimani: "Nairobi City",
      westlands: "Nairobi City",
      lavington: "Nairobi City",
      kileleshwa: "Nairobi City",
      kasarani: "Nairobi City",
      embakasi: "Nairobi City",
      ruiru: "Kiambu",
      juja: "Kiambu",
      thika: "Kiambu",
      kiambu: "Kiambu",
      kikuyu: "Kiambu",
      limuru: "Kiambu",
      ngong: "Kajiado",
      kiserian: "Kajiado",
      rongai: "Kajiado",
      kitengela: "Kajiado",
      mombasa: "Mombasa",
      nyali: "Mombasa",
      bamburi: "Mombasa",
      mtwapa: "Kilifi",
      kilifi: "Kilifi",
      ukunda: "Kwale",
      diani: "Kwale",
      nakuru: "Nakuru",
      lanet: "Nakuru",
      gilgil: "Nakuru",
      naivasha: "Nakuru",
      molo: "Nakuru",
      kisumu: "Kisumu",
      eldoret: "Uasin Gishu",
      kisii: "Kisii",
      "kisii town": "Kisii",
      bungoma: "Bungoma",
      webuye: "Bungoma",
      kimilili: "Bungoma",
      kitale: "Trans Nzoia",
      machakos: "Machakos",
      athiriver: "Machakos",
      kajiado: "Kajiado",
      narok: "Narok",
      nyeri: "Nyeri",
      meru: "Meru",
      kericho: "Kericho",
      kakamega: "Kakamega",
      siaya: "Siaya",
      homabay: "Homa Bay",
      migori: "Migori",
      busia: "Busia",
      vihiga: "Vihiga",
      "trans nzoia": "Trans Nzoia",
      "uasin gishu": "Uasin Gishu",
    };

    const locationLower = locationText.toLowerCase();

    for (const [area, county] of Object.entries(areaCountyMap)) {
      if (locationLower.includes(area.toLowerCase())) {
        return county;
      }
    }

    return "Nairobi City"; // Default
  }

  /**
   * Extract town and estate from location string
   */
  static parseLocationDetails(locationText: string): {
    town: string;
    estate: string;
    region: string;
  } {
    // Remove "County" part
    let cleanLocation = locationText.replace(/\s+County$/, "").trim();

    // Split by commas
    const parts = cleanLocation
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);

    let town = "";
    let estate = "";
    let region = "";

    if (parts.length === 1) {
      // Single part - could be town or estate
      town = parts[0];
      region = parts[0];
    } else if (parts.length === 2) {
      // Two parts - likely [estate, town] or [town, region]
      if (parts[1].includes("County") || parts[1].includes("Nairobi")) {
        town = parts[0];
        region = parts[1];
      } else {
        estate = parts[0];
        town = parts[1];
        region = parts[1];
      }
    } else {
      // Three or more parts
      estate = parts[0];
      town = parts[1];
      region = parts[2];
    }

    // Clean up Nairobi references
    if (region.toLowerCase().includes("nairobi")) {
      region = "Nairobi City";
    }

    return { town, estate, region };
  }

  /**
   * Clean and format phone number
   */
  static formatPhoneNumber(phone: string): string {
    if (!phone || phone === "Offline") return "";

    // Remove all non-numeric except +
    let cleaned = phone.replace(/[^\d+]/g, "");

    // Handle Kenyan numbers
    if (cleaned.startsWith("0")) {
      cleaned = "+254" + cleaned.substring(1);
    } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
      cleaned = "+254" + cleaned;
    } else if (cleaned.startsWith("254")) {
      cleaned = "+" + cleaned;
    } else if (!cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }

    // Validate length for Kenyan numbers
    if (cleaned.startsWith("+254") && cleaned.length !== 13) {
      return ""; // Invalid Kenyan number
    }

    return cleaned;
  }

  /**
   * Extract services from description
   */
  static parseServices(description: string): {
    practices: string[];
    massage: string[];
    extraServices: string[];
  } {
    const practices: string[] = [];
    const massage: string[] = [];
    const extraServices: string[] = [];

    const descLower = description.toLowerCase();

    // Massage related
    const massageTerms = [
      "massage",
      "nuru",
      "sweedish",
      "swedish",
      "erotic",
      "body rub",
      "body massage",
      "full body massage",
      "sensual massage",
      "relaxing massage",
    ];
    massageTerms.forEach((term) => {
      if (descLower.includes(term)) {
        massage.push(term);
      }
    });

    // Practices
    const practiceTerms = [
      "anal",
      "bj",
      "blowjob",
      "blow job",
      "threesome",
      "threesum",
      "69",
      "bdsm",
      "pegging",
      "rimming",
      "cim",
      "facial",
      "cowgirl",
      "doggy",
      "missionary",
      "69 position",
    ];
    practiceTerms.forEach((term) => {
      if (descLower.includes(term)) {
        practices.push(term);
      }
    });

    // Extra services
    const extraTerms = [
      "video call",
      "phone sex",
      "nudes",
      "gf experience",
      "girlfriend experience",
      "sleepover",
      "overnight",
      "dinner date",
      "travel companion",
      "escort",
      "incall",
      "outcall",
    ];
    extraTerms.forEach((term) => {
      if (descLower.includes(term)) {
        extraServices.push(term);
      }
    });

    return { practices, massage, extraServices };
  }
}
