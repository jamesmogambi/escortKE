import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { cn, getFirstName } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Prop {
  className?: string;
  agency: any; // Replace 'any' with the actual type of agency if known
}
const AgencyListItem = ({ agency, className }: Prop) => {
  const { name, description, coverImage, agencyPhone, members } = agency;
  return (
    <div
      className={cn(
        " border border-white/20 overflow-hidden rounded-md h-[800px] lg:h-[410px] flex flex-col lg:flex-row gap-3 ",
        className
      )}
    >
      {/* // box 1 */}
      <div className="w-full  h-[700px]   relative  lg:h-full lg:w-1/2 ">
        <Image
          src={coverImage}
          fill
          className="object-cover"
          priority
          alt={name}
          quality={90}
        />
      </div>

      {/* // box 2 */}
      <div className="w-full p-3   border-yellow-900 h-full lg:w-1/2">
        <h3 className="text-3xl font-bold">{name}</h3>

        <div className="flex items-center mt-3 gap-3 text-white/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="text-xl">{agencyPhone}</span>
        </div>

        {/* images swipetr */}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={3}
          navigation
          //   pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          className="w-full h-[270px] mt-4 "
        >
          {members.map((member: any, index: any) => (
            <SwiperSlide key={index} className="w-full border border-white/30">
              <div className="relative  border-white/40 w-full h-[150px] ">
                <Image
                  src={member.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  quality={90}
                />
                <div className="fixed  left-0 bottom-5   right-0 mx-auto text-base font-light text-white/50 w-full flex items-center justify-between">
                  <span className="mr-5">{getFirstName(member.name)}</span>

                  <span className="text-right"> {member.age} years old</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p className="text-center drop-shadow-gray-600 bg-[#252525]/70 shadow-inner tracking-wider text-white/40 text-lg font-semibold mb-2 ">
          {agency.town}
        </p>
      </div>

      {/* Override default Swiper buttons */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
          background-color: oklch(96.7% 0.001 286.375);
          opacity: 0.5;
          border-radius: 9999px;
          padding: 12px;
          width: 42px;
          height: 42px;
          top: 50%;
          transform: translateY(-50%);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 14px;
          font-weight: bold;
        }

        .swiper-button-next {
          right: 10px;
        }

        .swiper-button-prev {
          left: 10px;
        }

        /* 📱 For mobile devices (max-width: 640px) */
        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 30px;
            height: 30px;
            padding: 8px; /* optional: reduce padding for better fit */
          }
        }
      `}</style>
    </div>
  );
};

export default AgencyListItem;
