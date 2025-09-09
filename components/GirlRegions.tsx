import React from "react";
import SectionCard from "./SectionCard";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import FilterInput from "./FilterInput";
import Image from "next/image";
import { getRegions, getTowns } from "@/actions/location";

const GirlRegions = async () => {
  // const towns = Array.from({ length: 14 }, (_, i) => ({
  //   id: i + 1,
  //   location: `Location ${i + 1}`,
  // }));

  const regions = await getRegions();

  return (
    <div>
      <SectionCard className="">
        <h4 className="text-center text-3xl font-bold text-white ">
          Find a<span className="text-primary"> girl to have sex</span> with in
          your town
        </h4>

        <div className="flex items-center mt-5 mb-3 justify-center">
          <Image
            src={"/separator.png"}
            alt="separetor"
            priority
            width={60}
            height={20}
          />
        </div>

        {/* // render regions */}

        <div className="md:flex hidden gap-2 gap-y-2 flex-wrap">
          {regions.slice(0, 16).map((town) => (
            <Link
              key={town.id}
              className="text-primary  uppercase font-bold text-base  bg-gray-1/35 rounded-md p-1.5 px-5"
              href={`girls/${slugify(town.name)}`}
            >
              sex {town.name}
            </Link>
          ))}
        </div>

        <FilterInput className="lg:mt-9 mt-4   flex " />
      </SectionCard>
    </div>
  );
};

export default GirlRegions;
