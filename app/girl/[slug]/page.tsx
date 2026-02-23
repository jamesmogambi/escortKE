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
import { fetchEscortBySlug } from "@/actions/escort.action";

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

interface EscortPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const page = async ({ params }: EscortPageProps) => {
  const { slug } = await params;

  const result = await fetchEscortBySlug(slug);

  if (!result || !result.escort) {
    notFound();
  }

  console.log("individual escort ==>", result.escort);

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
              href={`/girls?county=${result.escort.workingAreas[0]?.countyName}`}
            >
              sex {result.escort.workingAreas[0]?.countyName}
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
              {formatSlugToTitle(result.escort.name)}
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <GirlProfile girl={result.escort} />
    </div>
  );
};

export default page;
