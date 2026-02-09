import React from "react";
import GirlFilterInput from "./GirlFIlterInput";
import ListHeader from "@/components/ListHeader";
import { fetchGirlEscorts } from "@/actions/list-escort";
import GirlList from "@/components/GirlList";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import SectionArticle from "./SectionArticle";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import NotFoundList from "@/components/NotFoundList";

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    practice?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20; // Make sure this matches your server action

const defaultTitle = "Girls for Sex";
const defaultDescription =
  "Discover professional girls for sex in Kenya. Browse verified profiles with photos, rates, and locations. Find the perfect companion for your desires.";

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

  try {
    const result = await fetchGirlEscorts({
      countyName: params.county,
      regionName: params.region,
      practice: params.practice,
      page: params.page ? parseInt(params.page, 10) : 1,
      limit: ITEMS_PER_PAGE,
    });

    if (result.success) {
      totalEscorts = result.total;
      if (result.escorts.length > 0) {
        firstEscort = result.escorts[0];
      }
    }
  } catch (error) {
    console.error("Error fetching data for metadata:", error);
  }

  // Build dynamic title
  const buildTitle = () => {
    const parts = [];

    if (practice && practice !== "all") {
      parts.push(practice.charAt(0).toUpperCase() + practice.slice(1));
    }

    if (region && region !== "all") {
      parts.push(region);
    }

    if (county && county !== "all") {
      parts.push(county + " County");
    }

    if (parts.length === 0) {
      return `Girls for Sex in Kenya - Over ${totalEscorts}+ Verified Escorts`;
    }

    return `${parts.join(" ")} Girls for Sex in Kenya - ${totalEscorts}+ Profiles`;
  };

  // Build dynamic description
  const buildDescription = () => {
    const parts = [];

    if (practice && practice !== "all") {
      parts.push(`Find ${practice} girls for sex`);
    } else {
      parts.push("Find professional girls for sex");
    }

    if (county && county !== "all" && region && region !== "all") {
      parts.push(`in ${region}, ${county} County, Kenya`);
    } else if (county && county !== "all") {
      parts.push(`in ${county} County, Kenya`);
    } else if (region && region !== "all") {
      parts.push(`in ${region}, Kenya`);
    } else {
      parts.push("in Kenya");
    }

    parts.push(
      `Browse ${totalEscorts}+ verified escort profiles with real photos, rates, reviews, and contact information.`,
    );

    return parts.join(" ");
  };

  // Build keywords
  const buildKeywords = () => {
    const keywords = [
      "girls for sex",
      "escorts",
      "Kenya",
      "local escorts",
      "companionship",
      "adult services",
      "verified profiles",
    ];

    if (county && county !== "all") {
      keywords.push(`${county} escorts`, `${county} county girls`);
    }

    if (region && region !== "all") {
      keywords.push(`${region} escorts`, `girls in ${region}`);
    }

    if (practice && practice !== "all") {
      keywords.push(`${practice} services`, `${practice} girls`);
    }

    return keywords;
  };

  // Build canonical URL
  const buildCanonicalUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
    const params = new URLSearchParams();

    if (county && county !== "all") params.append("county", county);
    if (region && region !== "all") params.append("region", region);
    if (practice && practice !== "all") params.append("practice", practice);
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
      alt: `${firstEscort.name || firstEscort.username} - Verified Escort Profile`,
    });
  } else {
    ogImages.push({
      url: "/og-girls-default.jpg",
      width: 1200,
      height: 630,
      alt: "Girls for Sex in Kenya - Verified Escorts",
    });
  }

  return {
    title,
    description,
    keywords: keywords.join(", "),

    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: "YourSiteName",
      title,
      description,
      url: canonicalUrl,
      images: ogImages,
    },

    twitter: {
      card: "summary_large_image",
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
        prev:
          pageNumber > 1
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/girls?page=${pageNumber - 1}`
            : undefined,
        next:
          pageNumber < Math.ceil(totalEscorts / ITEMS_PER_PAGE)
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/girls?page=${pageNumber + 1}`
            : undefined,
      }),
    },

    // Pagination metadata
    ...(pageNumber > 1 && {
      title: `${title} - Page ${pageNumber}`,
    }),

    // Geographical metadata
    other: {
      "geo.region": "KE",
      "geo.placename": county && county !== "all" ? county : "Kenya",
      "geo.position":
        county && county === "nairobi" ? "-1.286389;36.817223" : "",
      ICBM: county && county === "nairobi" ? "-1.286389, 36.817223" : "",
      rating: "RTA-5042-1996-1400-1577-RTA",
      classification: "Adult Content",
      distribution: "global",
      language: "en",
      author: "YourSiteName",
    },
  };
}
const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const { county, region, practice } = params;

  // Build dynamic title and subtitle
  const getDynamicTitle = () => {
    const parts = [];

    if (practice && practice !== "all") {
      parts.push(practice);
    }

    if (region && region !== "all") {
      parts.push(region);
    }

    if (county && county !== "all") {
      parts.push(county);
    }

    if (parts.length === 0) {
      return defaultTitle;
    }

    return `${parts.join(" ")} ${defaultTitle}`;
  };

  const title = getDynamicTitle();

  const res = await fetchGirlEscorts({
    countyName: params.county,
    regionName: params.region,
    practice: params.practice,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: ITEMS_PER_PAGE,
  });

  if (!res.success) {
    notFound();
  }

  console.log("only girls escorts -->", res);

  const escorts = res.escorts.map((escort) => ({
    ...escort,
    videos: escort.videos || [],
  }));

  return (
    <>
      <div className="bg-black  p-5 pb-6 -mt-4.5">
        <GirlFilterInput />
      </div>

      <ListHeader title={title} subTitle="Girls for sex" />

      {res.success && res.total > 0 && <GirlList girls={escorts} />}

      {res.success && res.total === 0 && (
        <>
          <p className="font-semibold  text-center text-xl">
            {" "}
            <span className="text-primary">
              Unfortunately, we have to disappoint you, but there are no girls
              for sex{" "}
            </span>
            {"  "}
            advertised in this city yet , try girls from other cities below.
            //{" "}
          </p>
          <NotFoundList />
        </>
      )}
      <ClientPaginationWrapper
        totalPages={res.totalPages}
        currentPage={res.page}
        totalItems={res.total}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <SectionArticle />
    </>
  );
};

export default page;
