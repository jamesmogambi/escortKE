import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Prop {
  classNameName?: string;
  girl: any;
}

// TODO: MAKE TABS RESPONSIVE ON MOBILE PHONES
const About = ({ girl, classNameName }: Prop) => {
  const { age, height, weight, breasts, breastSize } = girl;
  return (
    <div className={cn("py-6", classNameName)}>
      <h5 className="underline text-xl text-white font-semibold">
        Girl Information:
      </h5>
      <div className="grid py-6 grid-cols-2 md:grid-cols-3 gap-6 lg:gap-24 ">
        {/* <!-- Column 1 --> */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-primary text-sm font-bold lg:text-lg">
              Age:
            </span>
            <span className="text-white text-nowrap text-sm font-bold lg:text-lg">
              {`${age} years` || "Not Specified"}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <span className="text-primary font-bold text-sm lg:text-lg">
              Height:
            </span>
            <span className="text-white  text-nowrap font-bold text-sm lg:text-lg">
              {"  "} {height || "   Not Specified"}
            </span>
          </div>

          <div className="flex items-center justify-between lg:hidden">
            <span className="text-primary font-bold text-sm lg:text-lg">
              Languages:
            </span>
            <Image height={25} width={30} src={"/KE.svg"} alt="KE" priority />
          </div>
        </div>

        {/* <!-- Column 2 --> */}
        <div className="space-y-8">
          <div className="flex items-center   gap-2 justify-between">
            <span className="text-primary font-bold text-sm lg:text-lg">
              Breasts:
            </span>
            <span className="text-white text-nowrap font-bold text-sm lg:text-lg">
              {breastSize || "Not Specified"}
            </span>
          </div>
          <div className="flex lg:hidden flex-nowrap  gap-2 items-center justify-between">
            <span className="text-primary font-bold text-sm lg:text-lg">
              Weight:
            </span>
            <span className="text-white text-nowrap font-bold text-sm lg:text-lg">
              {weight || "Not Specified"}
            </span>
          </div>
          <div className="lg:flex hidden items-center justify-between">
            <span className="text-primary  font-bold text-sm lg:text-lg">
              Languages:
            </span>
            <Image height={25} width={30} src={"/KE.svg"} alt="KE" priority />
          </div>
        </div>

        {/* <!-- Column 3 --> */}
        <div className="space-y-8 hidden lg:block">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-primary font-bold text-sm lg:text-lg">
              Weight:
            </span>
            <span className="text-white text-nowrap font-bold text-sm lg:text-lg">
              {weight || "Not Specified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
