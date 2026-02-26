// export const dynamic = "force-dynamic";
// import React from "react";
// import { notFound } from "next/navigation";
// import { Metadata } from "next";
// import Link from "next/link";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
// import SectionArticle from "./SectionArticle";
// import AgencyList from "./AgencyList";
// import AgencyFilterInput from "./AgencyFilterInput";
// import { getAgencies } from "@/actions/business.action";
// import { GetAgenciesResponse } from "@/types/agency.types";

// // ============ CONSTANTS ============
// const ITEMS_PER_PAGE = 12;
// const DEFAULT_TITLE = "Erotic Private Rooms";
// const DEFAULT_BREADCRUMB = "Erotic Privates";

// // ============ TYPES ============
// // Fix: Use the correct Next.js page props type
// type Props = {
//   params: Promise<{ [key: string]: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// interface FilterParams {
//   county?: string;
//   region?: string;
//   business?: string;
//   town?: string;
//   verified?: string;
//   featured?: string;
//   search?: string;
//   page?: string;
// }

// /**
//  * Parse and validate page number
//  */
// function parsePageNumber(page?: string): number {
//   const parsed = page ? parseInt(page) : 1;
//   return isNaN(parsed) || parsed < 1 ? 1 : parsed;
// }

// /**
//  * Build filter options for the page title display
//  */
// function buildTitleParts(params: FilterParams): string[] {
//   const parts = [];

//   if (params.business && params.business !== "all") {
//     parts.push(params.business);
//   }
//   if (params.region && params.region !== "all") {
//     parts.push(params.region);
//   }
//   if (params.county && params.county !== "all") {
//     parts.push(params.county);
//   }

//   return parts;
// }

// /**
//  * Extract filter params from searchParams
//  */
// function extractFilterParams(
//   searchParams: Awaited<Props["searchParams"]>,
// ): FilterParams {
//   return {
//     county:
//       typeof searchParams.county === "string" ? searchParams.county : undefined,
//     region:
//       typeof searchParams.region === "string" ? searchParams.region : undefined,
//     business:
//       typeof searchParams.business === "string"
//         ? searchParams.business
//         : undefined,
//     town: typeof searchParams.town === "string" ? searchParams.town : undefined,
//     verified:
//       typeof searchParams.verified === "string"
//         ? searchParams.verified
//         : undefined,
//     featured:
//       typeof searchParams.featured === "string"
//         ? searchParams.featured
//         : undefined,
//     search:
//       typeof searchParams.search === "string" ? searchParams.search : undefined,
//     page: typeof searchParams.page === "string" ? searchParams.page : undefined,
//   };
// }

// // ============ MAIN COMPONENT ============
// const AgenciesPage = async ({ searchParams }: Props) => {
//   try {
//     const rawParams = await searchParams;
//     const params = extractFilterParams(rawParams);
//     const currentPage = parsePageNumber(params.page);

//     // Fetch agencies with filters
//     const response = await getAgencies(
//       {
//         county: params.county,
//         region: params.region,
//         business: params.business,
//         town: params.town,
//         verified: params.verified,
//         featured: params.featured,
//         search: params.search,
//       },
//       {
//         page: currentPage,
//         limit: ITEMS_PER_PAGE,
//         includeEmployees: true,
//       },
//     );

//     // Handle invalid response
//     if (!response || !response.data) {
//       console.error("Invalid response from getAgencies:", response);
//       return notFound();
//     }

//     // Build title parts for display
//     const titleParts = buildTitleParts(params);
//     const displayTitle =
//       titleParts.length > 0
//         ? `${titleParts.join(" ")} ${DEFAULT_TITLE}`
//         : DEFAULT_TITLE;

//     return (
//       <div className="min-h-screen bg-transparent">
//         {/* Header Section */}
//         <header className="w-full bg-black">
//           <div className="container mx-auto px-4 py-6">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
//               {displayTitle}
//             </h1>
//             <AgencyFilterInput className="border-0" />
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="container mx-auto px-4 py-8">
//           {/* Breadcrumb Navigation */}
//           <nav aria-label="Breadcrumb" className="mb-6">
//             <Breadcrumb>
//               <BreadcrumbList className="text-white">
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     <Link
//                       href="/"
//                       className="text-primary hover:text-primary/80 text-lg font-bold  "
//                     >
//                       Introduction
//                     </Link>
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 -
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     <Link
//                       href="#"
//                       className="text-white hover:text-white/80 text-lg font-bold "
//                     >
//                       Erotic private rooms
//                     </Link>
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </nav>

//           {/* Agency List */}
//           {response.data.length > 0 ? (
//             <AgencyList agencies={response.data} title={displayTitle} />
//           ) : (
//             <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//               <p className="text-gray-500 text-lg">
//                 No agencies found matching your criteria.
//               </p>
//               <p className="text-gray-400 mt-2">
//                 Try adjusting your filters or browse all agencies.
//               </p>
//             </div>
//           )}

//           {/* Pagination */}
//           {response.pagination && response.pagination.pages > 1 && (
//             <div className="mt-8">
//               <ClientPaginationWrapper
//                 totalPages={response.pagination.pages}
//                 currentPage={response.pagination.page}
//                 totalItems={response.pagination.total}
//                 itemsPerPage={ITEMS_PER_PAGE}
//               />
//             </div>
//           )}

//           {/* SEO Section */}
//           <SectionArticle />
//         </main>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error in AgenciesPage:", error);
//     return notFound();
//   }
// };

// export default AgenciesPage;

export const dynamic = "force-dynamic";
import React from "react";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import SectionArticle from "./SectionArticle";
import AgencyList from "./AgencyList";
import AgencyFilterInput from "./AgencyFilterInput";
import { getAgencies } from "@/actions/business.action";
import { GetAgenciesResponse } from "@/types/agency.types";
import { generateAgencyStructuredData } from "./seo-utils";
import { generateBreadcrumbList } from "../girls/seo-utils";

// ============ CONSTANTS ============
const ITEMS_PER_PAGE = 12;
const DEFAULT_TITLE = "Erotic Private Rooms";
const DEFAULT_BREADCRUMB = "Erotic Privates";
const SITE_NAME = "KENYADIVAS";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";

// ============ TYPES ============
type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface FilterParams {
  county?: string;
  region?: string;
  business?: string;
  town?: string;
  verified?: string;
  featured?: string;
  search?: string;
  page?: string;
}

/**
 * Parse and validate page number
 */
function parsePageNumber(page?: string): number {
  const parsed = page ? parseInt(page) : 1;
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

/**
 * Format location name for display
 */
function formatLocationName(str?: string): string {
  if (!str || str === "all") return "";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format business type for display
 */
function formatBusinessType(type?: string): string {
  if (!type || type === "all") return "";

  const businessTypes: Record<string, string> = {
    agency: "Agency",
    private: "Private Room",
    hotel: "Hotel",
    massage: "Massage Parlor",
    sauna: "Sauna",
    club: "Night Club",
    lounge: "Lounge",
  };

  return (
    businessTypes[type.toLowerCase()] ||
    type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

/**
 * Build filter options for the page title display
 */
function buildTitleParts(params: FilterParams): {
  practice?: string;
  location?: string;
} {
  const locationParts = [];

  if (params.region && params.region !== "all") {
    locationParts.push(formatLocationName(params.region));
  }
  if (params.county && params.county !== "all") {
    locationParts.push(formatLocationName(params.county));
  }

  return {
    practice:
      params.business && params.business !== "all"
        ? formatBusinessType(params.business)
        : undefined,
    location: locationParts.length > 0 ? locationParts.join(", ") : undefined,
  };
}

/**
 * Extract filter params from searchParams
 */
function extractFilterParams(
  searchParams: Awaited<Props["searchParams"]>,
): FilterParams {
  return {
    county:
      typeof searchParams.county === "string" ? searchParams.county : undefined,
    region:
      typeof searchParams.region === "string" ? searchParams.region : undefined,
    business:
      typeof searchParams.business === "string"
        ? searchParams.business
        : undefined,
    town: typeof searchParams.town === "string" ? searchParams.town : undefined,
    verified:
      typeof searchParams.verified === "string"
        ? searchParams.verified
        : undefined,
    featured:
      typeof searchParams.featured === "string"
        ? searchParams.featured
        : undefined,
    search:
      typeof searchParams.search === "string" ? searchParams.search : undefined,
    page: typeof searchParams.page === "string" ? searchParams.page : undefined,
  };
}

// ============ METADATA GENERATION ============
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const rawParams = await searchParams;
  const params = extractFilterParams(rawParams);
  const currentPage = parsePageNumber(params.page);

  // Fetch data for metadata
  let totalAgencies = 0;
  let firstAgency = null;
  let uniqueLocations: string[] = [];

  try {
    const response = await getAgencies(
      {
        county: params.county,
        region: params.region,
        business: params.business,
        town: params.town,
        verified: params.verified,
        featured: params.featured,
        search: params.search,
      },
      {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        includeEmployees: false,
      },
    );

    if (response?.data) {
      totalAgencies = response.pagination?.total || 0;
      if (response.data.length > 0) {
        firstAgency = response.data[0];

        // Extract unique locations
        const locations = response.data
          .map((a: any) => a.town || a.city || a.county)
          .filter(Boolean);
        uniqueLocations = [...new Set(locations)] as string[];
      }
    }
  } catch (error) {
    console.error("Error fetching data for metadata:", error);
  }

  // Format filter values
  const formattedCounty = formatLocationName(params.county);
  const formattedRegion = formatLocationName(params.region);
  const formattedBusiness = formatBusinessType(params.business);

  // Build dynamic title
  const buildTitle = () => {
    const parts = [];

    // Add business type or default
    if (formattedBusiness) {
      parts.push(formattedBusiness);
    } else {
      parts.push("Erotic Private Rooms");
    }

    // Add location
    const locationParts = [];
    if (formattedRegion) {
      locationParts.push(formattedRegion);
    }
    if (formattedCounty) {
      locationParts.push(formattedCounty);
    }

    if (locationParts.length > 0) {
      parts.push(`in ${locationParts.join(", ")}`);
    } else {
      parts.push("in Kenya");
    }

    // Add brand
    const baseTitle = parts.join(" ");
    const withBrand = `${baseTitle} | ${SITE_NAME}`;

    return currentPage > 1 ? `${withBrand} - Page ${currentPage}` : withBrand;
  };

  // Build dynamic description
  const buildDescription = () => {
    const businessText = formattedBusiness?.toLowerCase() || "erotic private";
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

    return `${SITE_NAME} - Find professional ${businessText} rooms and agencies ${locationPhrase.join(" ")}. Browse ${totalAgencies}+ verified erotic private rooms with real photos, reviews, and contact information. Discreet and professional adult entertainment venues.`;
  };

  // Build comprehensive keywords
  const buildKeywords = () => {
    const keywords = new Set<string>([
      SITE_NAME,
      "erotic private rooms",
      "adult entertainment venues",
      "escort agencies Kenya",
      "private rooms Kenya",
      "Nairobi private rooms",
      "Mombasa adult venues",
      "Kisumu entertainment",
      "erotic lounges",
      "adult clubs",
      "sauna Kenya",
      "massage parlors",
      "hotel rooms",
      "discreet venues",
      "adult entertainment",
      "night clubs",
      "erotic venues",
    ]);

    if (formattedBusiness) {
      keywords.add(`${formattedBusiness.toLowerCase()} Kenya`);
      keywords.add(`${formattedBusiness.toLowerCase()} venues`);
    }

    if (formattedCounty) {
      keywords.add(`${formattedCounty} private rooms`);
      keywords.add(`adult venues in ${formattedCounty}`);
    }

    if (formattedRegion) {
      keywords.add(`${formattedRegion} private rooms`);
      keywords.add(`entertainment in ${formattedRegion}`);
    }

    // Add unique locations
    uniqueLocations.slice(0, 5).forEach((location) => {
      keywords.add(`${location} private rooms`);
      keywords.add(`adult venues in ${location}`);
    });

    return Array.from(keywords).join(", ");
  };

  // Build canonical URL
  const buildCanonicalUrl = () => {
    const params: any = new URLSearchParams();

    if (params.county && params.county !== "all")
      params.append("county", params.county);
    if (params.region && params.region !== "all")
      params.append("region", params.region);
    if (params.business && params.business !== "all")
      params.append("business", params.business);
    if (params.town) params.append("town", params.town);
    if (params.verified === "true") params.append("verified", "true");
    if (params.featured === "true") params.append("featured", "true");
    if (params.search) params.append("search", params.search);

    if (currentPage > 1) params.append("page", currentPage.toString());

    const queryString = params.toString();
    return `${SITE_URL}/agencies${queryString ? `?${queryString}` : ""}`;
  };

  const title = buildTitle();
  const description = buildDescription();
  const keywords = buildKeywords();
  const canonicalUrl = buildCanonicalUrl();

  // Open Graph images
  const ogImages = [];
  if (firstAgency?.logo || firstAgency?.coverImage) {
    ogImages.push({
      url: firstAgency.logo || firstAgency.coverImage,
      width: 1200,
      height: 630,
      alt: `${firstAgency.name} - Private Room on ${SITE_NAME}`,
    });
  }

  // Always add default OG image
  ogImages.push({
    url: `${SITE_URL}/og-agencies.jpg`,
    width: 1200,
    height: 630,
    alt: `${SITE_NAME} - Erotic Private Rooms in Kenya`,
  });

  // Calculate pagination URLs
  const totalPages = Math.ceil(totalAgencies / ITEMS_PER_PAGE);

  const buildPageUrl = (pageNum: number) => {
    const urlParams = new URLSearchParams();
    if (params.county && params.county !== "all")
      urlParams.append("county", params.county);
    if (params.region && params.region !== "all")
      urlParams.append("region", params.region);
    if (params.business && params.business !== "all")
      urlParams.append("business", params.business);
    if (params.town) urlParams.append("town", params.town);
    if (params.verified === "true") urlParams.append("verified", "true");
    if (params.featured === "true") urlParams.append("featured", "true");
    if (params.search) urlParams.append("search", params.search);
    if (pageNum > 1) urlParams.append("page", pageNum.toString());
    const queryString = urlParams.toString();
    return `${SITE_URL}/agencies${queryString ? `?${queryString}` : ""}`;
  };

  return {
    title,
    description,
    keywords,

    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: `${SITE_NAME} Private Rooms`,
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
      ...(currentPage > 1 && {
        prev: buildPageUrl(currentPage - 1),
      }),
      ...(currentPage < totalPages && {
        next: buildPageUrl(currentPage + 1),
      }),
    },

    // Pagination metadata
    ...(currentPage > 1 && {
      title: `${title} - Page ${currentPage}`,
    }),

    // Venue-specific metadata
    category: "Adult Entertainment Venues",

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
      classification: "Adult Entertainment Venues",
      distribution: "global",
      language: "English",
      author: SITE_NAME,
      copyright: `© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.`,
      "og:price:currency": "KES",
      "twitter:app:country": "KE",
      "business:contact_data:country": "Kenya",
      "service:type": params.business || "private rooms",
      "business:hours:start": "00:00",
      "business:hours:end": "23:59",
      "venue:type": formattedBusiness || "private room",
    },
  };
}

// ============ MAIN COMPONENT ============
const AgenciesPage = async ({ searchParams }: Props) => {
  try {
    const rawParams = await searchParams;
    const params = extractFilterParams(rawParams);
    const currentPage = parsePageNumber(params.page);

    // Format values for display
    const formattedCounty = formatLocationName(params.county);
    const formattedRegion = formatLocationName(params.region);
    const formattedBusiness = formatBusinessType(params.business);

    // Fetch agencies with filters
    const response = await getAgencies(
      {
        county: params.county,
        region: params.region,
        business: params.business,
        town: params.town,
        verified: params.verified,
        featured: params.featured,
        search: params.search,
      },
      {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        includeEmployees: true,
      },
    );

    // Handle invalid response
    if (!response || !response.data) {
      console.error("Invalid response from getAgencies:", response);
      return notFound();
    }

    // Build title parts for display
    const { practice, location } = buildTitleParts(params);

    // Build display title without counts
    const displayTitleParts = [];
    if (practice) {
      displayTitleParts.push(practice);
    } else {
      displayTitleParts.push("Erotic Private Rooms");
    }

    if (location) {
      displayTitleParts.push(`in ${location}`);
    } else {
      displayTitleParts.push("in Kenya");
    }

    const displayTitle = displayTitleParts.join(" ");

    // Generate structured data
    const structuredData = generateAgencyStructuredData({
      title: displayTitle,
      description: `Professional ${practice?.toLowerCase() || "erotic private"} rooms ${location ? `in ${location}` : "across Kenya"}.`,
      totalItems: response.pagination?.total || 0,
      currentPage,
      totalPages: response.pagination?.pages || 1,
      filters: {
        county: formattedCounty,
        region: formattedRegion,
        businessType: formattedBusiness,
      },
      items: response.data.slice(0, 10) || [],
    });

    // Generate breadcrumb structured data
    const breadcrumbData = generateBreadcrumbList([
      { name: "Home", url: "/" },
      { name: "Private Rooms", url: "/agencies" },
      ...(formattedCounty
        ? [
            {
              name: `${formattedCounty} Private Rooms`,
              url: `/agencies?county=${params.county}`,
            },
          ]
        : []),
      ...(formattedRegion
        ? [
            {
              name: `${formattedRegion} Private Rooms`,
              url: `/agencies?region=${params.region}`,
            },
          ]
        : []),
      ...(formattedBusiness
        ? [
            {
              name: `${formattedBusiness}`,
              url: `/agencies?business=${params.business}`,
            },
          ]
        : []),
      ...(currentPage > 1
        ? [
            {
              name: `Page ${currentPage}`,
              url: `/agencies?page=${currentPage}`,
            },
          ]
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
          <h1>
            {displayTitle} | {SITE_NAME}
          </h1>
          <p>
            Find verified erotic private rooms and adult entertainment venues
            across Kenya. Discreet, professional, and safe environments.
          </p>
        </div>

        <div className="min-h-screen bg-transparent">
          {/* Header Section */}
          <header className="w-full -mt-4 bg-black">
            <div className="container max-w-2/3  mx-auto px-4 py-6">
              <AgencyFilterInput className="border-0" />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <Breadcrumb>
                <BreadcrumbList className="text-white">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/"
                        className="text-primary hover:text-primary/80 text-lg font-bold"
                      >
                        Introduction
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white">
                    -
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        href="/agencies"
                        className="text-white hover:text-white/80 text-lg font-bold"
                      >
                        Erotic private rooms
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </nav>

            {/* Agency List */}

            {response.data.length > 0 && (
              <AgencyList agencies={response.data} title={displayTitle} />
            )}

            {/* Pagination */}
            {response.pagination && response.pagination.pages > 1 && (
              <div className="mt-8">
                <ClientPaginationWrapper
                  totalPages={response.pagination.pages}
                  currentPage={response.pagination.page}
                  totalItems={response.pagination.total}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            )}

            {/* SEO Section */}
            <SectionArticle />
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in AgenciesPage:", error);
    return notFound();
  }
};

export default AgenciesPage;
