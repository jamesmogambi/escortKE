import React from "react";
import GirlFilterInput from "./GirlFIlterInput";
import ListHeader from "@/components/ListHeader";
import GirlList from "@/components/GirlList";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import SectionArticle from "./SectionArticle";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import NotFoundList from "@/components/NotFoundList";
import {
  generateBreadcrumbList,
  generateListStructuredData,
} from "./seo-utils";
import {
  getEscorts,
  GetEscortsResponse,
  getEscortsWithClientFiltering,
} from "@/server-actions/escort.action";

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    practice?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

// Default titles and descriptions with KENYADIVAS branding
const defaultTitle = "Premium Escorts in Kenya";
const defaultDescription =
  "KENYADIVAS - Kenya's premier escort directory. Browse verified premium escorts in Nairobi, Mombasa, Kisumu and across Kenya. Real photos, authentic reviews, and transparent rates.";

// Helper function to format location names
const formatLocationName = (str: string): string => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Generate dynamic metadata
export async function generateMetadata(
  { searchParams }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await searchParams;
  const { county, region, practice, page } = params;
  const pageNumber = page ? parseInt(page) : 1;

  // Fetch data for metadata generation
  let totalEscorts = 0;
  let firstEscort = null;
  let uniqueLocations: string[] = [];

  try {
    const result = await getEscorts({
      county: params.county,
      region: params.region,
      practice: params.practice,
      page: params.page ? parseInt(params.page, 10) : 1,
      limit: ITEMS_PER_PAGE,
    });

    if (result && result.escorts) {
      totalEscorts = result.total;
      if (result.escorts.length > 0) {
        firstEscort = result.escorts[0];

        // Extract unique locations for keywords
        const locations = result.escorts
          .map((e: any) => e.town || e.workingAreas?.[0]?.countyName)
          .filter(Boolean);
        uniqueLocations = [...new Set(locations)] as string[];
      }
    }
  } catch (error) {
    console.error("Error fetching data for metadata:", error);
  }

  // Format filter values for display
  const formattedCounty =
    county && county !== "all" ? formatLocationName(county) : null;
  const formattedRegion =
    region && region !== "all" ? formatLocationName(region) : null;
  const formattedPractice =
    practice && practice !== "all" ? formatLocationName(practice) : null;

  // Build dynamic title
  const buildTitle = () => {
    const parts = [];

    if (formattedPractice) {
      parts.push(formattedPractice);
    }

    if (formattedRegion) {
      parts.push(formattedRegion);
    }

    if (formattedCounty) {
      parts.push(formattedCounty);
    }

    if (parts.length === 0) {
      return `Premium Escorts in Kenya | KENYADIVAS`;
    }

    const baseTitle = `${parts.join(" ")} Escorts in Kenya`;
    return pageNumber > 1
      ? `${baseTitle} - Page ${pageNumber} | KENYADIVAS`
      : `${baseTitle} | KENYADIVAS`;
  };

  // Build dynamic description
  const buildDescription = () => {
    const locationPhrase = [];

    if (formattedCounty && formattedRegion) {
      locationPhrase.push(`in ${formattedRegion}, ${formattedCounty}`);
    } else if (formattedCounty) {
      locationPhrase.push(`in ${formattedCounty} County`);
    } else if (formattedRegion) {
      locationPhrase.push(`in ${formattedRegion}`);
    } else {
      locationPhrase.push("across Kenya");
    }

    const servicePhrase = formattedPractice
      ? `Find verified ${formattedPractice.toLowerCase()} escorts ${locationPhrase.join(" ")}.`
      : `Discover premium escort services ${locationPhrase.join(" ")}.`;

    return `KENYADIVAS - ${servicePhrase} Browse ${totalEscorts}+ verified profiles with real photos, authentic reviews, rates, and discreet contact information. Safe and professional companionship.`;
  };

  // Build comprehensive keywords
  const buildKeywords = () => {
    const keywords = new Set([
      "KENYADIVAS",
      "Kenya escorts",
      "premium escorts Kenya",
      "verified companions",
      "Nairobi escorts",
      "Mombasa escorts",
      "Kisumu escorts",
      "escort directory Kenya",
      "adult entertainment Kenya",
      "professional escorts",
      "luxury companions",
      "VIP escorts",
      "Kenya call girls",
      "escort services",
      "discreet dating",
    ]);

    if (formattedCounty) {
      keywords.add(`${formattedCounty} escorts`);
      keywords.add(`${formattedCounty} County companions`);
      keywords.add(`escorts in ${formattedCounty}`);
    }

    if (formattedRegion) {
      keywords.add(`${formattedRegion} escorts`);
      keywords.add(`companions in ${formattedRegion}`);
    }

    if (formattedPractice) {
      keywords.add(`${formattedPractice} escorts`);
      keywords.add(`${formattedPractice} services Kenya`);
    }

    // Add unique locations from actual escorts
    uniqueLocations.slice(0, 5).forEach((location) => {
      keywords.add(`${location} escorts`);
    });

    return Array.from(keywords).join(", ");
  };

  // Build canonical URL
  const buildCanonicalUrl = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";
    const params = new URLSearchParams();

    if (county && county !== "all") params.append("county", county);
    if (region && region !== "all") params.append("region", region);
    if (practice && practice !== "all") params.append("practice", practice);

    // Only add page parameter for pages > 1
    if (pageNumber > 1) params.append("page", pageNumber.toString());

    const queryString = params.toString();
    return `${baseUrl}/girls${queryString ? `?${queryString}` : ""}`;
  };

  const title = buildTitle();
  const description = buildDescription();
  const keywords = buildKeywords();
  const canonicalUrl = buildCanonicalUrl();

  // Open Graph images
  const ogImages = [];
  if (firstEscort?.previewPhoto) {
    ogImages.push({
      url: firstEscort.previewPhoto,
      width: 1200,
      height: 630,
      alt: `${firstEscort.name || firstEscort.username} - Verified Escort Profile on KENYADIVAS`,
    });
  }

  // Always add default OG image
  ogImages.push({
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com"}/og-girls.jpg`,
    width: 1200,
    height: 630,
    alt: "KENYADIVAS - Premium Escorts in Kenya",
  });

  // Calculate pagination URLs
  const totalPages = Math.ceil(totalEscorts / ITEMS_PER_PAGE);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";

  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (county && county !== "all") params.append("county", county);
    if (region && region !== "all") params.append("region", region);
    if (practice && practice !== "all") params.append("practice", practice);
    if (pageNum > 1) params.append("page", pageNum.toString());
    const queryString = params.toString();
    return `${baseUrl}/girls${queryString ? `?${queryString}` : ""}`;
  };

  return {
    title,
    description,
    keywords,

    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: "KENYADIVAS Kenya",
      title,
      description,
      url: canonicalUrl,
      images: ogImages,
      countryName: "Kenya",
    },

    twitter: {
      card: "summary_large_image",
      site: "@kenyadivas",
      creator: "@kenyadivas",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: canonicalUrl,
      ...(pageNumber > 1 && {
        prev: buildPageUrl(pageNumber - 1),
      }),
      ...(pageNumber < totalPages && {
        next: buildPageUrl(pageNumber + 1),
      }),
    },

    // Pagination metadata
    ...(pageNumber > 1 && {
      title: `${title} - Page ${pageNumber}`,
    }),

    // Geographical metadata
    other: {
      "geo.region": "KE",
      "geo.placename": formattedCounty || "Kenya",
      "geo.position":
        formattedCounty?.toLowerCase() === "nairobi"
          ? "-1.286389;36.817223"
          : "",
      ICBM:
        formattedCounty?.toLowerCase() === "nairobi"
          ? "-1.286389, 36.817223"
          : "",
      rating: "RTA-5042-1996-1400-1577-RTA",
      classification: "Adult Entertainment",
      distribution: "global",
      language: "English",
      author: "KENYADIVAS",
      copyright: `© ${new Date().getFullYear()} KENYADIVAS. All rights reserved.`,
      "og:price:currency": "KES",
      "twitter:app:country": "KE",
      "business:contact_data:country": "Kenya",
      "pinterest-rich-pin": "enabled",
    },
  };
}

const GirlsListingPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const { county, region, practice, page } = params;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Format values for display
  const formattedCounty =
    county && county !== "all" ? formatLocationName(county) : null;
  const formattedRegion =
    region && region !== "all" ? formatLocationName(region) : null;
  const formattedPractice =
    practice && practice !== "all" ? formatLocationName(practice) : null;

  // Build dynamic title
  const getDynamicTitle = () => {
    const parts = [];

    if (formattedPractice) {
      parts.push(formattedPractice);
    }

    if (formattedRegion) {
      parts.push(formattedRegion);
    }

    if (formattedCounty) {
      parts.push(formattedCounty);
    }

    if (parts.length === 0) {
      return "Premium Escorts in Kenya";
    }

    return `${parts.join(" ")} Escorts in Kenya`;
  };

  const title = getDynamicTitle();

  const {
    escorts,
    total,
    totalPages,
    page: currentPageFromResponse,
    hasMore,
  } = await getEscortsWithClientFiltering({
    county: params.county,
    region: params.region,
    practice: params.practice,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: ITEMS_PER_PAGE,
  });

  // if (escorts.length === 0 && currentPage === 1) {
  //   return notFound();
  // }
  // Generate structured data
  const structuredData = generateListStructuredData({
    title,
    description: defaultDescription,
    totalItems: total,
    currentPage,
    totalPages: totalPages,
    filters: {
      county: formattedCounty,
      region: formattedRegion,
      practice: formattedPractice,
    },
    items: escorts.slice(0, 10), // Include first 10 escorts in structured data
  });

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbList([
    { name: "Home", url: "/" },
    { name: "Escorts", url: "/girls" },
    ...(formattedCounty
      ? [{ name: `${formattedCounty} Escorts`, url: `/girls?county=${county}` }]
      : []),
    ...(formattedRegion
      ? [{ name: `${formattedRegion} Escorts`, url: `/girls?region=${region}` }]
      : []),
    ...(formattedPractice
      ? [
          {
            name: `${formattedPractice} Escorts`,
            url: `/girls?practice=${practice}`,
          },
        ]
      : []),
    ...(currentPage > 1
      ? [{ name: `Page ${currentPage}`, url: `/girls?page=${currentPage}` }]
      : []),
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Hidden SEO elements */}
      <div className="sr-only">
        <h1>{title} | KENYADIVAS Kenya</h1>
        <p>{defaultDescription}</p>
      </div>

      {/* Filter Section */}
      <div className="bg-black  p-5 pb-6 -mt-4.5">
        <div className="max-w-2/3 mx-auto">
          <GirlFilterInput />
        </div>
      </div>

      {/* Results Header */}
      <ListHeader
        title={title}
        subTitle="Girls for Sex"
        // subTitle={`${res.total} Verified Escorts Available`}
      />

      {/* Results List */}
      {total > 0 && (
        <>
          <GirlList girls={escorts} />
          <ClientPaginationWrapper
            totalPages={totalPages}
            currentPage={currentPageFromResponse}
            totalItems={total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

      {/* No Results */}
      {total === 0 && <NotFoundList />}

      {/* SEO Content Section */}
      <SectionArticle />
    </>
  );
};

export default GirlsListingPage;
