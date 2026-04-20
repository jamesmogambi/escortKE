// lib/scrapers/nairobihot.scraper.ts
import * as cheerio from "cheerio";

export interface NairobiHotEscort {
  id: string;
  name: string;
  username: string;
  previewPhoto: string;
  telephone: string;
  age: string;
  description: string;
  location: string;
  county: string;
  town: string;
  isVip: boolean;
  profileUrl: string;
  images: string[];
  services: string[];
  about: string;
  nationality: string;
  gender: string;
  sexualOrientation: string;
  incallRate: string;
  outcallRate: string;
}

export class NairobiHotScraper {
  private $: cheerio.CheerioAPI;
  private html: string;

  constructor(html: string) {
    this.html = html;
    this.$ = cheerio.load(html);
  }

  static hasEscorts($: cheerio.CheerioAPI): boolean {
    const profileCount = $(".profiles-listing .profile-preview").length;
    const altProfileCount = $(".profile-preview").length;
    return profileCount > 0 || altProfileCount > 0;
  }

  // Clean and validate age
  private cleanAge(ageText: string): string {
    if (!ageText || ageText === "0" || ageText === "N/A") return "";

    // Extract only numbers from the string
    const numbers = ageText.match(/\d+/g);
    if (!numbers) return "";

    // Get the first number found (usually the age)
    let age = parseInt(numbers[0], 10);

    // Validate age range (18-65 for escorts)
    if (isNaN(age) || age < 18 || age > 65) {
      console.log(`⚠️ Invalid age detected: "${ageText}" -> ignoring`);
      return "";
    }

    return age.toString();
  }

  extractEscortFromCard(cardElement: any): Partial<NairobiHotEscort> | null {
    const $card = this.$(cardElement);

    const profileUrl = $card.find(".profile-image a").attr("href");
    if (!profileUrl) return null;

    const username = profileUrl.split("/author/")[1]?.replace("/", "") || "";
    const name = $card.find(".profile-text h5 a").text().trim();
    const phoneText = $card.find(".profile-text h3").text();
    const telephone = phoneText.replace("Phone:", "").trim();
    const description = $card.find(".profile-text p").text().trim();

    // Extract age from description with better regex
    let age = "";
    const ageMatch = description.match(
      /\b(\d{1,2})\s*(?:years? old|yrs?|years? of age)\b/i,
    );
    if (ageMatch) {
      age = this.cleanAge(ageMatch[1]);
    }

    // Extract preview photo
    let previewPhoto = "";
    const imgElement = $card.find(".profile-image img");
    if (imgElement.length) {
      previewPhoto =
        imgElement.attr("data-src") || imgElement.attr("src") || "";
      if (previewPhoto && previewPhoto.startsWith("//")) {
        previewPhoto = "https:" + previewPhoto;
      }
    }

    // Extract location
    let location = "";
    let town = "";
    let county = "Nairobi";

    const locationMatch = description.match(/from\s+([^.]+)/i);
    if (locationMatch) {
      location = locationMatch[1].trim();
      if (location.includes("Nairobi")) {
        county = "Nairobi";
        town = location.replace("Nairobi", "").trim();
      } else if (location.includes("Kiambu")) {
        county = "Kiambu";
        town = location.replace("Kiambu", "").trim();
      } else if (location.includes("Mombasa")) {
        county = "Mombasa";
        town = location.replace("Mombasa", "").trim();
      } else {
        town = location.split(" ")[0];
      }
    }

    const isVip = $card.find(".badge").text().trim() === "VIP";

    return {
      id: username,
      name: name || username,
      username,
      telephone,
      previewPhoto,
      age,
      description,
      location,
      county,
      town,
      isVip,
      profileUrl,
    };
  }

  extractAllEscortsFromPage(): Partial<NairobiHotEscort>[] {
    const escorts: Partial<NairobiHotEscort>[] = [];

    let profileCards = this.$(".profiles-listing .profile-preview");
    if (profileCards.length === 0) {
      profileCards = this.$(".profile-preview");
    }
    if (profileCards.length === 0) {
      profileCards = this.$(".column.threecol");
    }

    console.log(`Found ${profileCards.length} profile cards on page`);

    profileCards.each((_, element) => {
      const escort = this.extractEscortFromCard(element);
      if (escort && escort.name) {
        escorts.push(escort);
      }
    });

    return escorts;
  }

  async extractFullProfileDetails(
    profileHtml: string,
  ): Promise<Partial<NairobiHotEscort>> {
    const $profile = cheerio.load(profileHtml);
    const details: Partial<NairobiHotEscort> = {};

    // Extract name
    const nameElement = $profile(".full-profile .section-title h2").first();
    if (nameElement.length) {
      details.name = nameElement
        .text()
        .replace("Name:", "")
        .replace("Offline", "")
        .replace("Online", "")
        .trim();
    }

    // Extract phone
    const phoneElement = $profile(".full-profile .section-title h3").first();
    if (phoneElement.length) {
      const phoneText = phoneElement.text().replace("Phone:", "").trim();
      const phoneMatch = phoneText.match(/(\d{10,12})/);
      if (phoneMatch) details.telephone = phoneMatch[1];
    }

    // Extract age with validation
    let ageText = "";
    $profile(".profile-fields ul li").each((_, el) => {
      const label = $profile(el).find("span:first-child").text().trim();
      const value = $profile(el).find("span:last-child").text().trim();
      if (label === "Age") {
        ageText = value;
      }
    });
    details.age = this.cleanAge(ageText);

    // Extract gender
    $profile(".profile-fields ul li").each((_, el) => {
      const label = $profile(el).find("span:first-child").text().trim();
      const value = $profile(el).find("span:last-child").text().trim();
      if (label === "Gender") {
        details.gender = value;
      }
      if (label === "Sexual Orientation") {
        details.sexualOrientation = value;
      }
      if (label === "Nationality") {
        details.nationality = value;
      }
      if (label === "County") {
        details.county = value;
      }
      if (label === "City / Town") {
        details.town = value;
      }
    });

    // Extract all images
    const images: string[] = [];
    $profile(".profile-image img, .gallery img").each((_, el) => {
      let src = $profile(el).attr("data-src") || $profile(el).attr("src") || "";
      if (
        src &&
        !src.includes("lazy_placeholder") &&
        !src.includes("gravatar")
      ) {
        if (src.startsWith("//")) src = "https:" + src;
        images.push(src);
      }
    });
    details.images = images;
    details.previewPhoto = images[0] || details.previewPhoto;

    // Extract services
    const services: string[] = [];
    $profile(
      ".profile-fields ul li.service-list span:last-child a, .sid_profile_list ul li:contains('Services') span:last-child a",
    ).each((_, el) => {
      const service = $profile(el).text().trim();
      if (service) services.push(service);
    });
    details.services = services;

    // Extract about
    let about = "";
    $profile(".profile-description p, .about-text").each((_, el) => {
      about += $profile(el).text().trim() + " ";
    });
    details.about = about.trim();

    // Extract rates
    $profile(".profile-fields ul li").each((_, el) => {
      const html = $profile(el).html() || "";
      if (html.includes("Incalls per hour from")) {
        details.incallRate = $profile(el).find(".text-secondary").text().trim();
      }
      if (html.includes("Outcalls per hour from")) {
        details.outcallRate = $profile(el)
          .find(".text-secondary")
          .text()
          .trim();
      }
    });

    return details;
  }
}
