import { cn } from "@/lib/utils";
import React from "react";

interface Prop {
  className?: string;
  children?: React.ReactNode;
}
const SectionCard = ({ className, children }: Prop) => {
  return (
    <section
      className={cn(
        "px-6 py-10 w-full  mx-auto bg-black/45  lg:max-w-7xl",
        className
      )}
    >
      {children}
    </section>
  );
};

export default SectionCard;
