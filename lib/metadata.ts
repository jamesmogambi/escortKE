// utils/metadata.ts
import type { Metadata } from "next";

interface GenerateAgencyMetadataParams {
  agency: any;
  slug: string;
}

export function generateAgencyMetadata({
  agency,
  slug,
}: GenerateAgencyMetadataParams): Metadata {
  const title = `${agency.name} | ${agency.businessType === "agency" ? "Escort Agency" : agency.businessType.charAt(0).toUpperCase() + agency.businessType.slice(1)} in ${agency.town || agency.county?.name || agency.region?.name || "Kenya"}`;

  const description = agency.description
    ? `${agency.description.substring(0, 155)}...`
    : `Find the best models and services at ${agency.name}. Contact: ${agency.contactPhone}`;

  const images = [];
  if (agency.coverImage) images.push(agency.coverImage);
  if (agency.logo) images.push(agency.logo);

  return {
    title,
    description,
    keywords: [
      agency.name,
      agency.businessType,
      "escort",
      "models",
      agency.town || "",
      agency.county?.name || "",
      agency.region?.name || "",
      "Kenya",
      ...(agency.services || []),
      ...(agency.categories || []),
    ].filter(Boolean),

    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/agencies/${slug}`,
      siteName: `${process.env.BASE_NAME || "EscortKE"}`,
      images: images.map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: `${agency.name} ${agency.coverImage ? "cover image" : "logo"}`,
      })),
      locale: "en_KE",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length > 0 ? [images[0]] : [],
    },

    robots: {
      index: agency.isActive && agency.isVerified,
      follow: true,
      googleBot: {
        index: agency.isActive && agency.isVerified,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/agencies/${slug}`,
    },
  };
}
