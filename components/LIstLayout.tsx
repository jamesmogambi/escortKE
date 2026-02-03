import { Minus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { int } from "zod";

interface Prop {
  children?: React.ReactNode;
  title?: string;
}
const LIstLayout = (props: Prop) => {
  return (
    <section className="w-full lg:max-w-7xl mx-auto">
      // breadcrumb
      <div className="w-full ">
        <div className="flex items-center  gap-3">
          <Link href={"/"} className="text-primary">
            Introduction
          </Link>
          <Minus />

          <label className="">{props.title}</label>
        </div>
      </div>
      // render heading
      <h4 className="text-center">{props.title}</h4>
      // render List
    </section>
  );
};

export default LIstLayout;
