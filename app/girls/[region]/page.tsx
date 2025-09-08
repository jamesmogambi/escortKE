import React from "react";
import HeaderSection from "./HeaderSection";
import { formatSlugToTitle } from "@/lib/utils";
import LocationInitializer from "@/components/FileInputInitializer";
import { fetchEscorts } from "@/actions/escort";
import { AppPagination } from "@/components/AppPagination";

interface PageProps {
  params: { region: string };
  searchParams: {
    town?: string;
    region?: string;
    practice?: string | string[]; // could be comma-separated or array
    page?: string;
    limit?: string;
  };
}

// TODO: GET GIRLS OF A GIVEN REGION
const page = async ({ params, searchParams }: PageProps) => {
  const { region } = await params;
  const area = formatSlugToTitle(region);

  const {
    town,
    region: queryRegion,
    practice,
    page = "1",
    limit = "20",
  } = await searchParams;

  // Normalize practices to array
  const normalizedPractices =
    typeof practice === "string"
      ? practice.split(",").map((p) => p.trim())
      : Array.isArray(practice)
        ? practice
        : [];

  console.log(
    "all query params",
    town,
    queryRegion,
    normalizedPractices,
    page,
    limit
  );

  const res = await fetchEscorts({
    town,
    region,
    practices: normalizedPractices,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  console.log("escorts from server>>>>>", res);

  return (
    <div className="">
      {/* <LocationInitializer /> */}

      <HeaderSection />
      <h5 className="font-bold text-lg mx-3 text-center lg:text-start lg:ml-28 mt-4 mb-4">
        <span className="text-primary mr-2">Introduction</span> -{"   "}
        <span className="text-primary ml-2 mr-2"> {area} Region</span> -{" "}
        <span className="ml-2">{area}</span>
      </h5>

      <h4 className=" text-white text-center font-semibold text-3xl">
        Sex {area}
      </h4>

      {/* List */}

      {/* <AppPagination currentPage={res.page} totalPages={res.totalPages} /> */}
    </div>
  );
};

export default page;
