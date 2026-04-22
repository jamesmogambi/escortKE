// lib/scrapers/rahaescorts.scraper.ts
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
  regionId?: string;
  regionName?: string;
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
    url = url.replace(/\?.*$/, "");
    url = url.replace(/-\d+x\d+\./g, ".");
    url = url.replace(/\?fit=\d+%2C\d+/, "");
    url = url.replace(/&ssl=1/, "");
    url = url.replace(/\?resize=\d+%2C\d+/, "");
    url = url.replace(/resize=\d+%2C\d+/, "");
    url = url.replace(/fit=\d+%2C\d+/, "");
    url = url.replace(/-\d+x\d+(?=\.)/g, "");
    url = url.replace(/https:\/\/i\d\.wp\.com\//, "https://");
    if (url.startsWith("//")) url = "https:" + url;
    url = url.split("#")[0].split("?")[0];
    return url;
  }

  private getImageFingerprint(url: string): string {
    const filename = url.split("/").pop() || url;
    return filename
      .replace(/-\d+x\d+/, "")
      .replace(/\.[^.]+$/, "")
      .toLowerCase();
  }

  private extractGender($profile: cheerio.CheerioAPI): string {
    const genderSpan = $profile('.aboutme span[itemprop="gender"]');
    if (genderSpan.length) {
      const gender = genderSpan.text().trim();
      if (gender) return gender;
    }

    const aboutBoldText = $profile(".aboutme b").first().text();
    const genderMatch = aboutBoldText.match(/\d+ year old (\w+) escort/i);
    if (genderMatch) {
      return genderMatch[1];
    }

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

    details.name = $profile('.profile-title[itemprop="name"]').text().trim();

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
    details.region = region;
    details.county = county;
    details.town = region;

    const phoneElement = $profile(".phone-box a");
    if (phoneElement.length) {
      details.telephone = phoneElement.text().trim();
    }

    const whatsappLink = $profile(".available-on a").attr("href");
    if (whatsappLink) {
      details.whatsappPhone = whatsappLink
        .replace(/^https:\/\/wa\.me\//, "")
        .split("?")[0];
    }

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

    details.images = Array.from(imageFingerprints.values());
    details.previewPhoto = details.images[0] || "";

    const aboutClone = $profile(".aboutme").clone();
    aboutClone.find("b").remove();
    details.about = aboutClone.text().replace(/\s+/g, " ").trim();

    const languages: string[] = [];
    $profile(
      '.girlinfo-section:has(h4:contains("Languages spoken")) .section-box',
    ).each((_, el) => {
      const lang = $profile(el).find("b").text().trim().replace(/:$/, "");
      if (lang) languages.push(lang);
    });
    details.languages = languages;

    $profile(".b-label").each((_, el) => {
      const label = $profile(el).text().trim();
      const value = $profile(el).parent().next(".valuecolumn").text().trim();
      if (label === "Estate / Area:") {
        details.city = value;
      }
    });

    $profile(".section-box").each((_, el) => {
      const label = $profile(el).find("b").text().trim();
      const value = $profile(el).find(".valuecolumn").text().trim();

      if (label === "Ethnicity") details.ethnicity = value;
      if (label === "Nationality") details.nationality = value;
      if (label === "Bust size") details.bustSize = value;
      if (label === "Sexual orientation") details.sexualOrientation = value;
      if (label === "Availability") details.availability = value;
    });

    const practices: string[] = [];
    $profile(".services > div").each((_, el) => {
      let service = $profile(el).text().trim();
      service = service.replace(/^[^A-Za-z]+/, "");
      if (service) practices.push(service);
    });
    details.practices = practices;

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
