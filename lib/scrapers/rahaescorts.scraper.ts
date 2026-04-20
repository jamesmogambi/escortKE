// lib/scrapers/rahaescorts.scraper.ts - Complete version with deduplication

import * as cheerio from "cheerio";

export interface RahaEscort {
  id: string;
  name: string;
  slug: string;
  labels: string[];
  age: string;
  telephone: string;
  whatsappPhone: string;
  images: string[];
  about: string;
  languages: string[];
  region: string;
  county: string;
  town: string;
  city: string;
  practices: string[];
  extraServices: string[];
  rates: Array<{ duration: string; incall: string; outcall: string }>;
  source: string;
  previewPhoto: string;
  profileUrl: string;
  location: string;
  isVip: boolean;
  isPremium: boolean;
  isNew: boolean;
  isVerified: boolean;
  gender: string;
  ethnicity: string;
  nationality: string;
  bustSize: string;
  sexualOrientation: string;
  availability: string;
}

export class RahaEscortsScraper {
  private $: cheerio.CheerioAPI;
  private html: string;

  constructor(html: string) {
    this.html = html;
    this.$ = cheerio.load(html);
  }

  static hasEscorts($: cheerio.CheerioAPI): boolean {
    return $(".girl").length > 0;
  }

  extractBasicInfoFromCard(cardElement: any): Partial<RahaEscort> | null {
    const $card = this.$(cardElement);

    const name = $card.find(".girl-name").text().trim();
    const location = $card.find(".girl-desc-location").text().trim();
    const imageUrl =
      $card.find("img.mobile-ready-img").attr("data-responsive-img-url") ||
      $card.find("img.mobile-ready-img").attr("src") ||
      "";
    const profileUrl = $card.find("a[title]").attr("href") || "";
    const phone =
      $card.find(".card-phone__link").text().trim() ||
      $card.find('a[href^="tel:"]').text().trim();

    const slug = profileUrl
      ? profileUrl.replace(/\/$/, "").split("/").pop()
      : "";

    const labels: string[] = [];
    const isVip = $card.find('.label:contains("VIP")').length > 0;
    const isPremium = $card.find('.label:contains("PREMIUM")').length > 0;
    const isNew = $card.find('.label:contains("NEW")').length > 0;
    const isVerified = $card.find('.label:contains("VERIFIED")').length > 0;

    if (isVip) labels.push("VIP");
    if (isPremium) labels.push("PREMIUM");
    if (isNew) labels.push("NEW");
    if (isVerified) labels.push("VERIFIED");

    return {
      name,
      location,
      previewPhoto: imageUrl,
      profileUrl,
      telephone: phone,
      slug,
      labels,
      isVip,
      isPremium,
      isNew,
      isVerified,
    };
  }

  extractAllEscortsFromPage(): Partial<RahaEscort>[] {
    const escorts: Partial<RahaEscort>[] = [];

    this.$(".girl").each((_, element) => {
      const escort = this.extractBasicInfoFromCard(element);
      if (escort && escort.name) {
        escorts.push(escort);
      }
    });

    return escorts;
  }

  private cleanAge(ageText: string): string {
    if (!ageText || ageText === "0" || ageText === "N/A") return "";

    const numbers = ageText.match(/\d+/g);
    if (!numbers) return "";

    let age = parseInt(numbers[0], 10);

    if (isNaN(age) || age < 18 || age > 65) {
      console.log(`⚠️ Invalid age detected: "${ageText}" -> ignoring`);
      return "";
    }

    return age.toString();
  }

  private cleanImageUrl(url: string): string {
    if (!url) return "";

    // Remove WordPress size parameters
    url = url.replace(/\?.*$/, "");
    url = url.replace(/-\d+x\d+\./g, ".");
    url = url.replace(/\?fit=\d+%2C\d+/, "");
    url = url.replace(/&ssl=1/, "");
    url = url.replace(/\?resize=\d+%2C\d+/, "");
    url = url.replace(/resize=\d+%2C\d+/, "");
    url = url.replace(/fit=\d+%2C\d+/, "");
    url = url.replace(/-\d+x\d+(?=\.)/g, "");

    // Remove WordPress.com CDN parameters
    url = url.replace(/https:\/\/i\d\.wp\.com\//, "https://");

    // Ensure HTTPS
    if (url.startsWith("//")) url = "https:" + url;

    // Remove trailing garbage
    url = url.split("#")[0].split("?")[0];

    return url;
  }

  private getImageFingerprint(url: string): string {
    // Create a unique fingerprint for each image
    const filename = url.split("/").pop() || url;
    // Remove size variations and extension
    return filename
      .replace(/-\d+x\d+/, "")
      .replace(/\.[^.]+$/, "")
      .toLowerCase();
  }

  private extractGender($profile: cheerio.CheerioAPI): string {
    // Method 1: Look for span with itemprop="gender"
    const genderSpan = $profile('.aboutme span[itemprop="gender"]');
    if (genderSpan.length) {
      const gender = genderSpan.text().trim();
      if (gender) return gender;
    }

    // Method 2: Look for pattern in the bold text of about me section
    const aboutBoldText = $profile(".aboutme b").first().text();
    const genderMatch = aboutBoldText.match(/\d+ year old (\w+) escort/i);
    if (genderMatch) {
      return genderMatch[1];
    }

    // Method 3: Look for gender pattern in the entire about section
    const aboutText = $profile(".aboutme").text();
    const genderPatterns = [
      { pattern: /(\bFemale\b)/i, gender: "Female" },
      { pattern: /(\bMale\b)/i, gender: "Male" },
      { pattern: /(\bTranssexual\b|\bShemale\b)/i, gender: "Transsexual" },
      { pattern: /(\bCouple\b)/i, gender: "Couple" },
      { pattern: /(\bGay\b)/i, gender: "Gay" },
    ];

    for (const { pattern, gender } of genderPatterns) {
      if (pattern.test(aboutText)) {
        return gender;
      }
    }

    return "Female";
  }

  async extractFullProfileDetails(
    profileHtml: string,
    county: string,
    region: string,
  ): Promise<Partial<RahaEscort>> {
    const $profile = cheerio.load(profileHtml);
    const details: Partial<RahaEscort> = {};

    // Extract name
    details.name = $profile('.profile-title[itemprop="name"]').text().trim();

    // Extract labels from profile page
    const labels: string[] = [];
    $profile(".girlsinglelabels span").each((_, el) => {
      const label = $profile(el).text().trim();
      if (label) labels.push(label);
    });
    details.labels = labels;
    details.isVip = labels.includes("VIP");
    details.isPremium = labels.includes("PREMIUM");
    details.isNew = labels.includes("NEW");
    details.isVerified = labels.includes("VERIFIED");

    // Extract age from profile header
    let ageText = "";
    $profile(".profile-header-name-info .section-box").each((_, el) => {
      const value = $profile(el).find(".valuecolumn").text().trim();
      const label = $profile(el).find("b").text().trim();
      if (label === "years" && value) {
        ageText = value;
      }
    });

    if (!ageText) {
      const aboutText = $profile(".aboutme").text();
      const ageMatch = aboutText.match(/(\d{1,2})\s*year old/i);
      if (ageMatch) ageText = ageMatch[1];
    }

    details.age = this.cleanAge(ageText);
    details.gender = this.extractGender($profile);

    console.log(
      `🚺 ${details.name}: Age ${details.age || "N/A"}, Gender ${details.gender}`,
    );

    // Extract telephone
    const phoneElement = $profile(".phone-box a");
    if (phoneElement.length) {
      details.telephone = phoneElement.text().trim();
    }

    // Extract WhatsApp
    const whatsappLink = $profile(".available-on a").attr("href");
    if (whatsappLink) {
      details.whatsappPhone = whatsappLink
        .replace(/^https:\/\/wa\.me\//, "")
        .split("?")[0];
    }

    // Extract images - WITH DEDUPLICATION
    const imageFingerprints = new Map<string, string>();

    const imageSelectors = [
      '.profile-img-thumb-wrapper a[itemprop="contentURL"]',
      ".profile-img-thumb-wrapper img",
      ".thumbs .profile-img-thumb img",
      ".profile-image img",
      ".gallery img",
    ];

    for (const selector of imageSelectors) {
      $profile(selector).each((_, el) => {
        let src =
          $profile(el).attr("href") ||
          $profile(el).attr("data-responsive-img-url") ||
          $profile(el).attr("data-original-url") ||
          $profile(el).attr("data-lazy-src") ||
          $profile(el).attr("src") ||
          "";

        if (
          src &&
          !src.includes("placeholder") &&
          !src.includes("lazy") &&
          !src.includes("gravatar")
        ) {
          if (src.startsWith("//")) src = "https:" + src;
          src = this.cleanImageUrl(src);

          if (src.startsWith("http")) {
            const fingerprint = this.getImageFingerprint(src);
            if (!imageFingerprints.has(fingerprint)) {
              imageFingerprints.set(fingerprint, src);
            }
          }
        }
      });
    }

    // Check for background images
    $profile("[style*='background-image']").each((_, el) => {
      const style = $profile(el).attr("style") || "";
      const bgMatch = style.match(/url\(['"]?([^'"\)]+)['"]?\)/);
      if (bgMatch && bgMatch[1]) {
        let bgUrl = bgMatch[1];
        if (bgUrl.startsWith("//")) bgUrl = "https:" + bgUrl;
        bgUrl = this.cleanImageUrl(bgUrl);
        if (bgUrl.startsWith("http") && !bgUrl.includes("placeholder")) {
          const fingerprint = this.getImageFingerprint(bgUrl);
          if (!imageFingerprints.has(fingerprint)) {
            imageFingerprints.set(fingerprint, bgUrl);
          }
        }
      }
    });

    details.images = Array.from(imageFingerprints.values());
    details.previewPhoto = details.images[0] || "";

    console.log(`📸 ${details.name}: ${details.images.length} unique images`);

    // Extract about text
    const aboutClone = $profile(".aboutme").clone();
    aboutClone.find("b").remove();
    details.about = aboutClone.text().replace(/\s+/g, " ").trim();

    // Extract languages
    const languages: string[] = [];
    $profile(
      '.girlinfo-section:has(h4:contains("Languages spoken")) .section-box',
    ).each((_, el) => {
      const lang = $profile(el).find("b").text().trim().replace(/:$/, "");
      if (lang) languages.push(lang);
    });
    details.languages = languages;

    // Extract estate and city
    $profile(".b-label").each((_, el) => {
      const label = $profile(el).text().trim();
      const value = $profile(el).parent().next(".valuecolumn").text().trim();
      if (label === "Estate / Area:") {
        details.city = value;
      }
    });

    // Extract profile metadata
    $profile(".section-box").each((_, el) => {
      const label = $profile(el).find("b").text().trim();
      const value = $profile(el).find(".valuecolumn").text().trim();

      if (label === "Ethnicity") details.ethnicity = value;
      if (label === "Nationality") details.nationality = value;
      if (label === "Bust size") details.bustSize = value;
      if (label === "Sexual orientation") details.sexualOrientation = value;
      if (label === "Availability") details.availability = value;
    });

    // Set region and county
    details.region = region;
    details.county = county;
    details.town = region;

    // Extract services/practices
    const practices: string[] = [];
    $profile(".services > div").each((_, el) => {
      let service = $profile(el).text().trim();
      service = service.replace(/^[^A-Za-z]+/, "");
      if (service) practices.push(service);
    });
    details.practices = practices;

    // Extract extra services
    const extraServices: string[] = [];
    $profile(".services .icon-ok").each((_, el) => {
      const service = $profile(el)
        .parent()
        .text()
        .trim()
        .replace(/^[^A-Za-z]+/, "");
      if (service) extraServices.push(service);
    });
    details.extraServices = extraServices;

    // Extract rates
    const rates: Array<{ duration: string; incall: string; outcall: string }> =
      [];
    $profile(".rates-table tr").each((_, row) => {
      const duration = $profile(row).find("td").eq(0).text().trim();
      const incall = $profile(row).find("td.hide-incall").text().trim();
      const outcall = $profile(row).find("td.hide-outcall").text().trim();

      if (duration && duration !== "Duration" && duration !== "") {
        rates.push({ duration, incall, outcall });
      }
    });
    details.rates = rates;

    return details;
  }
}
