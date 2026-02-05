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

export const metadata = {
  title: "Erotic Massage Escorts in Kenya - Sensual & Body Massages",
  description:
    "Find professional masseuses and massage escorts offering various massage services across Kenya. Browse verified profiles with photos, rates, and locations.",
  keywords:
    "massage escorts, masseuses, erotic massage, body massage, Kenya, sensual massage",
};

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

// Function to generate page metadata dynamically
const generateMetadata = async (params: {
  county?: string;
  region?: string;
  massageType?: string;
}) => {
  const { county, region, massageType } = params;
  const locationParts = [];

  if (county && region) {
    locationParts.push(`${region}, ${county} County`);
  } else if (county) {
    locationParts.push(`${county} County`);
  } else if (region) {
    locationParts.push(region);
  } else {
    locationParts.push("Kenya");
  }

  const location = locationParts.join(", ");
  const massageText = massageType || "Erotic & Sensual";

  return {
    title: `${massageText} Massage Escorts in ${location} | Professional Masseuses`,
    description: `Find verified ${massageText.toLowerCase()} massage escorts and professional masseuses in ${location}. Browse profiles with photos, rates, services, and contact information.`,
    keywords: `${massageText.toLowerCase()} massage, masseuses, escorts, ${location}, body massage, sensual therapy`,
  };
};

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    massageType?: string;
    page?: string;
  }>;
}

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
      <ListHeader title={listHeaderTitle} subTitle="Girls for sex" />
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
