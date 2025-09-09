import FilterInput from "@/components/FilterInput";
import React from "react";

interface Prop {}
const HeaderSection = () => {
  return (
    <div className="w-full bg-black/80 -mt-6 flex items-center justify-center py-6">
      <FilterInput />
    </div>
  );
};

export default HeaderSection;
