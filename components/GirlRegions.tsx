import React from "react";
import SectionCard from "./SectionCard";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import FilterInput from "./FilterInput";
import Image from "next/image";
import POPULAR_COUNTIES from "@/data/popular-counties";
import { getPopularCountiesLimited } from "@/actions/region";
import GirlFilterInput from "@/app/girls/GirlFIlterInput";

const GirlRegions = async () => {
  // const counties = POPULAR_COUNTIES;
  const res = await getPopularCountiesLimited(15);
  const counties = res.success ? res.data : [];

  return (
    <div>
      <SectionCard className="">
        <h4 className="text-center text-3xl font-bold text-white ">
          Find a<span className="text-primary"> girl to have sex</span> with in
          your county
        </h4>

        <div className="flex items-center mt-5 mb-3 justify-center">
          <Image
            src={"/separator.png"}
            alt="separator"
            priority
            width={60}
            height={20}
          />
        </div>

        {/* // render most popular counties */}

        <div className="md:flex hidden gap-2 gap-y-2 flex-wrap">
          {counties.slice(0, 16).map((county) => (
            <Link
              key={county.code}
              className="text-primary  uppercase font-bold text-base  bg-gray-1/35 rounded-md p-1.5 px-5"
              href={`girls?county=${county?.name}`}
            >
              sex {county.name}
            </Link>
          ))}
        </div>

        {/* <FilterInput className="lg:mt-9 mt-4   flex " /> */}
        <GirlFilterInput />
      </SectionCard>
    </div>
  );
};

export default GirlRegions;
