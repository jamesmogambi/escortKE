// "use client";
import { cn, formatSlugToTitle, slugify } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import GirlImageSwiper from "./GirlImageSwiper";
import { gallery } from "@/fixtures/girl";
import { Images, X } from "lucide-react";
import { convertToLocalPhone } from "@/lib/phone";
// import { EscortDocument } from "@/types/escort.types";
// import { useRouter } from "next/navigation";

// interface Prop {
//   girl: EscortDocument;
//   className?: string;
//   handlePress?: () => void;
//   path?: string;
// }

interface GirlItemProps {
  girl: {
    _id: string;
    name?: string;
    username?: string;
    age?: string;
    telephone?: string;
    images: string[];
    videos: string[];
    region?: {
      _id: string;
      name: string;
      code?: string;
    };
    county?: {
      _id: string;
      name: string;
      code?: string;
    };
    town?: string;
    estate?: string;
    displayLocation?: string;
    // ... other fields
  };
  className?: string;
  handlePress?: () => void;
  path?: string;
}
const GirlItem = ({
  girl,
  className,
  handlePress,
  path = `/girl/${girl.username}`,
}: GirlItemProps) => {
  const {
    age,
    videos = [],
    name,
    region,
    county,
    telephone,
    images = [],
    town,
    estate,
    displayLocation,
  } = girl;

  // Use displayLocation virtual if available, otherwise build it
  const locationDisplay =
    displayLocation ||
    (() => {
      const parts = [];
      if (estate) parts.push(estate);
      if (town) parts.push(town);
      if (region?.name) parts.push(region.name);
      if (county?.name) parts.push(`${county.name} County`);
      return parts.length > 0 ? parts.join(", ") : "Location not specified";
    })();

  // const router = useRouter();

  // const handleClick = () => {
  //   router.push(`girl/${userName}`);
  // };

  const escortName = name || "Escort";

  return (
    <div
      // onClick={handleClick}
      className={cn(
        "text-4xl font-bold hover:shadow-xl shadow-stone-200/60 relative cursor-pointer border-[0.2px] p-0 rounded-md overflow-hidden border-gray-500",
        className,
      )}
    >
      <Link href={path}>
        {/* header */}
        <GirlImageSwiper images={images} />

        {/* footer */}
        <div className="p-4">
          <h4 className="text-primary mb-1 text-base lg:text-2xl font-bold capitalize">
            {escortName.split(" ").slice(0, 2).join(" ") || "Escort"}
          </h4>

          <div className="flex  w-full flex-nowrap overflow-hidden   border-b-[0.2px] border-gray-500 pb-2.5 font-medium lg:items-center justify-between">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-stone-500 hidden lg:block"
              >
                <path
                  fill-rule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clip-rule="evenodd"
                />
              </svg>

              <span className="text-white text-sm  lg:text-lg">
                {/* {displayLocation} */}
                {formatSlugToTitle(region?.name || "Not Specified")}
              </span>
            </div>

            <span className="text-white text-nowrap text-sm lg:text-lg">
              {age} years
            </span>
          </div>

          <p className="lg:text-[19px] text-base font-medium mt-2 lg:mt-3  ">
            {convertToLocalPhone(telephone)}
          </p>
        </div>
      </Link>

      {/* display number of media */}
      <div className="fiex top-0 -left-2 absolute z-50">
        {videos.length > 0 ? (
          <div className=" flex items-center rounded-br-lg gap-4 p-2 px-  bg-red-700 text-white/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
            </svg>

            <span className="text-xl">{videos.length}</span>
          </div>
        ) : (
          <div className=" hidden lg:flex items-center rounded-br-lg gap-4 p-2 px-6 bg-stone-300/65   text-black/60">
            <Images className="h-8 w-10" />
            <span className="text-2xl ">
              {images.length > 0 ? images.length : 1}
              <span className="text-[18px] uppercase">x</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GirlItem;
