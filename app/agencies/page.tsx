export const dynamic = "force-dynamic";
import React from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {ClientPaginationWrapper} from "@/components/ClientPaginationWrapper";
import SectionArticle from "./SectionArticle";
import AgencyList from "./AgencyList";
import AgencyFilterInput from "./AgencyFilterInput";
import {AgenciesResponse} from "@/types/agency.types";
import {generateBreadcrumbList} from "../girls/seo-utils";

// ============ CONSTANTS ============
const ITEMS_PER_PAGE = 12;
const DEFAULT_TITLE = "Erotic Businesses";
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

async function getAgencies(
    page: number = 1,
    limit: number = 12,
): Promise<AgenciesResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000";
    const res = await fetch(
        `${baseUrl}/api/agencies?page=${page}&limit=${limit}&status=active`,
        {
            next: {
                revalidate: 3600, // Revalidate every hour
            },
        },
    );

    if (!res.ok) {
        throw new Error("Failed to fetch agencies");
    }

    return res.json();
}

// ============ MAIN COMPONENT ============
const AgenciesPage = async ({searchParams}: Props) => {
    try {
        const rawParams = await searchParams;
        const params = extractFilterParams(rawParams);
        const currentPage = parsePageNumber(params.page);

        // Format values for display
        const formattedCounty = formatLocationName(params.county);
        const formattedRegion = formatLocationName(params.region);
        const formattedBusiness = formatBusinessType(params.business);

        const {data, success} = await getAgencies(currentPage, ITEMS_PER_PAGE);

        if (!success) {
            return notFound();
        }

        // Build title parts for display
        const {practice, location} = buildTitleParts(params);

        // Build display title without counts
        const displayTitleParts = [];
        if (practice) {
            displayTitleParts.push(practice);
        } else {
            displayTitleParts.push("Erotic Businesses");
        }

        if (location) {
            displayTitleParts.push(`in ${location}`);
        } else {
            displayTitleParts.push("in Kenya");
        }

        const displayTitle = displayTitleParts.join(" ");

        // Generate breadcrumb structured data
        const breadcrumbData = generateBreadcrumbList([
            {name: "Home", url: "/"},
            {name: "Private Rooms", url: "/agencies"},
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
                {/* Hidden SEO elements */}
                <div className="sr-only">
                    <h1>
                        {displayTitle} | {SITE_NAME}
                    </h1>
                    <p>
                        Find verified erotic businesses and adult entertainment venues
                        across Kenya. Discreet, professional, and safe environments.
                    </p>
                </div>

                <div className="min-h-screen bg-transparent">
                    {/* Header Section */}
                    <header className="w-full -mt-4 bg-black">
                        <div className="container max-w-2/3  mx-auto px-4 py-6">
                            <AgencyFilterInput className="border-0"/>
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

                        <AgencyList agencies={data.agencies} title={displayTitle}/>

                        {/* Pagination */}
                        {data.hasMore && (
                            <div className="mt-8">
                                <ClientPaginationWrapper
                                    totalPages={data.totalPages}
                                    currentPage={data.page}
                                    totalItems={data.total}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                />
                            </div>
                        )}

                        {/* SEO Section */}
                        <SectionArticle/>
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
