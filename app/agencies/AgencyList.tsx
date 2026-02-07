"use client";
import { AppPagination } from "@/components/AppPagination";
import { cn } from "@/lib/utils";
import React from "react";
import AgencyListItem from "./AgencyListItem";

interface AgencyListProps {
  className?: string;
  title?: string;
  agencies: any[]; // Replace 'any' with the actual type of agencies if known
}
const AgencyList = ({
  agencies,
  className,
  title = "Erotic Businesses",
}: AgencyListProps) => {
  return (
    <div className={cn("w-full", className)}>
      <h5 className="my-6 text-3xl tracking-wide text-white font-semibold text-center">
        {title}
      </h5>

      <div
        className={cn(
          "grid grid-cols-1 mx-6 lg:mx-auto my-6 max-w-7xl lg:grid-cols-2 gap-3 lg:gap-6",
          className,
        )}
      >
        {agencies.map((agency, _) => (
          <AgencyListItem key={_} agency={agency} />
        ))}
        {/* <div className="w-full flex justify-center items-center">
          <AppPagination
            className=""
            currentPage={3}
            onPageChange={(page) => page}
            totalPages={50}
          />
        </div> */}
      </div>
    </div>
  );
};

export default AgencyList;
