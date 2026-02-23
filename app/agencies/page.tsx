export const dynamic = "force-dynamic";
import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
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

// ============ CONSTANTS ============
const ITEMS_PER_PAGE = 12;
const DEFAULT_TITLE = "Erotic Private Rooms";
const DEFAULT_BREADCRUMB = "Erotic Privates";

// ============ TYPES ============
// Fix: Use the correct Next.js page props type
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

// ============ METADATA ============
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = (await searchParams) as FilterParams;

  // Build dynamic title based on filters
  const title = generatePageTitle({
    business: params.business as string,
    region: params.region as string,
    county: params.county as string,
  });

  // Build dynamic description
  const description = generatePageDescription({
    business: params.business as string,
    region: params.region as string,
    county: params.county as string,
    town: params.town as string,
  });

  // Build dynamic keywords
  const keywords = generatePageKeywords({
    business: params.business as string,
    region: params.region as string,
    county: params.county as string,
  });

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: generateCanonicalUrl(params as FilterParams),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: generateCanonicalUrl(params as FilterParams),
      siteName: "KenyaDivas",
    },
  };
}

// ============ HELPER FUNCTIONS ============

/**
 * Generate dynamic page title based on filters
 */
function generatePageTitle(filters: {
  business?: string;
  region?: string;
  county?: string;
}): string {
  const { business, region, county } = filters;
  const parts = [];

  if (business && business !== "all") {
    parts.push(business);
  }

  if (region && region !== "all") {
    parts.push(region);
  }

  if (county && county !== "all") {
    parts.push(county);
  }

  if (parts.length === 0) {
    return `${DEFAULT_TITLE} in Kenya | KenyaDivas`;
  }

  return `${parts.join(" ")} ${DEFAULT_TITLE} in Kenya | KenyaDivas`;
}

/**
 * Generate dynamic meta description
 */
function generatePageDescription(filters: {
  business?: string;
  region?: string;
  county?: string;
  town?: string;
}): string {
  const { business, region, county, town } = filters;

  let location = "Kenya";
  if (town) location = town;
  else if (region) location = region;
  else if (county) location = `${county} County`;

  const businessType = business && business !== "all" ? `${business} ` : "";

  return `Discover the best ${businessType}erotic private agencies in ${location}. Browse verified profiles with real photos, rates, and locations. Book your premium experience today.`;
}

/**
 * Generate dynamic keywords
 */
function generatePageKeywords(filters: {
  business?: string;
  region?: string;
  county?: string;
}): string {
  const { business, region, county } = filters;

  const baseKeywords = [
    "erotic private agencies",
    "escort agencies",
    "premium escorts",
    "companionship services",
    "Kenya escorts",
  ];

  const locationKeywords = [];
  if (county && county !== "all") {
    locationKeywords.push(`${county} county agencies`);
    locationKeywords.push(`${county} escorts`);
  }
  if (region && region !== "all") {
    locationKeywords.push(`${region} agencies`);
    locationKeywords.push(`${region} escorts`);
  }
  if (business && business !== "all") {
    locationKeywords.push(`${business} agencies`);
  }

  return [...locationKeywords, ...baseKeywords].join(", ");
}

/**
 * Generate canonical URL
 */
function generateCanonicalUrl(params: FilterParams): string {
  const baseUrl = "https://kenyadivas.com/agencies";
  const queryParams = new URLSearchParams();

  if (params.county) queryParams.append("county", params.county);
  if (params.region) queryParams.append("region", params.region);
  if (params.business) queryParams.append("business", params.business);
  if (params.town) queryParams.append("town", params.town);
  if (params.verified) queryParams.append("verified", params.verified);
  if (params.featured) queryParams.append("featured", params.featured);
  if (params.search) queryParams.append("search", params.search);

  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parse and validate page number
 */
function parsePageNumber(page?: string): number {
  const parsed = page ? parseInt(page) : 1;
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

/**
 * Build filter options for the page title display
 */
function buildTitleParts(params: FilterParams): string[] {
  const parts = [];

  if (params.business && params.business !== "all") {
    parts.push(params.business);
  }
  if (params.region && params.region !== "all") {
    parts.push(params.region);
  }
  if (params.county && params.county !== "all") {
    parts.push(params.county);
  }

  return parts;
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

// ============ MAIN COMPONENT ============
const AgenciesPage = async ({ searchParams }: Props) => {
  try {
    const rawParams = await searchParams;
    const params = extractFilterParams(rawParams);
    const currentPage = parsePageNumber(params.page);

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
    const titleParts = buildTitleParts(params);
    const displayTitle =
      titleParts.length > 0
        ? `${titleParts.join(" ")} ${DEFAULT_TITLE}`
        : DEFAULT_TITLE;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <header className="w-full bg-black">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              {displayTitle}
            </h1>
            <AgencyFilterInput className="border-0" />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-600">
                    {DEFAULT_BREADCRUMB}
                  </BreadcrumbPage>
                </BreadcrumbItem>

                {/* Add dynamic breadcrumb items based on filters */}
                {params.region && params.region !== "all" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-gray-600">
                        {params.region}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}

                {params.county && params.county !== "all" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-gray-600">
                        {params.county} County
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {response.data.length} of {response.pagination?.total || 0}{" "}
            agencies
          </div>

          {/* Agency List */}
          {response.data.length > 0 ? (
            <AgencyList agencies={response.data} title={displayTitle} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">
                No agencies found matching your criteria.
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your filters or browse all agencies.
              </p>
            </div>
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
    );
  } catch (error) {
    console.error("Error in AgenciesPage:", error);
    return notFound();
  }
};

export default AgenciesPage;
