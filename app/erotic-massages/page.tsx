// app/massage-escorts/page.tsx
import { AppPagination } from "@/components/AppPagination";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import FilterInput from "@/components/FilterInput";
import GirlList from "@/components/GirlList";
import ListHeader from "@/components/ListHeader";
import React from "react";
import SectionArticle from "./SectionArticle";
import MassageTypeFilterInput from "./MassageFilterInput";
import { fetchMassageEscorts } from "@/actions/masseuse.action";
import { ITEMS_PER_PAGE } from "@/constants";
import NotFoundList from "@/components/NotFoundList";

// Helper function to generate dynamic title

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    massageType?: string;
    page?: string;
  }>;
}

// Generate metadata
export const generateMetadata = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const title = params.massageType
    ? `${params.massageType} Massage Escorts ${params.region ? `in ${params.region}` : params.county ? `in ${params.county}` : "in Kenya"}`
    : `Erotic Massage Escorts ${params.region ? `in ${params.region}` : params.county ? `in ${params.county}` : "in Kenya"}`;

  const description = `Find verified ${params.massageType || "erotic"} massage escorts and masseuses ${params.region ? `in ${params.region}` : params.county ? `in ${params.county}` : "across Kenya"}. Browse profiles with photos, rates, and locations.`;

  return {
    title,
    description,
  };
};

/**
 * Generate h1 title for the page (displayed in ListHeader)
 */
const generateListHeaderTitle = (params: {
  county?: string;
  region?: string;
  massageType?: string;
  total?: number;
}): string => {
  const { county, region, massageType, total } = params;
  const parts = [];

  // Add total count if available (for SEO and user clarity)
  if (total !== undefined) {
    parts.push(`${total} Masseuse${total !== 1 ? "s" : ""}`);
  }

  // Add massage type or default to "Erotic"
  if (massageType) {
    parts.push(massageType);
  } else {
    parts.push("Erotic");
  }

  parts.push("Massages");

  // Add location
  if (county && region) {
    parts.push(`in ${region}, ${county} County`);
  } else if (county) {
    parts.push(`in ${county} County`);
  } else if (region) {
    parts.push(`in ${region}`);
  } else {
    parts.push("in Kenya");
  }

  return parts.join(" ");
};

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page) : 1;

  // Fetch massage escorts based on filters
  const data = await fetchMassageEscorts({
    county: params.county,
    region: params.region,
    massageType: params.massageType,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    gender: "girl", // Default to girls for massage escorts
  });

  console.log("Fetched massage escorts:", data);

  // Generate dynamic title
  const listHeaderTitle = generateListHeaderTitle({
    county: params.county,
    region: params.region,
    massageType: params.massageType,
    total: data.total,
  });

  return (
    <>
      <div className="bg-black p-5 pb-6 -mt-4.5">
        <MassageTypeFilterInput />
      </div>

      <ListHeader
        title={listHeaderTitle}
        subTitle={
          params.massageType
            ? `${params.massageType} specialists`
            : "Erotic massages"
        }
      />

      {data.total === 0 && <NotFoundList />}
      {data.total > 0 && <GirlList girls={data.escorts as any} />}

      <ClientPaginationWrapper
        totalPages={data.totalPages}
        currentPage={currentPage}
        totalItems={data.total}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <SectionArticle />
    </>
  );
};

export default page;
