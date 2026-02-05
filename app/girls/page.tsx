import React from "react";
import GirlFilterInput from "./GirlFIlterInput";
import ListHeader from "@/components/ListHeader";
import { fetchGirlEscorts } from "@/actions/list-escort";
import GirlList from "@/components/GirlList";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import SectionArticle from "./SectionArticle";

export const metadata = {
  title: "Girls for Sex in Kenya - Over 900+ Verified Escorts",
  description:
    "Discover professional girls for sex in Kenya. Browse verified profiles with photos, rates, and locations. Find the perfect companion for your desires.",
  keywords:
    "girls for sex, escorts,    Kenya, local escorts, companionship, adult services",
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

const defaultTitle = "Girls for Sex";
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

      <ListHeader title={title} subTitle="Erotic massages" />

      <GirlList girls={escorts} />

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
