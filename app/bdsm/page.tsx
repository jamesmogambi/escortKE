import React from "react";
import BDSMHeader from "./BDSMHeader";
import BDSMFilterInput from "./BDSMFilterInput";
import SectionArticle from "./SectionArticle";
import { getBDSMEscorts } from "@/actions/list-escort";
import GirlList from "@/components/GirlList";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";

export const metadata = {
  title: "BDSM Escorts in Kenya - Bondage & Discipline Services",
  description:
    "Discover professional BDSM escorts in Kenya offering bondage, discipline, and other BDSM services. Browse verified profiles with photos, rates, and locations.",
  keywords:
    "BDSM escorts, bondage, discipline, sadomasochism, Kenya, fetish services",
};

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    practice?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20; // Make sure this matches your server action

const defaultTitle = "BDSM";

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

  const res = await getBDSMEscorts({
    county: params.county,
    region: params.region,
    practice: params.practice,
    page: params.page,
  });

  const title = getDynamicTitle();

  console.log("BDSM Escorts Response:", res);
  return (
    <>
      <BDSMHeader title={title} subTitle="" />
      <div className="px-4">
        <BDSMFilterInput />
      </div>
      <GirlList girls={(res.escorts as any) || []} />
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
