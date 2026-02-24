import { formatSlugToTitle } from "@/lib/utils";
import { Minus } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Prop {
  title?: string;
  subTitle?: string;
}
const ListHeader = (props: Prop) => {
  return (
    <section className="w-full lg:max-w-7xl  mx-auto my-3 p-5">
      {/* // breadcrumb */}
      <div className="w-full flex items-center text-lg lg:justify-start justify-center ">
        <div className="flex items-center  gap-3">
          <Link href={"/"} className="text-primary font-bold">
            Introduction
          </Link>
          <Minus className="size-4" />

          <label className="font-bold">{props.subTitle}</label>
        </div>
      </div>
      {/* // render heading */}
      <h4 className="text-center font-semibold mt-3 text-3xl">
        {formatSlugToTitle(props.title || "Erotic Massages")}
      </h4>
    </section>
  );
};

export default ListHeader;
