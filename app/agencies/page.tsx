import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import AgencyList from "./AgencyList";
import AgencyFilterInput from "./AgencyFilterInput";
import { getAgencies } from "@/actions/business";
import { GetAgenciesResponse } from "@/types/agency.types";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import SectionArticle from "./SectionArticle";

export const metadata = {
  title: "Erotic Private Agencies in Kenya - Top Escort Services",
  description:
    "Explore top erotic private agencies in Kenya offering professional escort services. Browse verified agency profiles with photos, rates, and locations.",
  keywords:
    "erotic private agencies, escort agencies, Kenya, professional escorts, companionship services",
};

interface AgenciesPageProps {
  searchParams: {
    county?: string;
    region?: string;
    business?: string;
    town?: string;
    verified?: string;
    featured?: string;
    search?: string;
    page?: string;
  };
}

const ITEMS_PER_PAGE = 20; // Make sure this matches your server action

const defaultTitle = "Erotic private rooms";

const page = async ({ searchParams }: AgenciesPageProps) => {
  const params = await searchParams;
  const {
    county,
    region,
    business,
    town,
    verified,
    featured,
    search,
    page = "1",
  } = params;

  // Build dynamic title and subtitle
  const getDynamicTitle = () => {
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
      return defaultTitle;
    }

    return `${parts.join(" ")} ${defaultTitle}`;
  };

  const title = getDynamicTitle();

  const res = await getAgencies(
    {
      county,
      region,
      business,
      town,
      verified,
      featured,
      search,
    },
    {
      page: parseInt(page),
      limit: 12,
      includeEmployees: true,
    },
  );

  console.log("business agencies ==>", res);

  return (
    <div>
      <div className="w-full -mt-4 p-5 pb-6 py-10 bg-black">
        <AgencyFilterInput className="border-0 -mt-4" />
      </div>

      <div className="w-full lg:max-w-[90%] mx-auto p-4">
        <Breadcrumb className="p-4">
          <BreadcrumbList className="items-center flex-nowrap ">
            <BreadcrumbItem>
              <Link
                className="text-primary hover:text-primary bg-transparent text-sm lg:text-lg font-bold"
                href="/"
              >
                Introduction
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-lg text-white">
              -
            </BreadcrumbSeparator>

            <BreadcrumbItem className="cursor-default">
              <Link
                className=" hover:text-white text-white cursor-default bg-transparent text-sm lg:text-lg font-bold"
                href="#"
              >
                Erotic Privates
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AgencyList agencies={res.data || []} title={title} />

        {res.pagination && (
          <ClientPaginationWrapper
            totalPages={res.pagination.pages}
            currentPage={res.pagination.page}
            totalItems={res.pagination.total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}

        <SectionArticle />
      </div>
    </div>
  );
};

export default page;
