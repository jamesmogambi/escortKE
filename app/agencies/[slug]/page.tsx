import { getAgencyBySlug } from "@/actions/business";
import { notFound } from "next/navigation";
import React from "react";
import Header from "./Header";
import { generateAgencyMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import AgencyProfile from "./AgencyDetailCard";
import CompanyGirls from "./CompanyGirls";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await getAgencyBySlug(slug);

    if (!res.success || !res.data) {
      return {
        title: "Agency Not Found",
        description: "The requested agency could not be found.",
      };
    }

    return generateAgencyMetadata({
      agency: res.data,
      slug,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Agency Details",
      description: "View agency details and services.",
    };
  }
}

const BusinessPage = async ({ params, searchParams }: PageProps) => {
  // Await the params in Next.js 15
  const { slug } = await params;

  const formattedSlug = slug.replace(/-/g, " ");

  const res = await getAgencyBySlug(slug);

  if (!res.success || !res.data) {
    notFound(); // optional: redirect to 404
  }

  //   const agency = Array.isArray(res.data) ? res.data[0] : res.data;
  const agency: any = res.data;
  console.log("agency data ==>", agency);

  if (!agency) {
    notFound();
  }

  return (
    <div className="w-full lg:max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
      <Header
        county={agency.county?.name || ""}
        region={agency.region?.name || ""}
        name={agency.name}
      />

      <AgencyProfile agency={agency} />
    </div>
  );
};

export default BusinessPage;
