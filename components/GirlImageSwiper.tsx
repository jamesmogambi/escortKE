// components/ImageSwiper.js
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface Prop {
  images: string[];
}

const GirlImageSwiper = ({ images }: Prop) => {
  return (
    <div className="w-full relative  ">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        // pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative border-b-[7px] border-primary w-[400px] h-[200px] lg:h-[400px]">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                quality={90}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                className="fixed bottom-0 left-1/2 transform -translate-x-1/2"
              >
                <path
                  fill="#FE0032"
                  d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19"
                  strokeWidth={0.5}
                  stroke="#FE0032"
                ></path>
              </svg>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div></div>
      {/* Override default Swiper buttons */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: black;
          background-color: oklch(96.7% 0.001 286.375);
          opacity: 0.8;
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

export default GirlImageSwiper;
