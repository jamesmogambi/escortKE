"use client";
import React from "react";
import GirlItem from "./GirlItem";
import { cn } from "@/lib/utils";
import { AppPagination } from "./AppPagination";
import { usePathname } from "next/navigation"; // Import usePathname
import { HomeEscort } from "@/actions/list-escort";
import { EscortCardData, EscortProfileData } from "@/types/escort.types";

// export interface EscortPopulated {
//   _id: string;
//   name?: string;
//   username?: string;
//   age?: string;
//   telephone?: string;
//   images: string[];
//   videos: string[];
//   regionDetails?: {
//     _id: string;
//     name: string;
//     code?: string;
//   };
//   countyDetails?: {
//     _id: string;
//     name: string;
//     code?: string;
//   };
//   town?: string;
//   estate?: string;
//   displayLocation?: string;
//   // ... other fields
// }

interface Prop {
  girls: EscortCardData[];
  className?: string;
  showPagination?: boolean; // Optional prop to control pagination
  paginationProps?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const GirlList = ({
  girls,
  className,
  showPagination: propShowPagination, // Prop to override
  paginationProps,
}: Prop) => {
  const pathname = usePathname(); // Get current route
  const isHomePage = pathname === "/"; // Check if we're on home page

  // Determine if pagination should be shown
  // Priority: prop > pathname check
  const showPagination =
    propShowPagination !== undefined ? propShowPagination : !isHomePage; // Don't show on home page by default

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 mx-6 lg:mx-auto my-6 max-w-7xl lg:grid-cols-4 gap-3 lg:gap-6",
          className,
        )}
      >
        {girls.map((girl, index) => (
          <GirlItem key={girl._id || girl._id || index} girl={girl} />
        ))}
      </div>

      {/* Conditionally render pagination */}
      {showPagination && paginationProps && (
        <AppPagination
          className="mt-8"
          currentPage={paginationProps.currentPage}
          onPageChange={paginationProps.onPageChange}
          totalPages={paginationProps.totalPages}
        />
      )}
    </>
  );
};

export default GirlList;
