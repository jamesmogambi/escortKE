const cheerio = require("cheerio");

async function scrapeEscortDetails(html, url) {
  const $ = cheerio.load(html);

  const escortData = {
    sourceUrl: url,
    // Basic Info
    name: "",
    age: "",
    gender: "",
    nationality: "",
    ethnicity: "",
    sexualOrientation: "",
    languages: [],
    description: "",

    // Location
    country: "",
    city: "",
    location: "",

    // Physical Attributes
    bustSize: "",
    height: "",
    hairColor: "",
    weight: "",
    shaved: "",
    smokes: "",

    // Services
    practices: [],
    bdsm: [],
    massage: [],
    extraServices: [],
    categories: [],

    // Rates
    incallRate: "",
    outcallRate: "",

    // Media
    images: [],
    videos: [],
    previewPhoto: "",

    // Additional Info
    reviews: [],
    questions: [],

    // Meta
    isActive: true,
    isVerified: false,
    source: "afrohot",
    plan: "basic",
  };

  try {
    // Extract name from image alt or description
    const imageAlt = $(".escort-gallery img").first().attr("alt") || "";
    escortData.name = imageAlt.split("-")[0]?.trim() || "Unknown";

    // Extract description
    escortData.description = $(".description p").first().text().trim();

    // Extract images
    $(".escort-gallery img").each((i, el) => {
      const imgUrl = $(el).attr("src");
      if (imgUrl && !escortData.images.includes(imgUrl)) {
        escortData.images.push(imgUrl);
      }
    });

    // Extract links for images as well (they might have higher quality)
    $(".escort-gallery a").each((i, el) => {
      const imgUrl = $(el).attr("href");
      if (imgUrl && !escortData.images.includes(imgUrl)) {
        escortData.images.push(imgUrl);
      }
    });

    // Set preview photo
    escortData.previewPhoto = escortData.images[0] || "";

    // Extract services from the services section
    $(".description a.bg-secondary").each((i, el) => {
      const service = $(el).text().trim();
      if (service) {
        // Categorize services
        if (service.toLowerCase().includes("bdsm")) {
          escortData.bdsm.push(service);
        } else if (
          service.toLowerCase().includes("massage") ||
          service.toLowerCase().includes("handjob") ||
          service.toLowerCase().includes("fisting")
        ) {
          escortData.massage.push(service);
        } else if (
          service.toLowerCase().includes("fetish") ||
          service.toLowerCase().includes("anal") ||
          service.toLowerCase().includes("deep throat") ||
          service.toLowerCase().includes("threesome") ||
          service.toLowerCase().includes("lesbian") ||
          service.toLowerCase().includes("webcam")
        ) {
          escortData.practices.push(service);
        } else {
          escortData.extraServices.push(service);
        }

        // Also add to categories
        if (!escortData.categories.includes(service)) {
          escortData.categories.push(service);
        }
      }
    });

    // Extract rates
    const incallText = $(".up-down div:first-child p").text().trim();
    const outcallText = $(".up-down div:last-child p").text().trim();

    if (incallText.includes("ASK")) {
      escortData.incallRate = "ASK";
    } else {
      const incallMatch = incallText.match(/(\d+[,\d]*)/);
      escortData.incallRate = incallMatch ? incallMatch[1] : "";
    }

    if (outcallText.includes("ASK")) {
      escortData.outcallRate = "ASK";
    } else {
      const outcallMatch = outcallText.match(/(\d+[,\d]*)/);
      escortData.outcallRate = outcallMatch ? outcallMatch[1] : "";
    }

    // Extract details from the more-info list
    $(".more-info li").each((i, el) => {
      const label = $(el).find("span:first-child").text().trim().toLowerCase();
      const value = $(el).find("span:last-child").text().trim();
      const linkValue = $(el).find("span:last-child a").text().trim() || value;

      switch (label) {
        case "languages":
          if (value) {
            // Split languages by comma or other separators
            const languages = value.split(",").map((lang) => lang.trim());
            escortData.languages = languages.filter(
              (lang) => lang && lang !== "N/A",
            );
          }
          break;

        case "orientation":
          escortData.sexualOrientation = value;
          break;

        case "ethnicity":
          escortData.ethnicity = value || "";
          break;

        case "age":
          escortData.age = value;
          break;

        case "smokes?":
          escortData.smokes = value;
          break;

        case "nationality":
          escortData.nationality = value;
          break;

        case "city":
          // Extract city and country
          const cityLinks = $(el).find("span:last-child a");
          if (cityLinks.length >= 2) {
            escortData.city = $(cityLinks[0]).text().trim();
            escortData.country = $(cityLinks[1]).text().trim();
          } else if (cityLinks.length === 1) {
            escortData.city = $(cityLinks[0]).text().trim();
          }
          break;

        case "location":
          escortData.location = linkValue;
          break;

        case "bust":
          escortData.bustSize = value || "";
          break;

        case "height":
          escortData.height = value;
          // Try to extract just cm if available
          const cmMatch = value.match(/(\d+)\s*cm/i);
          if (cmMatch) {
            escortData.height = cmMatch[1] + " cm";
          }
          break;

        case "shaved":
          escortData.shaved = value;
          break;

        case "hair color":
          escortData.hairColor = value;
          break;

        case "gender":
          escortData.gender = value;
          break;
      }
    });

    // Extract reviews
    $(".review-item-one").each((i, el) => {
      const review = {
        reviewer: $(el).find(".head-sec a").first().text().trim(),
        rating: $(el).find("input.rating").attr("value") || "0",
        date: $(el).find(".head-sec span").text().replace("–", "").trim(),
        content: $(el).find(".body-sec p").text().trim(),
      };

      if (review.reviewer && review.content) {
        escortData.reviews.push(review);
      }
    });

    // Generate slug from name and location
    const slugBase = `${escortData.name.toLowerCase().replace(/\s+/g, "-")}-${escortData.city?.toLowerCase() || "unknown"}`;
    escortData.slug = slugBase.replace(/[^a-z0-9-]/g, "");

    // Add labels based on services and attributes
    const labels = [];
    if (escortData.bdsm.length > 0) labels.push("BDSM");
    if (escortData.images.length > 3) labels.push("Multiple Photos");
    if (escortData.reviews.length > 0) labels.push("Reviewed");
    if (escortData.incallRate !== "ASK" || escortData.outcallRate !== "ASK") {
      labels.push("Rates Available");
    }
    escortData.labels = labels;

    // Add availability - you might want to set default or extract from somewhere
    escortData.availability = [
      "Available for incalls",
      "Available for outcalls",
    ];

    // Extract weight from description if mentioned
    const weightMatch = escortData.description.match(
      /(\d+)\s*(kg|kgs|kilograms?|pounds?|lbs)/i,
    );
    if (weightMatch) {
      escortData.weight = weightMatch[1] + " " + weightMatch[2];
    }

    // Extract breast size from description if mentioned
    const bustMatch = escortData.description.match(
      /([ABCD][\+\-]?\d*)\s*(cup|cups|size)/i,
    );
    if (bustMatch && !escortData.bustSize) {
      escortData.bustSize = bustMatch[1];
    }

    // Create rates array for your model
    escortData.rates = [];
    if (escortData.incallRate && escortData.incallRate !== "ASK") {
      escortData.rates.push({
        duration: "1 hour",
        incall: escortData.incallRate,
        outcall: escortData.outcallRate !== "ASK" ? escortData.outcallRate : "",
      });
    }

    // Extract email pattern if any
    const emailMatch = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    if (emailMatch) {
      escortData.email = emailMatch[0];
    }

    // Extract phone numbers if any
    const phoneMatch = html.match(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    );
    if (phoneMatch) {
      escortData.telephone = phoneMatch[0];
      // Check for WhatsApp
      if (html.toLowerCase().includes("whatsapp") || html.includes("wa.me")) {
        escortData.whatsappPhone = phoneMatch[0];
      }
    }

    // Generate age category
    if (escortData.age) {
      const ageNum = parseInt(escortData.age);
      if (!isNaN(ageNum)) {
        if (ageNum < 25) escortData.ageCategory = "Young";
        else if (ageNum < 35) escortData.ageCategory = "Mature";
        else escortData.ageCategory = "Senior";
      }
    }

    // Extract character traits from description
    const characterWords = [
      "friendly",
      "professional",
      "discreet",
      "fun",
      "outgoing",
      "shy",
      "energetic",
    ];
    const foundCharacter = characterWords.find((word) =>
      escortData.description.toLowerCase().includes(word),
    );
    if (foundCharacter) {
      escortData.character =
        foundCharacter.charAt(0).toUpperCase() + foundCharacter.slice(1);
    }

    // Extract experience from description
    if (escortData.description.toLowerCase().includes("experienced")) {
      escortData.experience = "Experienced";
    } else if (escortData.description.toLowerCase().includes("new")) {
      escortData.experience = "New";
    }

    // Clean up empty arrays
    [
      "practices",
      "bdsm",
      "massage",
      "extraServices",
      "categories",
      "languages",
      "labels",
    ].forEach((key) => {
      if (escortData[key].length === 0) {
        escortData[key] = [];
      }
    });

    // Clean up empty strings
    Object.keys(escortData).forEach((key) => {
      if (
        typeof escortData[key] === "string" &&
        escortData[key].trim() === ""
      ) {
        escortData[key] = undefined;
      }
    });

    return escortData;
  } catch (error) {
    console.error("Error scraping escort details:", error);
    throw error;
  }
}

// Example usage with BrightData
async function scrapeEscortWithBrightData(url) {
  const { BrightDataScraper } = require("@brightdata/sdk");

  const scraper = new BrightDataScraper({
    accountId: "your-account-id",
    apiKey: "your-api-key",
  });

  try {
    // Fetch the page using BrightData
    const response = await scraper.get(url, {
      // Add any necessary headers or options
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Scrape the details
    const escortDetails = await scrapeEscortDetails(response.body, url);

    // Transform to match your Mongoose model
    const transformedData = {
      name: escortDetails.name,
      email: escortDetails.email || `escort-${Date.now()}@example.com`, // fallback email
      labels: escortDetails.labels,
      age: escortDetails.age,
      telephone: escortDetails.telephone,
      whatsappPhone: escortDetails.whatsappPhone,
      images: escortDetails.images,
      videos: escortDetails.videos || [],
      about: escortDetails.description,
      availability: escortDetails.availability,
      ethnicity: escortDetails.ethnicity,
      nationality: escortDetails.nationality,
      bustSize: escortDetails.bustSize,
      weight: escortDetails.weight,
      source: escortDetails.source,
      sexualOrientation: escortDetails.sexualOrientation,
      languages: escortDetails.languages,
      categories: escortDetails.categories,
      estate: escortDetails.location,
      town: escortDetails.city,
      address: `${escortDetails.location}, ${escortDetails.city}, ${escortDetails.country}`,
      practices: escortDetails.practices,
      bdsm: escortDetails.bdsm,
      massage: escortDetails.massage,
      extraServices: escortDetails.extraServices,
      slug: escortDetails.slug,
      openingHours: {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
      },
      rates: escortDetails.rates,
      role: "escort",
      isActive: true,
      isVerified: false,
      street: escortDetails.location,
      region: escortDetails.city,
      user: undefined, // Will be set when linking to user
      breastSize: escortDetails.bustSize,
      ageCategory: escortDetails.ageCategory,
      character: escortDetails.character,
      hairColor: escortDetails.hairColor,
      experience: escortDetails.experience,
      plan: "basic",
      // Add other fields as needed
      zodiacSign: undefined, // Could extract from description if mentioned
      previewPhoto: escortDetails.previewPhoto,
      username: escortDetails.slug,
    };

    return transformedData;
  } catch (error) {
    console.error("Error with BrightData scraping:", error);
    throw error;
  }
}

// If you're using axios or another HTTP client
async function scrapeEscortWithAxios(url) {
  const axios = require("axios");

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const escortDetails = await scrapeEscortDetails(response.data, url);
    return escortDetails;
  } catch (error) {
    console.error("Error fetching page:", error);
    throw error;
  }
}

module.exports = {
  scrapeEscortDetails,
  scrapeEscortWithBrightData,
  scrapeEscortWithAxios,
};
