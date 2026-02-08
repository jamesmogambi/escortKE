import React from "react";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Minus } from "lucide-react";
import Link from "next/link";
import GirlProfile from "../GirlProfile";
import { girls } from "@/fixtures/girl";
import { getEscortByUsername } from "@/actions/escort";
import { Metadata, ResolvingMetadata } from "next";
import { formatSlugToTitle } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata function
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Read route parameters
  const { slug } = await params;

  try {
    const result = await getEscortByUsername(decodeURIComponent(slug));

    if (!result.success || !result.data) {
      return {
        title: "Escort Not Found",
        description: "The requested escort profile could not be found.",
      };
    }

    const escort = result.data;

    // Format the username for display
    const formatUsername = (username: string) => {
      return username
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const displayName = formatUsername(escort.username);
    const escortName = escort.name || displayName;

    // Create metadata
    const metadata: Metadata = {
      title: `${escortName} - ${escort.town || escort.countyDetails?.name || "Kenya"} | Premium Escort`,
      description: escort.about
        ? `${escortName} - ${escort.about.substring(0, 150)}...`
        : `${escortName} is a ${escort.age ? escort.age + " year old " : ""}escort in ${escort.town || escort.countyDetails?.name || "Kenya"}. Available for incall and outcall services.`,

      keywords: [
        escortName,
        "escort",
        "Kenya",
        escort.town || "",
        escort.countyDetails?.name || "",
        "premium",
        "companion",
        ...(escort.categories || []),
        ...(escort.labels || []),
      ].filter(Boolean),

      openGraph: {
        type: "profile",
        title: `${escortName} - Premium Escort Services`,
        description:
          escort.about?.substring(0, 200) ||
          `${escortName} - Professional escort services available.`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/girls/${escort.username}`,
        siteName: "Your Site Name",
        images: escort.previewPhoto
          ? [
              {
                url: escort.previewPhoto,
                width: 1200,
                height: 630,
                alt: `${escortName} - Escort Profile Photo`,
              },
            ]
          : [],
        locale: "en_KE",
      },

      twitter: {
        card: "summary_large_image",
        title: `${escortName} - Premium Escort`,
        description:
          escort.about?.substring(0, 150) ||
          `${escortName} - Available for bookings.`,
        images: escort.previewPhoto ? [escort.previewPhoto] : [],
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_PROFILE}/girls/${escort.username}`,
      },
    };

    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Escort Profile",
      description: "View escort profile details and services.",
    };
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const result = await getEscortByUsername(decodeURIComponent(slug));

  if (!result.success || !result.data) {
    notFound();
  }

  const escort = result.data;

  console.log("individual escort ==>", escort);
  const { name, username, regionDetails, countyDetails } = escort;

  const formatUsername = (username: string) => {
    return username
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-full lg:max-w-7xl mx-auto p">
      {/* // introduction */}

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
          <BreadcrumbSeparator className="text-lg font-bold text-white">
            -
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <Link
              className="text-primary capitalize hover:text-primary bg-transparent text-sm lg:text-lg font-bold"
              href={`/girls?region=${regionDetails?.name}`}
            >
              {/* sex {regionDetails?.name} */}
              {formatSlugToTitle(regionDetails?.name)}
              {/* {regionDetails.name} Region */}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-white text-lg">
            -
          </BreadcrumbSeparator>
          <BreadcrumbItem className="cursor-default">
            <Link
              className=" hover:text-white text-white cursor-default bg-transparent text-sm lg:text-lg font-bold"
              href="#"
            >
              {formatSlugToTitle(escort.name)}
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <GirlProfile girl={escort} />
    </div>
  );
};

export default page;
