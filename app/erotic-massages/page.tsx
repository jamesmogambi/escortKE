import { getMassageEscorts } from "@/actions/masseuse";
import GirlList from "@/components/GirlList";
import React from "react";

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

//  export const metadata = {
//   title: "Erotic Massages in Kenya - Find the Best Massage Services | escortke.com",
//   description:
//     "Discover top-rated erotic massage services in Kenya. Explore our curated list of professional masseuses offering relaxing and sensual experiences.",
// };
const page = async ({ searchParams }: PageProps) => {
  const currentPage = Number(searchParams.page) || 1;

  const filters = {};

  // Fetch paginated massage escorts
  const { items: massageEscorts, ...paginationInfo } = await getMassageEscorts(
    currentPage,
    20, // Items per page
    // filters,
  );

  console.log("masseuses +++ =>>", massageEscorts);
  console.log("pagination info =>>", paginationInfo);

  return (
    <>
      {/* <GirlList girls={} /> */}

      <div>Masseuses Only page</div>
    </>
  );
};

export default page;
