import React from "react";
import BDSMHeader from "./BDSMHeader";
import BDSMFilterInput from "./BDSMFilterInput";
import SectionArticle from "./SectionArticle";
import GirlList from "@/components/GirlList";
import {ClientPaginationWrapper} from "@/components/ClientPaginationWrapper";
import {ITEMS_PER_PAGE} from "@/constants";
import NotFoundList from "@/components/NotFoundList";
import {Metadata, ResolvingMetadata} from "next";
import {generateBDSMStructuredData} from "./seo-utils";
import {generateBreadcrumbList} from "../girls/seo-utils";
import {getBDSMEscortsClientSide} from "@/server-actions/escort.action";

interface PageProps {
    searchParams: Promise<{
        county?: string;
        region?: string;
        practice?: string;
        page?: string;
    }>;
}

// Helper function to format location names
const formatLocationName = (str: string): string => {
    if (!str || str === "all") return "";
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// Helper function to format BDSM practice types
const formatPracticeType = (type: string): string => {
    if (!type || type === "all") return "";

    const practiceTypes: Record<string, string> = {
        domination: "Domination",
        submission: "Submission",
        bondage: "Bondage",
        discipline: "Discipline",
        sadism: "Sadism",
        masochism: "Masochism",
        "master-slave": "Master/Slave",
        "rope-bondage": "Rope Bondage",
        shibari: "Shibari",
        "impact-play": "Impact Play",
        "sensory-deprivation": "Sensory Deprivation",
        roleplay: "Roleplay",
        kink: "Kink",
        fetish: "Fetish",
    };

    return (
        practiceTypes[type.toLowerCase()] ||
        type
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
};

// Generate dynamic metadata
export async function generateMetadata(
    {searchParams}: PageProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params: any = await searchParams;
    const {county, region, practice, page} = params;
    const pageNumber = page ? parseInt(page) : 1;

    // Fetch data for metadata generation
    let totalBDSM = 0;
    let firstBDSM = null;
    let uniqueLocations: string[] = [];

    try {
        // Fetch BDSM escorts
        const {
            escorts,
            total,
            totalPages,
            page: currentPageFromResponse,
            hasMore,
        } = await getBDSMEscortsClientSide({
            page: params.page ? parseInt(params.page, 10) : 1,
            limit: ITEMS_PER_PAGE,
            county: params.county === "all" ? undefined : params.county,
            region: params.region === "all" ? undefined : params.region,
            isActive: true,
            isVerified: undefined, // Show all verified and unverified
            isFeatured: undefined, // Show all featured and non-featured
        });
        if (escorts) {
            totalBDSM = total || 0;
            if (escorts && escorts.length > 0) {
                firstBDSM = escorts[0];

                // Extract unique locations for keywords
                const locations = escorts
                    .map((e: any) => e.town || e.workingAreas?.[0]?.countyName)
                    .filter(Boolean);
                uniqueLocations = [...new Set(locations)] as string[];
            }
        }
    } catch (error) {
        console.error("Error fetching data for metadata:", error);
    }

    // Format filter values for display
    const formattedCounty = formatLocationName(county);
    const formattedRegion = formatLocationName(region);
    const formattedPractice = formatPracticeType(practice || "");

    // Build dynamic title
    const buildTitle = () => {
        const parts = [];

        // Add BDSM type/practice
        if (formattedPractice) {
            parts.push(formattedPractice);
        } else {
            parts.push("BDSM");
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
        const withBrand = `${baseTitle} | KENYADIVAS BDSM`;

        return pageNumber > 1 ? `${withBrand} - Page ${pageNumber}` : withBrand;
    };

    // Build dynamic description
    const buildDescription = () => {
        const practiceText = formattedPractice?.toLowerCase() || "BDSM";
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

        return `KENYADIVAS BDSM - Discover professional ${practiceText} practitioners ${locationPhrase.join(" ")}. Browse ${totalBDSM}+ verified dominatrix, submissive, and kink-friendly escorts. Real photos, authentic reviews, and discreet BDSM experiences.`;
    };

    // Build comprehensive keywords
    const buildKeywords = () => {
        const keywords = new Set<string>([
            "KENYADIVAS BDSM",
            "BDSM Kenya",
            "dominatrix Kenya",
            "domination services",
            "submission",
            "bondage",
            "discipline",
            "sadism",
            "masochism",
            "kink friendly",
            "fetish escorts",
            "master slave",
            "rope bondage",
            "shibari",
            "impact play",
            "sensory deprivation",
            "BDSM roleplay",
            "adult kink",
            "Nairobi BDSM",
            "Mombasa BDSM",
            "Kisumu BDSM",
            "professional dominatrix",
            "BDSM sessions",
        ]);

        if (formattedPractice) {
            keywords.add(`${formattedPractice.toLowerCase()} Kenya`);
            keywords.add(`${formattedPractice.toLowerCase()} services`);
            keywords.add(`${formattedPractice.toLowerCase()} practitioners`);
        }

        if (formattedCounty) {
            keywords.add(`${formattedCounty} BDSM`);
            keywords.add(`BDSM in ${formattedCounty}`);
            keywords.add(`${formattedCounty} dominatrix`);
        }

        if (formattedRegion) {
            keywords.add(`${formattedRegion} BDSM`);
            keywords.add(`BDSM in ${formattedRegion}`);
        }

        // Add unique locations from actual escorts
        uniqueLocations.slice(0, 5).forEach((location) => {
            keywords.add(`${location} BDSM`);
            keywords.add(`BDSM in ${location}`);
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
        return `${baseUrl}/bdsm-escorts${queryString ? `?${queryString}` : ""}`;
    };

    const title = buildTitle();
    const description = buildDescription();
    const keywords = buildKeywords();
    const canonicalUrl = buildCanonicalUrl();

    // Open Graph images
    const ogImages = [];
    if (firstBDSM?.previewPhoto) {
        ogImages.push({
            url: firstBDSM.previewPhoto,
            width: 1200,
            height: 630,
            alt: `${firstBDSM.name || firstBDSM.username} - BDSM Practitioner on KENYADIVAS`,
        });
    }

    // Always add default OG image
    ogImages.push({
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com"}/og-bdsm.jpg`,
        width: 1200,
        height: 630,
        alt: "KENYADIVAS BDSM - Professional BDSM Services in Kenya",
    });

    // Calculate pagination URLs
    const totalPages = Math.ceil(totalBDSM / ITEMS_PER_PAGE);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";

    const buildPageUrl = (pageNum: number) => {
        const params = new URLSearchParams();
        if (county && county !== "all") params.append("county", county);
        if (region && region !== "all") params.append("region", region);
        if (practice && practice !== "all") params.append("practice", practice);
        if (pageNum > 1) params.append("page", pageNum.toString());
        const queryString = params.toString();
        return `${baseUrl}/bdsm-escorts${queryString ? `?${queryString}` : ""}`;
    };

    return {
        title,
        description,
        keywords,

        openGraph: {
            type: "website",
            locale: "en_KE",
            siteName: "KENYADIVAS BDSM",
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

        // BDSM-specific metadata
        category: "BDSM Services",

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
            classification: "Adult BDSM Services",
            distribution: "global",
            language: "English",
            author: "KENYADIVAS BDSM",
            copyright: `© ${new Date().getFullYear()} KENYADIVAS. All rights reserved.`,
            "og:price:currency": "KES",
            "twitter:app:country": "KE",
            "business:contact_data:country": "Kenya",
            "service:type": practice || "BDSM",
            "business:hours:start": "00:00",
            "business:hours:end": "23:59",
            "bdsm:specialty": formattedPractice || "BDSM",
            "bdsm:safe_sane_consensual": "true",
        },
    };
}

// Generate dynamic title for display (MORE EXPLICIT VERSION)
const getDynamicTitle = (params: {
    county?: string;
    region?: string;
    practice?: string;
}): string => {
    const {county, region, practice} = params;

    // Get practice text
    const practiceText =
        practice && practice !== "all" ? formatPracticeType(practice) : "BDSM";

    // Get location text
    let locationText = "";
    const locationParts = [];

    if (region && region !== "all") {
        locationParts.push(formatLocationName(region));
    }
    if (county && county !== "all") {
        locationParts.push(formatLocationName(county));
    }

    if (locationParts.length > 0) {
        locationText = `in ${locationParts.join(", ")}`;
    }

    return `${practiceText} ${locationText}`;
};
const BDSMPage = async ({searchParams}: PageProps) => {
    const params: any = await searchParams;
    const {county, region, practice} = params;
    const currentPage = params.page ? parseInt(params.page) : 1;

    // Format values for display
    const formattedCounty = formatLocationName(county);
    const formattedRegion = formatLocationName(region);
    const formattedPractice = formatPracticeType(practice || "");

    // Fetch BDSM escorts
    const {
        escorts,
        total,
        totalPages,
        page: currentPageFromResponse,
        hasMore,
    } = await getBDSMEscortsClientSide({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        county: params.county === "all" ? undefined : params.county,
        region: params.region === "all" ? undefined : params.region,
        isActive: true,
        isVerified: undefined, // Show all verified and unverified
        isFeatured: undefined, // Show all featured and non-featured
    });

    const title = getDynamicTitle({county, region, practice});

    // Generate structured data
    const structuredData = generateBDSMStructuredData({
        title,
        description: `Professional ${formattedPractice || "BDSM"} services ${formattedCounty ? `in ${formattedCounty}` : "across Kenya"}.`,
        totalItems: total,
        currentPage,
        totalPages: totalPages,
        filters: {
            county: formattedCounty,
            region: formattedRegion,
            practice: formattedPractice,
        },
        items: escorts?.slice(0, 10) || [],
    });

    // Generate breadcrumb structured data
    const breadcrumbData = generateBreadcrumbList([
        {name: "Home", url: "/"},
        {name: "BDSM Escorts", url: "/bdsm-escorts"},
        ...(formattedCounty
            ? [
                {
                    name: `${formattedCounty} BDSM`,
                    url: `/bdsm-escorts?county=${county}`,
                },
            ]
            : []),
        ...(formattedRegion
            ? [
                {
                    name: `${formattedRegion} BDSM`,
                    url: `/bdsm-escorts?region=${region}`,
                },
            ]
            : []),
        ...(formattedPractice
            ? [
                {
                    name: `${formattedPractice}`,
                    url: `/bdsm-escorts?practice=${practice}`,
                },
            ]
            : []),
        ...(currentPage > 1
            ? [
                {
                    name: `Page ${currentPage}`,
                    url: `/bdsm-escorts?page=${currentPage}`,
                },
            ]
            : []),
    ]);

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbData)}}
            />

            {/* Hidden SEO elements */}
            <div className="sr-only">
                <h1>{title} | KENYADIVAS BDSM</h1>
                <p>
                    Professional BDSM services in Kenya. Find verified dominatrix,
                    submissive, and kink-friendly practitioners for safe, consensual
                    experiences.
                </p>
            </div>

            {/* Header */}
            <BDSMHeader title={title} subTitle=""/>

            {/* Filter Section */}
            <div className="px-4">
                <div className="max-w-2/3 mx-auto">
                    <BDSMFilterInput/>
                </div>
            </div>

            {/* Results List */}
            {total > 0 && <GirlList girls={escorts}/>}
            {total === 0 && <NotFoundList/>}

            {/* Pagination */}
            <ClientPaginationWrapper
                totalPages={totalPages}
                currentPage={currentPageFromResponse}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
            />

            {/* SEO Content Section */}
            <SectionArticle/>
        </>
    );
};

export default BDSMPage;
