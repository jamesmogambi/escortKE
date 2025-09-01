// import { girls } from "@/fixtures/girl";
"use client";
import React from "react";
import GirlItem from "./GirlItem";
import { cn } from "@/lib/utils";
import { AppPagination } from "./AppPagination";

interface Prop {
  girls: Girl[];
  className?: string;
}
const GirlList = ({ girls, className }: Prop) => {
  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 mx-6 lg:mx-auto my-6 max-w-7xl lg:grid-cols-4 gap-3 lg:gap-6",
          className
        )}
      >
        {girls.map((girl, _) => (
          <GirlItem key={_} girl={girl} />
        ))}
      </div>
      <AppPagination
        className=""
        currentPage={3}
        onPageChange={(page) => page}
        totalPages={50}
      />
    </>
  );
};

export default GirlList;
