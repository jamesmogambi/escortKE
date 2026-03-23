// // lib/scrapers/escort254.scraper.ts
// import * as cheerio from "cheerio";
// // import { Escort254Parser, ScrapedEscort } from "./escort254.parser";
// import { EscortDatabaseService } from "./escort-db.service";
// import { Escort254Parser, ScrapedEscort } from "./escort254.parser";

// export class Escort254Scraper {
//   private $: cheerio.CheerioAPI;

//   constructor(html: string) {
//     this.$ = cheerio.load(html);
//   }

//   /**
//    * Extract all escort cards from the page
//    */
//   extractAllEscorts(): ScrapedEscort[] {
//     const escorts: ScrapedEscort[] = [];

//     // Find all escort cards
//     this.$(".col-sm-6.col-md-3.mb-5").each((_, element) => {
//       const card = this.$(element);

//       // Skip "Join Us" cards
//       if (
//         card.text().includes("Join Us") ||
//         card.find('a[href*="join-us"]').length
//       ) {
//         return;
//       }

//       const escort = this.parseEscortCard(card);
//       if (escort) {
//         escorts.push(escort);
//       }
//     });

//     return escorts;
//   }

//   /**
//    * Parse individual escort card
//    */
//   private parseEscortCard(card: cheerio.Cheerio<any>): ScrapedEscort | null {
//     try {
//       // Get profile link and name
//       const profileLink = card.find("h5 a");
//       const profileUrl = profileLink.attr("href") || "";
//       const name =
//         profileLink.find('span[itemprop="name"]').text().trim() ||
//         profileLink.text().trim();

//       // Quick check for male indicators in name
//       const nameLower = name.toLowerCase();
//       if (
//         nameLower.includes("male") ||
//         nameLower.includes("boy") ||
//         nameLower.includes("guy") ||
//         nameLower.includes("stud")
//       ) {
//         return null;
//       }

//       // Get image
//       const img = card.find("img.card-img-top");
//       const previewPhoto = img.attr("src") || "";

//       // Get description from meta tag
//       const description =
//         card.find('meta[itemprop="description"]').attr("content") || "";

//       // Quick check for male indicators in description
//       const descLower = description.toLowerCase();
//       if (
//         (descLower.includes("male escort") ||
//           descLower.includes("ladies only") ||
//           descLower.includes("women only")) &&
//         !descLower.includes("female") &&
//         !descLower.includes("girl")
//       ) {
//         return null;
//       }

//       // Get phone number
//       let telephone = "";
//       const phoneSpan = card.find(
//         "p.mb-0.small i.bi.bi-phone + span, p.mb-0.small span",
//       );
//       if (phoneSpan.length) {
//         telephone = phoneSpan.text().trim();
//       }

//       // If not found, check the button
//       if (!telephone) {
//         const callBtn = card.find('a[id="call-btn"] span');
//         telephone = callBtn.text().trim();
//       }

//       // Skip if no phone or placeholder phone
//       if (
//         !telephone ||
//         telephone === "Offline" ||
//         telephone.includes("111111111")
//       ) {
//         return null;
//       }

//       // Check if offline
//       const isOffline =
//         card.find('span.btn-secondary, span:contains("Offline")').length > 0;

//       // Get location
//       const locationSpan = card.find("p.small i.bi.bi-geo-alt + span");
//       let location = locationSpan.text().trim();

//       // If location not found, try alternative selector
//       if (!location) {
//         location = card.find("p.small span:not([class])").text().trim();
//       }

//       // Skip if no location
//       if (!location) {
//         return null;
//       }

//       // Check VIP status
//       const isVip =
//         card.find('.card-notify-badge:contains("VIP Escort")').length > 0;

//       // Parse county from location
//       const countyName = Escort254Parser.parseCountyName(location);

//       // Format phone number
//       telephone = Escort254Parser.formatPhoneNumber(telephone);

//       return {
//         name,
//         profileUrl: profileUrl.startsWith("http")
//           ? profileUrl
//           : `https://escort254.com${profileUrl}`,
//         previewPhoto: previewPhoto.startsWith("http")
//           ? previewPhoto
//           : `https://escort254.com${previewPhoto}`,
//         telephone,
//         location,
//         description,
//         isVip,
//         isOffline,
//         countyName,
//         images: previewPhoto ? [previewPhoto] : [],
//       };
//     } catch (error) {
//       console.error("Error parsing escort card:", error);
//       return null;
//     }
//   }

//   /**
//    * Find and process pagination
//    */
//   static getNextPageUrl(
//     $: cheerio.CheerioAPI,
//     currentUrl: string,
//   ): string | null {
//     // Look for pagination links
//     const nextSelectors = [
//       'a:contains("Next")',
//       'a:contains("»")',
//       "a.pagination-next",
//       ".next a",
//       'a[rel="next"]',
//       '.pagination .page-item:last-child a:not([aria-label="Previous"])',
//     ];

//     for (const selector of nextSelectors) {
//       const nextLink = $(selector);
//       if (nextLink.length) {
//         const href = nextLink.attr("href");
//         if (href && href !== "#" && href !== "") {
//           return href.startsWith("http")
//             ? href
//             : `https://escort254.com${href}`;
//         }
//       }
//     }

//     return null;
//   }

//   /**
//    * Check if page has any escorts
//    */
//   static hasEscorts($: cheerio.CheerioAPI): boolean {
//     return $(".col-sm-6.col-md-3.mb-5").length > 0;
//   }
// }

// lib/scrapers/escort254.scraper.ts
import * as cheerio from "cheerio";
import { Escort254Parser, ScrapedEscort } from "./escort254.parser";

// Extended interface for profile-level data
// export interface ScrapedProfileData {
//   // Basic Info
//   name: string;
//   previewPhoto: string;
//   telephone: string | null;
//   whatsappPhone?: string | null; // same as telephone if available
//   images: string[];
//   about: string;
//   age?: string;
//   gender?: "girl" | "boy" | "transgender" | "non-binary" | "other";

//   // Location (string-based for now; will be resolved to ObjectIds later)
//   locationTown: string; // e.g., "Nyali"
//   countyName: string | null; // e.g., "Mombasa"
//   regionName: string | null; // same as town (we'll use it as region)

//   // Services / Practices
//   practices: string[]; // from services list

//   // Physical Attributes
//   ethnicity?: string; // skin color
//   hairColor?: string;
//   breastSize?: string;
//   bodyType?: string; // can be stored in `character` or `categories`
//   smoking?: boolean | string; // e.g., "No" -> false

//   // Availability
//   availability?: string[]; // e.g., ["incall", "outcall"]

//   // Status
//   isOffline: boolean;
//   isVip?: boolean; // from card; not on profile page, but can be false

//   // Raw fields we may not store but are useful
//   height?: string;
//   hairLength?: string;

//   // Additional extracted data
//   attributes: Record<string, string>; // for any extra attributes not mapped
// }
//
//

export interface ScrapedProfileData {
  // Basic Info
  name: string;
  previewPhoto: string;
  telephone: string | null;
  whatsappPhone?: string | null; // same as telephone if available
  images: string[];
  about: string;
  age?: string;
  gender?: "girl" | "boy" | "transgender" | "non-binary" | "other";

  // Location (string-based; will be resolved to ObjectIds later)
  locationTown: string; // e.g., "Nyali"
  countyName: string | null; // e.g., "Mombasa"
  regionName: string | null; // same as town (used as region name)

  // Services / Practices
  practices: string[]; // from services list

  // Physical Attributes
  ethnicity?: string; // skin color
  hairColor?: string;
  breastSize?: string; // e.g., "Medium (B)"
  bodyType?: string; // e.g., "Medium"
  smoking?: boolean; // true if "Yes", false if "No", undefined if missing

  // Availability
  availability?: string[]; // e.g., ["incall", "outcall"]

  // Status
  isOffline: boolean;
  isVip?: boolean; // from card (default false on profile)

  // Raw fields (useful but not always stored)
  height?: string;
  hairLength?: string;

  // Catch‑all for any unmapped attributes
  attributes: Record<string, string>;
}
export class Escort254Scraper {
  private $: cheerio.CheerioAPI;

  constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  /**
   * Extract all escort cards from the page (listing)
   */
  extractAllEscorts(): ScrapedEscort[] {
    const escorts: ScrapedEscort[] = [];

    this.$(".col-sm-6.col-md-3.mb-5").each((_, element) => {
      const card = this.$(element);

      if (
        card.text().includes("Join Us") ||
        card.find('a[href*="join-us"]').length
      ) {
        return;
      }

      const escort = this.parseEscortCard(card);
      if (escort) {
        escorts.push(escort);
      }
    });

    return escorts;
  }

  /**
   * Parse individual escort card (listing)
   */
  private parseEscortCard(card: cheerio.Cheerio<any>): ScrapedEscort | null {
    try {
      const profileLink = card.find("h5 a");
      const profileUrl = profileLink.attr("href") || "";
      const name =
        profileLink.find('span[itemprop="name"]').text().trim() ||
        profileLink.text().trim();

      const nameLower = name.toLowerCase();
      if (
        nameLower.includes("male") ||
        nameLower.includes("boy") ||
        nameLower.includes("guy") ||
        nameLower.includes("stud")
      ) {
        return null;
      }

      const img = card.find("img.card-img-top");
      const previewPhoto = img.attr("src") || "";

      const description =
        card.find('meta[itemprop="description"]').attr("content") || "";

      const descLower = description.toLowerCase();
      if (
        (descLower.includes("male escort") ||
          descLower.includes("ladies only") ||
          descLower.includes("women only")) &&
        !descLower.includes("female") &&
        !descLower.includes("girl")
      ) {
        return null;
      }

      let telephone = "";
      const phoneSpan = card.find(
        "p.mb-0.small i.bi.bi-phone + span, p.mb-0.small span",
      );
      if (phoneSpan.length) {
        telephone = phoneSpan.text().trim();
      }

      if (!telephone) {
        const callBtn = card.find('a[id="call-btn"] span');
        telephone = callBtn.text().trim();
      }

      if (
        !telephone ||
        telephone === "Offline" ||
        telephone.includes("111111111")
      ) {
        return null;
      }

      const isOffline =
        card.find('span.btn-secondary, span:contains("Offline")').length > 0;

      const locationSpan = card.find("p.small i.bi.bi-geo-alt + span");
      let location = locationSpan.text().trim();

      if (!location) {
        location = card.find("p.small span:not([class])").text().trim();
      }

      if (!location) {
        return null;
      }

      const isVip =
        card.find('.card-notify-badge:contains("VIP Escort")').length > 0;

      const countyName = Escort254Parser.parseCountyName(location);
      telephone = Escort254Parser.formatPhoneNumber(telephone);

      return {
        name,
        profileUrl: profileUrl.startsWith("http")
          ? profileUrl
          : `https://escort254.com${profileUrl}`,
        previewPhoto: previewPhoto.startsWith("http")
          ? previewPhoto
          : `https://escort254.com${previewPhoto}`,
        telephone,
        location,
        description,
        isVip,
        isOffline,
        countyName,
        images: previewPhoto ? [previewPhoto] : [],
      };
    } catch (error) {
      console.error("Error parsing escort card:", error);
      return null;
    }
  }

  /**
   * Parse an individual profile page (e.g., /profile/jawel)
   */
  // TODO:// parse profile page correctly
  static parseProfile(profileHtml: string): ScrapedProfileData | null {
    const $ = cheerio.load(profileHtml);

    try {
      // --- Basic Info ---
      const name =
        $("h1.h1-small").first().text().trim() || $("h1").first().text().trim();

      const mainImage =
        $('img.card-img-top[itemprop="image"]').attr("src") || "";
      const fullMainImage = mainImage.startsWith("http")
        ? mainImage
        : `https://escort254.com${mainImage}`;
      const images = [fullMainImage];

      // --- Phone & Offline ---
      let telephone: string | null = null;
      let isOffline = false;

      if (
        $(
          'span.btn-secondary:contains("Offline"), span.text-danger:contains("Offline")',
        ).length
      ) {
        isOffline = true;
      } else {
        const phoneText = $(
          'ul.list-inline li:contains("Phone:") span.text-primary',
        )
          .text()
          .trim();
        if (phoneText && phoneText !== "Offline") {
          telephone = Escort254Parser.formatPhoneNumber(phoneText);
        }
      }

      // --- Location ---
      const locationTown = $('li:contains("Location:") span.text-primary')
        .first()
        .text()
        .trim();
      const countyName = Escort254Parser.parseCountyName(locationTown);
      const regionName = locationTown;

      // --- Age & Height ---
      let age: string | undefined;
      const ageText = $('li:contains("Age:") span.text-primary')
        .first()
        .text()
        .trim();
      if (ageText) {
        const match = ageText.match(/(\d+)/);
        if (match) age = match[1];
      }
      const height =
        $('li:contains("Height:") span.text-primary').first().text().trim() ||
        undefined;

      // --- Description ---
      const about =
        $('.card-header:contains("About")')
          .closest(".card")
          .find(".card-body")
          .text()
          .trim() || $("div.card-body").eq(2).text().trim();

      // --- Services (Practices) ---
      const practices: string[] = [];
      $(".rounded.border.px-3.py-2.mb-3 .mb-2 a.h6").each((_, el) => {
        const service = $(el).text().trim();
        if (service) practices.push(service);
      });
      if (practices.length === 0) {
        $('.card-header:contains("Services")')
          .closest(".card")
          .find(".card-body a.h6")
          .each((_, el) => {
            const service = $(el).text().trim();
            if (service) practices.push(service);
          });
      }

      // --- Attributes Grid ---
      const extractAttribute = (label: string): string | undefined => {
        const element = $(
          `.rounded.border:contains("${label}") strong`,
        ).first();
        return element.length ? element.text().trim() : undefined;
      };

      const ethnicity = extractAttribute("Skin color");
      const hairColor = extractAttribute("Hair color");
      const hairLength = extractAttribute("Hair Length");
      const breastSize = extractAttribute("Breast size");
      const bodyType = extractAttribute("Body type");
      const availabilityText = extractAttribute("Availability");
      const smokingText = extractAttribute("Smoking");

      // Map availability to array
      const availability = availabilityText
        ? availabilityText.split(/\s+/).map((s) => s.toLowerCase())
        : undefined;

      // Smoking as boolean (true only if explicitly "Yes")
      const smoking = smokingText
        ? smokingText.toLowerCase() === "yes"
        : undefined;

      // Additional attributes (unmapped)
      const attributes: Record<string, string> = {};
      if (hairLength) attributes.hairLength = hairLength;
      if (bodyType) attributes.bodyType = bodyType;
      if (smokingText) attributes.smoking = smokingText;

      // --- Gender inference ---
      let gender: "girl" | "boy" | "transgender" | "non-binary" | "other" =
        "girl";
      const nameLower = name.toLowerCase();
      const aboutLower = about.toLowerCase();
      if (
        nameLower.includes("male") ||
        nameLower.includes("boy") ||
        nameLower.includes("man") ||
        aboutLower.includes("male escort") ||
        aboutLower.includes("trans") ||
        aboutLower.includes("ts")
      ) {
        gender =
          aboutLower.includes("trans") || aboutLower.includes("ts")
            ? "transgender"
            : "boy";
      }

      console.log("scraped data ==>", {
        name,
        previewPhoto: fullMainImage,
        telephone,
        whatsappPhone: telephone,
        images,
        about,
        age,
        gender,
        locationTown,
        countyName,
        regionName,
        practices,
        ethnicity,
        hairColor,
        breastSize, // maps directly to schema's breastSize
        bodyType,
        smoking,
        availability,
        isOffline,
        isVip: false, // not on profile page
        height,
        hairLength,
        attributes,
      });
      return {
        name,
        previewPhoto: fullMainImage,
        telephone,
        whatsappPhone: telephone,
        images,
        about,
        age,
        gender,
        locationTown,
        countyName,
        regionName,
        practices,
        ethnicity,
        hairColor,
        breastSize, // maps directly to schema's breastSize
        bodyType,
        smoking,
        availability,
        isOffline,
        isVip: false, // not on profile page
        height,
        hairLength,
        attributes,
      };
    } catch (error) {
      console.error("Error parsing profile:", error);
      return null;
    }
  }
  /**
   * Find and process pagination (static helper)
   */
  static getNextPageUrl(
    $: cheerio.CheerioAPI,
    currentUrl: string,
  ): string | null {
    const nextSelectors = [
      'a:contains("Next")',
      'a:contains("»")',
      "a.pagination-next",
      ".next a",
      'a[rel="next"]',
      '.pagination .page-item:last-child a:not([aria-label="Previous"])',
    ];

    for (const selector of nextSelectors) {
      const nextLink = $(selector);
      if (nextLink.length) {
        const href = nextLink.attr("href");
        if (href && href !== "#" && href !== "") {
          return href.startsWith("http")
            ? href
            : `https://escort254.com${href}`;
        }
      }
    }

    return null;
  }

  /**
   * Check if page has any escorts
   */
  static hasEscorts($: cheerio.CheerioAPI): boolean {
    return $(".col-sm-6.col-md-3.mb-5").length > 0;
  }
}
