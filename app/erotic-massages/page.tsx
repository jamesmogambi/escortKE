import { getMassageEscorts } from "@/actions/masseuse";
import { AppPagination } from "@/components/AppPagination";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import FilterInput from "@/components/FilterInput";
import GirlList from "@/components/GirlList";
import ListHeader from "@/components/ListHeader";
import React from "react";
import SectionArticle from "./SectionArticle";

interface PageProps {
  searchParams: {
    page?: string;
    countyId?: string;
    regionId?: string;
    town?: string;
    estate?: string;
    category?: string;
    verified?: string;
    sort?: string;
  };
}

export const metadata = {
  title: "Massage Escorts - Professional Masseuses in Kenya",
  description:
    "Find professional masseuses and massage escorts offering various massage services across Kenya. Browse verified profiles with photos, rates, and locations.",
  keywords:
    "massage escorts, masseuses, erotic massage, body massage, Kenya, sensual massage",
};

const ITEMS_PER_PAGE = 5; // Make sure this matches your server action

const page = async ({ searchParams }: PageProps) => {
  const currentPage = Number(searchParams.page) || 1;

  const filters = {};

  // Fetch paginated massage escorts
  const { items: massageEscorts, ...paginationInfo } = await getMassageEscorts(
    currentPage,
    ITEMS_PER_PAGE,
    // filters,
  );

  console.log("masseuses +++ =>>", massageEscorts);
  console.log("pagination info =>>", paginationInfo);

  return (
    <>
      <div className="bg-black  p-5 pb-6 -mt-4.5">
        <FilterInput />
      </div>
      <ListHeader title="Erotic Massages" />
      <GirlList girls={massageEscorts} />
      <ClientPaginationWrapper
        totalPages={paginationInfo.totalPages}
        currentPage={currentPage}
        totalItems={paginationInfo.totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* TODO://POPULATE THE ARTRICLE WITH TEXT */}

      <SectionArticle />
    </>
  );
};

export default page;
