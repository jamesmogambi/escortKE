import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import React from "react";

interface Prop {
  className?: string;
}
const SectionArticle = (props: Prop) => {
  const { className } = props;
  return (
    <article className={cn("", className)}>
      <SectionCard>
        <h4 className=" text-2xl text-primary font-bold">Erotic massages</h4>

        <div className="text-white space-y-6 lg:max-w-[80%] mx-auto my-5 text-base font-medium "></div>
      </SectionCard>
    </article>
  );
};

export default SectionArticle;
