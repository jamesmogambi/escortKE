// lib/scrapers/escort254.scraper.ts
import * as cheerio from "cheerio";
// import { Escort254Parser, ScrapedEscort } from "./escort254.parser";
import { EscortDatabaseService } from "./escort-db.service";
import { Escort254Parser, ScrapedEscort } from "./escort254.parser";

export class Escort254Scraper {
  private $: cheerio.CheerioAPI;

  constructor(html: string) {
    this.$ = cheerio.load(html);
  }

  /**
   * Extract all escort cards from the page
   */
  extractAllEscorts(): ScrapedEscort[] {
    const escorts: ScrapedEscort[] = [];

    // Find all escort cards
    this.$(".col-sm-6.col-md-3.mb-5").each((_, element) => {
      const card = this.$(element);

      // Skip "Join Us" cards
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
   * Parse individual escort card
   */
  private parseEscortCard(card: cheerio.Cheerio<any>): ScrapedEscort | null {
    try {
      // Get profile link and name
      const profileLink = card.find("h5 a");
      const profileUrl = profileLink.attr("href") || "";
      const name =
        profileLink.find('span[itemprop="name"]').text().trim() ||
        profileLink.text().trim();

      // Quick check for male indicators in name
      const nameLower = name.toLowerCase();
      if (
        nameLower.includes("male") ||
        nameLower.includes("boy") ||
        nameLower.includes("guy") ||
        nameLower.includes("stud")
      ) {
        return null;
      }

      // Get image
      const img = card.find("img.card-img-top");
      const previewPhoto = img.attr("src") || "";

      // Get description from meta tag
      const description =
        card.find('meta[itemprop="description"]').attr("content") || "";

      // Quick check for male indicators in description
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

      // Get phone number
      let telephone = "";
      const phoneSpan = card.find(
        "p.mb-0.small i.bi.bi-phone + span, p.mb-0.small span",
      );
      if (phoneSpan.length) {
        telephone = phoneSpan.text().trim();
      }

      // If not found, check the button
      if (!telephone) {
        const callBtn = card.find('a[id="call-btn"] span');
        telephone = callBtn.text().trim();
      }

      // Skip if no phone or placeholder phone
      if (
        !telephone ||
        telephone === "Offline" ||
        telephone.includes("111111111")
      ) {
        return null;
      }

      // Check if offline
      const isOffline =
        card.find('span.btn-secondary, span:contains("Offline")').length > 0;

      // Get location
      const locationSpan = card.find("p.small i.bi.bi-geo-alt + span");
      let location = locationSpan.text().trim();

      // If location not found, try alternative selector
      if (!location) {
        location = card.find("p.small span:not([class])").text().trim();
      }

      // Skip if no location
      if (!location) {
        return null;
      }

      // Check VIP status
      const isVip =
        card.find('.card-notify-badge:contains("VIP Escort")').length > 0;

      // Parse county from location
      const countyName = Escort254Parser.parseCountyName(location);

      // Format phone number
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
   * Find and process pagination
   */
  static getNextPageUrl(
    $: cheerio.CheerioAPI,
    currentUrl: string,
  ): string | null {
    // Look for pagination links
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
