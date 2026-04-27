"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { IAgency } from "@/types/agency.types";
import { Escort } from "@/server-actions/escort.action";
import { notFound } from "next/navigation";
import { IEscort } from "@/types/escort.types";

interface Prop {
  className?: string;
  agency: IAgency;
}

interface AgencyWithEscortsResponse {
  success: boolean;
  data: {
    agency: {
      id: string;
      name: string;
    };
    escorts: IEscort[];
    total: number;
  };
  message: string;
}

async function getAgencyWithEscorts(
  id: string,
): Promise<AgencyWithEscortsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";

  // Fetch both agency details and escorts in parallel
  const [agencyRes, escortsRes] = await Promise.all([
    fetch(`${baseUrl}/api/agencies/${id}`, {
      next: { revalidate: 3600 },
    }),
    fetch(`${baseUrl}/api/agencies/${id}/escorts`, {
      next: { revalidate: 60 },
    }),
  ]);

  if (!agencyRes.ok) {
    if (agencyRes.status === 404) notFound();
    throw new Error("Failed to fetch agency");
  }

  const agencyData = await agencyRes.json();
  const escortsData = await escortsRes.json();

  return {
    success: agencyData.success && escortsData.success,
    data: {
      agency: agencyData.data,
      escorts: escortsData.success ? escortsData.data.escorts : [],
      total: escortsData.success ? escortsData.data.total : 0,
    },
    message: agencyData.message,
  };
}

// Helper function to get first gallery image or profile image
function getDisplayImage(escort: IEscort): string {
  if (escort.profileImage && escort.profileImage !== "") {
    return escort.profileImage;
  }
  if (escort.gallery && escort.gallery.length > 0) {
    return escort.gallery[0];
  }
  return "/placeholder-avatar.jpg";
}

// Helper to format joined date
function formatDate(dateString: string): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Helper to get first name
function getFirstName(fullName: string): string {
  return fullName?.split(" ")[0] || fullName;
}

export default function AgencyListItem({ agency, className }: Prop) {
  const { name, description, coverImage, contactPhone, id } = agency;

  // State management
  const [escorts, setEscorts] = useState<IEscort[]>([]);
  const [escortsCount, setEscortsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agencyData, setAgencyData] = useState<IAgency | null>(null);

  // Fetch escorts data
  useEffect(() => {
    const fetchAgencyWithEscorts = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";

        // Fetch both agency details and escorts in parallel
        const [agencyRes, escortsRes] = await Promise.all([
          fetch(`${baseUrl}/api/agencies/${id}`),
          fetch(`${baseUrl}/api/agencies/${id}/escorts`),
        ]);

        if (!agencyRes.ok) {
          if (agencyRes.status === 404) {
            setError("Agency not found");
            return;
          }
          throw new Error("Failed to fetch agency");
        }

        const agencyData = await agencyRes.json();
        const escortsData = await escortsRes.json();

        if (agencyData.success && escortsData.success) {
          setAgencyData(agencyData.data);
          setEscorts(escortsData.data.escorts);
          setEscortsCount(escortsData.data.total);
        } else {
          setError("Failed to load data");
        }
      } catch (err) {
        console.error("Error fetching agency with escorts:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgencyWithEscorts();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div
        className={cn(
          "border border-white/20 rounded-md h-[800px] lg:h-[410px] flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading agency details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "border border-white/20 rounded-md h-[800px] lg:h-[410px] flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayEscorts = escorts.slice(0, 10); // Limit to 10 escorts for performance

  return (
    <div
      className={cn(
        "border border-white/20 overflow-hidden rounded-md h-[800px] lg:h-[410px] flex flex-col lg:flex-row gap-3",
        className,
      )}
    >
      {/* Box 1 - Cover Image */}
      <div className="w-full h-[700px] relative lg:h-full lg:w-1/2">
        {coverImage ? (
          <Image
            src={coverImage}
            fill
            className="object-cover"
            priority
            alt={name}
            quality={90}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white/40 text-lg">No Cover Image</span>
          </div>
        )}
      </div>

      {/* Box 2 - Content */}
      <div className="w-full p-3 h-full lg:w-1/2 overflow-y-auto">
        <h3 className="text-2xl text-primary font-bold">{name}</h3>

        {/* Contact Phone */}
        {contactPhone && (
          <div className="flex items-center mt-3 gap-3 text-white/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xl font-semibold">{contactPhone}</span>
          </div>
        )}

        {/* Description */}
        {/*{description && (
          <p className="text-white/60 text-sm mt-3 line-clamp-2">
            {description}
          </p>
        )}*/}

        {/* Escorts Count */}
        {/*<div className="mt-3">
          <span className="text-white/40 text-sm">
            {escortsCount} Escort{escortsCount !== 1 ? "s" : ""} Available
          </span>
        </div>*/}

        {/* Images Swiper */}
        {displayEscorts.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={3}
            navigation
            scrollbar={{ draggable: true }}
            className="w-full h-auto mt-4"
          >
            {displayEscorts.map((member: IEscort, index: number) => (
              <SwiperSlide
                key={member.id || index}
                className="w-full border border-white/30"
              >
                <div className="relative border-white/40 w-full h-[150px]">
                  <Image
                    src={getDisplayImage(member)}
                    alt={`${member.name || "Escort"} ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    quality={90}
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-avatar.jpg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 text-sm font-normal mx-auto text-white/80 w-full flex items-center justify-between bg-black/40 px-2 py-1">
                    <span className="truncate">
                      {getFirstName(member.name || "Girl")}
                    </span>
                    <span className="text-right whitespace-nowrap ml-2">
                      {member.age} years
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-[200px] mt-4 flex items-center justify-center border-0 border-white/20 rounded-md">
            <p className="text-white/40">No girls available</p>
          </div>
        )}

        {/* Location - Uncomment if needed */}
        {/* <p className="text-center drop-shadow-gray-600 bg-[#252525]/70 shadow-inner tracking-wider text-white/40 text-lg font-semibold mb-2">
          {agency.region}, {agency.county}
        </p> */}
      </div>

      {/* Override default Swiper buttons */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
          background-color: oklch(96.7% 0.001 286.375);
          opacity: 0.5;
          border-radius: 9999px;
          padding: 12px;
          width: 42px;
          height: 42px;
          top: 50%;
          transform: translateY(-50%);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 14px;
          font-weight: bold;
        }

        .swiper-button-next {
          right: 10px;
        }

        .swiper-button-prev {
          left: 10px;
        }

        /* For mobile devices (max-width: 640px) */
        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 30px;
            height: 30px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
}
