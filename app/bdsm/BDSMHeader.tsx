import { formatSlugToTitle } from "@/lib/utils";
import { Minus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Prop {
  title?: string;
  subTitle?: string;
}
const BDSMHeader = (props: Prop) => {
  return (
    <section>
      <div className="w-full lg:max-w-7xl mx-auto ">
        {/* // breadcrumb */}
        <div className="w-full flex items-center lg:justify-start justify-center ">
          <div className="flex items-center  gap-3">
            <Link href={"/"} className="text-primary font-bold">
              Introduction
            </Link>
            <Minus className="size-4" />

            <label className="font-bold">{props.subTitle || "BDSM"}</label>
          </div>
        </div>
        {/* // render heading */}
        <h4 className="text-center font-semibold mt-3 text-3xl">
          {props.title || "BDSM"}
          {/* {formatSlugToTitle(props.title || "BDSM")} */}
        </h4>
      </div>
    </section>
  );
};

export default BDSMHeader;
