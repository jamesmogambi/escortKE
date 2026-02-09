import {
  getAllEroticMassageEscorts,
  getFilteredEscorts,
  getFilteredMassageEscorts,
  getMassageEscorts,
} from "@/actions/masseuse";
import { AppPagination } from "@/components/AppPagination";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import FilterInput from "@/components/FilterInput";
import GirlList from "@/components/GirlList";
import ListHeader from "@/components/ListHeader";
import React from "react";
import SectionArticle from "./SectionArticle";
import MassageTypeFilterInput from "./MassageFilterInput";

// export const metadata = {
//   title: "Erotic Massage Escorts in Kenya - Sensual & Body Massages",
//   description:
//     "Find professional masseuses and massage escorts offering various massage services across Kenya. Browse verified profiles with photos, rates, and locations.",
//   keywords:
//     "massage escorts, masseuses, erotic massage, body massage, Kenya, sensual massage",
// };

// Helper function to generate dynamic title
const generateListHeaderTitle = (params: {
  county?: string;
  region?: string;
  massageType?: string;
  total?: number;
}) => {
  const { county, region, massageType, total } = params;
  const parts = [];

  // Add total count if available
  // if (total !== undefined) {
  //   parts.push(`${total} Masseuse${total !== 1 ? "s" : ""}`);
  // }

  // Add massage type
  if (massageType) {
    parts.push(massageType);
  } else if (!county && !region) {
    parts.push("Erotic");
    // parts.push("Massages");
  }

  if (!massageType) {
    parts.push("Massages");
  }

  // parts.push("Massages");

  // Add location
  if (county && region) {
    parts.push(`in ${region}, ${county} County`);
  } else if (county) {
    parts.push(`in ${county} County`);
  } else if (region) {
    parts.push(`in ${region}`);
  }

  // Add Kenya if no location specified
  // if (!county && !region) {
  //   parts.push("in Kenya");
  // }

  return parts.join(" ");
};

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    massageType?: string;
    page?: string;
  }>;
}

// Add these helper functions at the top of your file
const generateMetaTitle = (params: {
  county?: string;
  region?: string;
  massageType?: string;
}): string => {
  const { county, region, massageType } = params;
  const parts = ["Erotic Massage Escorts"];

  if (massageType) {
    parts.unshift(massageType); // Put massage type first for better keyword prominence
  }

  if (region && county) {
    parts.push(`in ${region}, ${county} County, Kenya`);
  } else if (county) {
    parts.push(`in ${county} County, Kenya`);
  } else if (region) {
    parts.push(`in ${region}, Kenya`);
  } else {
    parts.push("in Kenya");
  }

  return parts.join(" ");
};

const generateMetaDescription = (params: {
  county?: string;
  region?: string;
  massageType?: string;
}): string => {
  const { county, region, massageType } = params;
  const parts = [];

  if (massageType) {
    parts.push(`Professional ${massageType.toLowerCase()} services`);
  } else {
    parts.push("Professional erotic massage services");
  }

  parts.push("with verified masseuses and massage escorts");

  if (region && county) {
    parts.push(`in ${region}, ${county} County.`);
  } else if (county) {
    parts.push(`in ${county} County.`);
  } else if (region) {
    parts.push(`in ${region}.`);
  } else {
    parts.push("across Kenya.");
  }

  parts.push("Browse profiles with photos, rates, and locations.");

  return parts.join(" ");
};

// Refactored metadata section
export const generateMetadata = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const title = generateMetaTitle(params);
  const description = generateMetaDescription(params);

  // Dynamic keywords based on filters
  const baseKeywords = [
    "massage escorts",
    "masseuses",
    "erotic massage",
    "body massage",
    "sensual massage",
    "massage services",
  ];

  const dynamicKeywords = [];
  if (params.massageType) {
    dynamicKeywords.push(`${params.massageType.toLowerCase()} massage`);
  }
  if (params.county) {
    dynamicKeywords.push(`${params.county} County massage`);
    dynamicKeywords.push(`${params.county} masseuses`);
  }
  if (params.region) {
    dynamicKeywords.push(`${params.region} massage`);
    dynamicKeywords.push(`${params.region} escorts`);
  }

  const keywords = [...dynamicKeywords, ...baseKeywords, "Kenya"].join(", ");

  // Open Graph metadata for social sharing
  const openGraph = {
    title,
    description,
    type: "website" as const,
    url: `https://yourdomain.com/massage-escorts${params.county || params.region || params.massageType ? "?" + new URLSearchParams(params as any).toString() : ""}`,
    images: [
      {
        url: "https://yourdomain.com/og-massage-escorts.jpg", // Add a relevant OG image
        width: 1200,
        height: 630,
        alt: "Massage Escorts in Kenya",
      },
    ],
  };

  // Twitter Card metadata
  const twitter = {
    card: "summary_large_image" as const,
    title,
    description,
    images: ["https://yourdomain.com/twitter-massage-escorts.jpg"], // Add Twitter-specific image
  };

  // Canonical URL for SEO
  const canonical = `https://yourdomain.com/massage-escorts`;

  return {
    title,
    description,
    keywords,
    openGraph,
    twitter,
    alternates: {
      canonical,
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
    verification: {
      google: "your-google-verification-code", // Add your verification code
    },
  };
};

// Keep your existing generateListHeaderTitle function as it's used for display
const ITEMS_PER_PAGE = 20; // Make sure this matches your server action

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  // Check if any filters are applied
  const hasFilters = !!(params.county || params.region || params.massageType);

  let result;

  console.log("params", params);
  if (hasFilters) {
    // Use filtered search when any filter is applied
    result = await getFilteredMassageEscorts({
      county: params.county,
      region: params.region,
      massageType: params.massageType,
      page: page,
      limit: ITEMS_PER_PAGE,
    });
  } else {
    // Show erotic massage escorts by default when no filters
    result = await getAllEroticMassageEscorts(page, ITEMS_PER_PAGE);
  }

  console.log("masseuses +++ =>>", result.data.escorts);
  console.log("pagination info =>>", result.data.pagination);

  // Generate dynamic title
  const listHeaderTitle = generateListHeaderTitle({
    county: params.county,
    region: params.region,
    massageType: params.massageType,
    total: result.data.pagination.total,
  });

  return (
    <>
      <div className="bg-black  p-5 pb-6 -mt-4.5">
        <MassageTypeFilterInput />
      </div>
      <ListHeader title={listHeaderTitle} subTitle="Erotic massages" />
      <GirlList girls={(result.data.escorts as any) || []} />
      <ClientPaginationWrapper
        totalPages={result.data.pagination.totalPages}
        currentPage={page}
        totalItems={result.data.pagination.total}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <SectionArticle />
    </>
  );
};

export default page;
