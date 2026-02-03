import React from "react";
import BDSMHeader from "./BDSMHeader";
import BDSMFilterInput from "./BDSMFilterInput";
import SectionArticle from "./SectionArticle";

export const metadata = {
  title: "BDSM Escorts in Kenya - Bondage & Discipline Services",
  description:
    "Discover professional BDSM escorts in Kenya offering bondage, discipline, and other BDSM services. Browse verified profiles with photos, rates, and locations.",
  keywords:
    "BDSM escorts, bondage, discipline, sadomasochism, Kenya, fetish services",
};
const page = () => {
  return (
    <>
      <BDSMHeader title="BDSM" subTitle="" />
      <div className="px-4">
        <BDSMFilterInput />
      </div>
      <SectionArticle />
    </>
  );
};

export default page;
