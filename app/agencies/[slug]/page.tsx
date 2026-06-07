import {notFound} from "next/navigation";
import React from "react";
import Header from "./Header";
import AgencyProfile from "./AgencyDetailCard";
import {IAgency} from "@/types/agency.types";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


const BusinessPage = async ({params, searchParams}: PageProps) => {
    // Await the params in Next.js 15
    const {slug} = await params;

    const formattedSlug = slug.replace(/-/g, " ");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/agencies/${slug}`,
    );
    const result = await response.json();

    if (!result.success) {
        return notFound();
    }

    const agency: IAgency = result.data;

    return (
        <div className="w-full lg:max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            <Header
                county={agency.county}
                region={agency.region}
                name={agency.name}
            />

            <AgencyProfile agency={agency}/>
        </div>
    );
};

export default BusinessPage;
