"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import { useState } from "react";

interface Prop {
  images: string[];
}

const GirlImageSwiper = ({ images }: Prop) => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full relative bg-gray-200 rounded-lg flex items-center justify-center h-[200px] lg:h-[300px]">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        scrollbar={{ draggable: true }}
        loop={images.length > 1}
        className="rounded-lg overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[200px] lg:h-[300px] bg-gray-100">
              {!loadedImages[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
                onLoad={() => handleImageLoad(index)}
                onError={() => console.error(`Failed to load image: ${src}`)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Button Styles */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        .swiper-button-next {
          right: 10px;
        }

        .swiper-button-prev {
          left: 10px;
        }

        /* Pagination bullets */
        .swiper-pagination-bullet {
          background-color: white;
          opacity: 0.7;
        }

        .swiper-pagination-bullet-active {
          background-color: #fe0032;
          opacity: 1;
        }

        /* Scrollbar */
        .swiper-scrollbar {
          background: rgba(0, 0, 0, 0.3);
          bottom: 0;
        }

        .swiper-scrollbar-drag {
          background: #fe0032;
        }

        /* 📱 For mobile devices (max-width: 640px) */
        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 30px;
            height: 30px;
          }

          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default GirlImageSwiper;
