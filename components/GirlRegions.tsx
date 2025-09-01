import React from "react";
import SectionCard from "./SectionCard";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import FilterInput from "./FilterInput";

const GirlRegions = () => {
  const towns = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    location: `Location ${i + 1}`,
  }));

  return (
    <div>
      <SectionCard className="">
        <h1 className="text-center ">
          Find a<span className="text-primary"> girl to have sex</span> with in
          your town
        </h1>

        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={35}
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="#FE0032"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            ></path>
          </svg>
        </div>

        {/* // render regions */}

        <div className="md:flex hidden gap-2 gap-y-2 flex-wrap">
          {towns.map((town) => (
            <Link
              key={town.id}
              className="text-primary  uppercase font-semibold text-base  bg-gray-1/35 rounded-md p-1.5 px-5"
              href={`girls/${slugify(town.location)}`}
            >
              {town.location}
            </Link>
          ))}
        </div>

        <FilterInput className="lg:mt-14 mt-6 lg:ml-16  flex " />
      </SectionCard>
    </div>
  );
};

export default GirlRegions;
