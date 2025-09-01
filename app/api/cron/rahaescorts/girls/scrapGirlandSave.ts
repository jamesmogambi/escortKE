import { initBrightData } from "@/lib/brightData";
import { connectToDB } from "@/lib/mongoose";
import Escort, { defaultOpeningHours } from "@/models/Escort";
import axios from "axios";
import * as cheerio from "cheerio";

const sourceURL = "https://rahaescorts.com/escort/";
// export async function ScrapGirlandSave(slug: string) {
//   await connectToDB();
//   const { options } = initBrightData();

//   try {
//     const destinationPath = `${sourceURL}escorts/${slug}/`;
//     const response = await axios.get(destinationPath, options);
//     const $ = cheerio.load(response.data);
//     // TODO:scrap escort data

//     const name = $('.profile-title[itemprop="name"]').text().trim();

//     const labels = $(".girlsinglelabels span")
//       .map((_, el) => $(el).text().trim())
//       .get();

//     const age = $(".profile-header-name-info .valuecolumn").text().trim();
//     const telephone = $(".phone-box a")
//       .clone()
//       .children()
//       .remove()
//       .end()
//       .text()
//       .trim();

//     const href = $(".available-on a").attr("href") || "";
//     const whatsappPhone = href.replace(/^https:\/\/wa\.me\//, "").split("?")[0];

//     const imageUrls: any = [];

//     // 1️⃣ Get the full-size images from the <a href="">
//     $('.profile-img-thumb-wrapper a[itemprop="contentURL"]').each((_, el) => {
//       const href = $(el).attr("href");
//       if (href) imageUrls.push(href.trim());
//     });

//     // 2️⃣ Get all <img> attribute variants (lazy-load, responsive, etc.)
//     $(".profile-img-thumb-wrapper img").each((_, el) => {
//       const candidates = [
//         $(el).attr("src"),
//         $(el).attr("data-original-url"),
//         $(el).attr("data-responsive-img-url"),
//       ];
//       candidates.forEach((url) => {
//         if (url) imageUrls.push(url.trim());
//       });
//     });

//     // Optional: Deduplicate
//     const uniqueImageUrls = [...new Set(imageUrls)];

//     console.log(uniqueImageUrls);

//     // Remove the <b> section we don’t want
//     $(".aboutme b").remove();

//     // Grab the remaining text, clean up whitespace
//     const aboutText = $(".aboutme").text().replace(/\s+/g, " ").trim();

//     // Find the section-box whose <b> text is "Availability"
//     const availability = $(".section-box")
//       .filter((_, el) => $(el).find("b").text().trim() === "Availability")
//       .find(".valuecolumn")
//       .text()
//       .trim();

//     const profileData: Record<string, string> = {};

//     $(".section-box").each((_, el) => {
//       const label = $(el).find("b").text().trim();
//       const value = $(el).find(".valuecolumn").text().trim();
//       profileData[label] = value;
//     });

//     const languages: Record<string, string> = {};

//     $(".section-box").each((_, el) => {
//       // Remove trailing colon from language name
//       const lang = $(el).find("b").text().trim().replace(/:$/, "");
//       const level = $(el).find(".valuecolumn").text().trim();
//       languages[lang] = level;
//     });

//     let estate = "";
//     let city = "";

//     $(".b-label").each((_, el) => {
//       const label = $(el).text().trim();
//       const value = $(el).parent().next(".valuecolumn").text().trim();

//       if (label === "Estate / Area:") {
//         estate = value;
//       }
//       if (label === "City:") {
//         city = value;
//       }
//     });

//     const services = $(".services > div")
//       .map((_, el) => $(el).text().trim())
//       .get();

//     //TODO: save record to DB
//     const res = null;
//     // return response
//     return res;
//   } catch (error: any) {
//     console.error("Scraping error:", error.message);
//   }
// }

// export async function ScrapGirlandSave(slug: string) {
//   await connectToDB();
//   const { options } = initBrightData();

//   try {
//     const destinationPath = `${sourceURL}${slug}/`;

//     console.log("destination path", destinationPath);
//     const response = await axios.get(destinationPath, options);
//     const $ = cheerio.load(response.data);

//     // ✅ Basic info
//     const name = $('.profile-title[itemprop="name"]').text().trim();
//     const labels = $(".girlsinglelabels span")
//       .map((_, el) => $(el).text().trim())
//       .get();
//     const age = $(".profile-header-name-info .valuecolumn").text().trim();
//     const telephone = $(".phone-box a")
//       .clone()
//       .children()
//       .remove()
//       .end()
//       .text()
//       .trim();

//     const href = $(".available-on a").attr("href") || "";
//     const whatsappPhone = href.replace(/^https:\/\/wa\.me\//, "").split("?")[0];

//     // ✅ Images
//     const imageUrls: string[] = [];
//     $('.profile-img-thumb-wrapper a[itemprop="contentURL"]').each((_, el) => {
//       const href = $(el).attr("href");
//       if (href) imageUrls.push(href.trim());
//     });
//     $(".profile-img-thumb-wrapper img").each((_, el) => {
//       const candidates = [
//         $(el).attr("src"),
//         $(el).attr("data-original-url"),
//         $(el).attr("data-responsive-img-url"),
//       ];
//       candidates.forEach((url) => {
//         if (url) imageUrls.push(url.trim());
//       });
//     });
//     const uniqueImageUrls = [...new Set(imageUrls)];

//     // ✅ About text (strip the <b> label first)
//     $(".aboutme b").remove();
//     const aboutText = $(".aboutme").text().replace(/\s+/g, " ").trim();

//     // ✅ Profile metadata (Availability, Ethnicity, etc.)
//     const profileData: Record<string, string> = {};
//     $(".section-box").each((_, el) => {
//       const label = $(el).find("b").text().trim();
//       const value = $(el).find(".valuecolumn").text().trim();
//       profileData[label] = value;
//     });

//     // ✅ Languages
//     const languages: Record<string, string> = {};
//     $(
//       '.girlinfo-section:has(h4:contains("Languages spoken")) .section-box'
//     ).each((_, el) => {
//       const lang = $(el).find("b").text().trim().replace(/:$/, "");
//       const level = $(el).find(".valuecolumn").text().trim();
//       languages[lang] = level;
//     });

//     // ✅ Estate & City
//     let estate = "";
//     let city = "";
//     $(".b-label").each((_, el) => {
//       const label = $(el).text().trim();
//       const value = $(el).parent().next(".valuecolumn").text().trim();
//       if (label === "Estate / Area:") estate = value;
//       if (label === "City:") city = value;
//     });

//     // ✅ Services
//     const services = $(".services > div")
//       .map((_, el) => $(el).text().trim())
//       .get();

//     // 🎯 Final object
//     const escortData = {
//       name,
//       labels,
//       age,
//       telephone,
//       whatsappPhone,
//       images: uniqueImageUrls,
//       about: aboutText,
//       availability: profileData["Availability"] || "",
//       ethnicity: profileData["Ethnicity"] || "",
//       nationality: profileData["Nationality"] || "",
//       bustSize: profileData["Bust size"] || "",
//       zodiacSign: profileData["Zodiac sign"] || "",
//       sexualOrientation: profileData["Sexual orientation"] || "",
//       languages,
//       estate,
//       city,
//       services,
//       //   clerkUserId: "",
//     };
//     // TODO: Save to DB here, e.g.:
//     const res = await Escort.create(escortData);

//     return res;

//     return escortData;
//   } catch (error: any) {
//     console.error("Scraping error:", error.message);
//   }
// }

export async function ScrapGirlandSave(slug: string) {
  await connectToDB();
  const { options } = initBrightData();

  try {
    const destinationPath = `${sourceURL}${slug}/`;
    const response = await axios.get(destinationPath, options);
    const $ = cheerio.load(response.data);

    // ✅ Extract basic info
    const name = $('.profile-title[itemprop="name"]').text().trim();
    const labels = $(".girlsinglelabels span")
      .map((_, el) => $(el).text().trim())
      .get();
    const age = $(".profile-header-name-info .valuecolumn").text().trim();
    const telephone = $(".phone-box a")
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();
    const href = $(".available-on a").attr("href") || "";
    const whatsappPhone = href.replace(/^https:\/\/wa\.me\//, "").split("?")[0];

    // ✅ Extract images
    // TODO:// ONLY SCRAP ORIGINAL IMAGES
    const imageUrls: string[] = [];
    $('.profile-img-thumb-wrapper a[itemprop="contentURL"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) imageUrls.push(href.trim());
    });
    $(".profile-img-thumb-wrapper img").each((_, el) => {
      const candidates = [
        $(el).attr("src"),
        $(el).attr("data-original-url"),
        $(el).attr("data-responsive-img-url"),
      ];
      candidates.forEach((url) => {
        if (url) imageUrls.push(url.trim());
      });
    });
    const uniqueImageUrls = [...new Set(imageUrls)];

    // ✅ About text
    $(".aboutme b").remove();
    const aboutText = $(".aboutme").text().replace(/\s+/g, " ").trim();

    // ✅ Profile metadata
    const profileData: Record<string, string> = {};
    $(".section-box").each((_, el) => {
      const label = $(el).find("b").text().trim();
      const value = $(el).find(".valuecolumn").text().trim();
      profileData[label] = value;
    });

    // ✅ Languages
    const languages: Record<string, string> = {};
    $(
      '.girlinfo-section:has(h4:contains("Languages spoken")) .section-box'
    ).each((_, el) => {
      const lang = $(el).find("b").text().trim().replace(/:$/, "");
      const level = $(el).find(".valuecolumn").text().trim();
      languages[lang] = level;
    });

    // ✅ Estate & City
    let estate = "";
    let city = "";
    $(".b-label").each((_, el) => {
      const label = $(el).text().trim();
      const value = $(el).parent().next(".valuecolumn").text().trim();
      if (label === "Estate / Area:") estate = value;
      if (label === "City:") city = value;
    });

    // ✅ Services
    const services = $(".services > div")
      .map((_, el) => $(el).text().trim())
      .get();

    const extraServices = $(".services .yes")
      .map((_, el) => $(el).text().trim())
      .get();

    const rates: any = [];
    $(".rates-table tr").each((_, row) => {
      const duration = $(row).find("td").eq(0).text().trim();
      const incall = $(row).find("td.hide-incall").text().trim();
      const outcall = $(row).find("td.hide-outcall").text().trim();

      if (duration) {
        rates.push({ duration, incall, outcall });
      }
    });

    // 🎯 Final object
    const escortData = {
      name,
      labels,
      age,
      telephone,
      whatsappPhone,
      images: uniqueImageUrls,
      about: aboutText,
      availability: profileData["Availability"] || "",
      ethnicity: profileData["Ethnicity"] || "",
      nationality: profileData["Nationality"] || "",
      bustSize: profileData["Bust size"] || "",
      zodiacSign: profileData["Zodiac sign"] || "",
      sexualOrientation: profileData["Sexual orientation"] || "",
      languages,
      estate,
      city,
      services,
      slug,
      clerkUserId: "",
      avatar: "",
      videos: [],
      weight: "",
      address: "",
      openingHours: defaultOpeningHours,
      extraServices,
      rates,
    };

    // ✅ Check if escort already exists
    const existingEscort = await Escort.findOne({ slug });
    if (existingEscort) {
      console.log(`Escort with slug "${slug}" already exists. Skipping save.`);
      return existingEscort;
    }

    // ✅ Save new escort
    const res = await Escort.create(escortData);
    return res;
  } catch (error: any) {
    console.error("Scraping error:", error.message);
  }
}
