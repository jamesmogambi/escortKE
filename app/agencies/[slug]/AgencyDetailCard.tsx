import SectionCard from "@/components/SectionCard";
import Link from "next/link";
import React from "react";
import { IAgency } from "@/types/agency.types";
import ProfileGallery from "@/app/girl/ProfileGallery";
import BioSection from "./BioSection";
import CompanyGirls from "./CompanyGirls";

interface Prop {
  className?: string;
  agency: any;
}
const AgencyProfile = ({ agency, className }: Prop) => {
  const { county, region, name, gallery, coverImage, _id } = agency;

  const photos: string[] = Array.isArray(gallery) ? [...gallery] : [];
  // const allPhotos: string[] = coverImage
  //   ? [coverImage, ...photos]
  //   : [...photos];

  // Or with optional coverImage
  const allPhotos: string[] = [
    ...(coverImage ? [coverImage] : []),
    ...(Array.isArray(gallery) ? gallery : []),
  ];

  console.log("allPhotos", allPhotos);
  return (
    <SectionCard>
      {/* header */}
      <div className="flex gap-y-6 lg:gap-y-0  flex-col lg:flex-row justify-between lg:items-center ">
        <h3 className="text-3xl font-semibold text-primary">
          {name} {region?.name}{" "}
          <span className="text-lg text-stone-400/70 font-extralight">
            from <span className="font-bold">{county?.name}</span>
          </span>
        </h3>

        <Link
          className="text-primary lg:text-lg hover:underline gap-2 pb-1.5 flex items-center font-bold "
          href={`/agencies`}
        >
          back to the list of companies
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {/* body section */}
      <div className="w-full my-5 pt-5 gap-4  flex flex-col lg:flex-row  ">
        {/* section 1 */}
        <div className="  border-green-900  lg:w-[40%]">
          <ProfileGallery photos={allPhotos} videos={[]} />
        </div>
        {/* section 2 */}
        <div className=" p-5 w-full lg:flex-1">
          <BioSection company={agency} />
        </div>
      </div>

      {/* companyGirls Section */}
      <CompanyGirls agencyId={_id} />
    </SectionCard>
  );
};

export default AgencyProfile;
