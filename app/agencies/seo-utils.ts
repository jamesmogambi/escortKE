// Add to /lib/seo-utils.ts

import { ITEMS_PER_PAGE } from "@/constants";

interface AgencyStructuredDataProps {
  title: string;
  description: string;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  filters: {
    county?: string | null;
    region?: string | null;
    businessType?: string | null;
  };
  items: any[];
}

export function generateAgencyStructuredData({
  title,
  description,
  totalItems,
  currentPage,
  totalPages,
  filters,
  items,
}: AgencyStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kenyadivas.com";
  const businessType = filters.businessType?.toLowerCase() || "private room";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/agencies${currentPage > 1 ? `?page=${currentPage}` : ""}`,
        name: title,
        description: description,
        url: `${baseUrl}/agencies`,
        numberOfItems: totalItems,
        ...(currentPage > 1 && {
          isPartOf: {
            "@type": "CollectionPage",
            "@id": `${baseUrl}/agencies`,
          },
        }),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1 + (currentPage - 1) * ITEMS_PER_PAGE,
            item: {
              "@type": "LocalBusiness",
              name: item.name,
              description: item.description?.substring(0, 200),
              url: `${baseUrl}/agencies/${item.slug || item.id}`,
              image: item.logo || item.coverImage,
              address: {
                "@type": "PostalAddress",
                addressLocality: item.town || item.city,
                addressRegion: item.county,
                addressCountry: "KE",
              },
              telephone: item.phone,
              email: item.email,
              priceRange: item.priceRange || "$$",
            },
          })),
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/agencies#directory`,
        name: "KENYADIVAS Private Rooms",
        description:
          "Directory of erotic private rooms and adult entertainment venues in Kenya",
        url: `${baseUrl}/agencies`,
        telephone: "+254700000000",
        email: "venues@kenyadivas.com",
        priceRange: "$$",
        areaServed: filters.county || filters.region || "Kenya",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Venue Types",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Private Rooms",
                description: "Discreet private rooms for adult entertainment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Escort Agencies",
                description: "Professional escort agencies",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Adult Venues",
                description: "Adult entertainment venues and clubs",
              },
            },
          ],
        },
      },
    ],
  };
}
