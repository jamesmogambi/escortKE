// "use client";
// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Swiper, SwiperSlide } from "swiper/react";
// import Image from "next/image";

// interface Prop {
//   photos: {
//     id: string;
//     path: string;
//   }[];
// }
// const PhotoGallery = ({ photos }: Prop) => {
//   console.log("photos", photos);
//   return (
//     <div className=" h-full w-full border-red-700 border-4">
//       <Swiper
//         modules={[Navigation, Pagination, Scrollbar, A11y]}
//         spaceBetween={30}
//         slidesPerView={1}
//         navigation
//         pagination={{ clickable: true }}
//         scrollbar={{ draggable: true }}
//         className=" h-full w-full text-primary"
//       >
//         {photos.map((src, index) => (
//           <SwiperSlide className="" key={index}>
//             <div className="relative border-b-[7px] border-primary w-full h-full lg:h-[700px]">
//               <Image
//                 src={src.path}
//                 alt={`Slide ${index + 1}`}
//                 fill
//                 // style={{ objectFit: "center" }}
//                 className="object-cover"
//                 quality={90}
//                 priority
//               />
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={20}
//                 height={20}
//                 viewBox="0 0 24 24"
//                 className="fixed bottom-0 left-1/2 transform -translate-x-1/2"
//               >
//                 <path
//                   fill="#FE0032"
//                   d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19"
//                   strokeWidth={0.5}
//                   stroke="#FE0032"
//                 ></path>
//               </svg>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default PhotoGallery;

"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Prop {
  photos: {
    id: string;
    path: string;
  }[];
}

const PhotoGallery = ({ photos }: Prop) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="mt-5 h-[800px] flex flex-col  w-full border-green-700">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="  border-pink-400 w-full  h-[70%]"
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
      >
        {photos.map((src, index) => (
          <SwiperSlide key={index} className=" w-full">
            <div className=" border-b-[7px] border-primary w-full    ">
              <Image
                src={src.path}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                quality={90}
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 👇 You can now use currentIndex anywhere below */}
      <div className="border-yellow-700 mt-2 px-1 flex-1  w-full">
        {/* Viewing image {currentIndex + 1} of {photos.length} */}
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={10}
          slidesPerView={4}
          navigation
          // pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          className="h-full w-full "

          // onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        >
          {photos.map((src, index) => (
            <SwiperSlide key={index} className=" h-full w-full">
              <div
                // className=" border-b-[7px] border-primary w-full h-[200px]  "
                className={cn(
                  `relative w-full h-full transition-opacity duration-300 
                 `,
                  {
                    "opacity-30": index !== currentIndex,
                  }
                )}
              >
                <Image
                  src={src.path}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={90}
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Override default Swiper buttons */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
          background-color: oklch(96.7% 0.001 286.375);
          opacity: 0.6;
          border-radius: 9999px;
          padding: 12px;
          width: 50px;
          height: 50px;
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

export default PhotoGallery;
