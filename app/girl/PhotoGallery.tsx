"use client";
import React, { useState, useRef, useEffect } from "react";
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
import type { Swiper as SwiperType } from "swiper";

interface Prop {
  photos: string[];
  title?: string;
}

const PhotoGallery = ({ photos, title = "Gallery" }: Prop) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const mainSwiperRef = useRef<any | null>(null);
  const thumbSwiperRef = useRef<any | null>(null);

  // Sync thumbnails when main slide changes
  const handleMainSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex);
    if (thumbSwiperRef.current) {
      thumbSwiperRef.current.slideTo(swiper.activeIndex);
    }
  };

  // Handle thumbnail click
  const handleThumbClick = (index: number) => {
    setCurrentIndex(index);
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="mt-5 w-full bg-gray-100 rounded-lg flex items-center justify-center h-[400px]">
        <span className="text-gray-400">No photos available</span>
      </div>
    );
  }

  return (
    <div className="mt-5 w-full">
      {/* Main Image Swiper */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-black rounded-lg overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop={photos.length > 1}
          onSwiper={(swiper: any) => (mainSwiperRef.current = swiper)}
          onSlideChange={handleMainSlideChange}
          className="w-full h-full"
        >
          {photos.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                {!loadedImages[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
                <Image
                  src={src}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => {
                    console.error(`Failed to load image: ${src}`);
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Image Counter Badge */}
        <div className="absolute top-4 right-4 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {photos.length > 1 && (
        <div className="mt-4 w-full">
          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={10}
            slidesPerView={4}
            breakpoints={{
              320: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
            navigation
            scrollbar={{ draggable: true }}
            onSwiper={(swiper: any) => (thumbSwiperRef.current = swiper)}
            className="thumbnails-swiper"
          >
            {photos.map((src, index) => (
              <SwiperSlide key={index}>
                <div
                  className={cn(
                    "relative aspect-square cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2",
                    index === currentIndex
                      ? "border-primary scale-95 shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-95",
                  )}
                  onClick={() => handleThumbClick(index)}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        /* Main Swiper Navigation */
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          transform: translateY(-50%) scale(1.05);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }

        .swiper-button-next {
          right: 16px;
        }

        .swiper-button-prev {
          left: 16px;
        }

        /* Main Swiper Pagination */
        .swiper-pagination-bullet {
          background-color: white;
          opacity: 0.7;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background-color: #fe0032;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }

        /* Main Swiper Scrollbar */
        .swiper-scrollbar {
          background: rgba(255, 255, 255, 0.3);
          bottom: 8px;
        }

        .swiper-scrollbar-drag {
          background: #fe0032;
        }

        /* Thumbnail Swiper Navigation */
        .thumbnails-swiper .swiper-button-next,
        .thumbnails-swiper .swiper-button-prev {
          color: #333;
          background-color: rgba(255, 255, 255, 0.9);
          width: 30px;
          height: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 50%;
        }

        .thumbnails-swiper .swiper-button-next::after,
        .thumbnails-swiper .swiper-button-prev::after {
          font-size: 12px;
        }

        .thumbnails-swiper .swiper-button-next:hover,
        .thumbnails-swiper .swiper-button-prev:hover {
          background-color: white;
          transform: scale(1.05);
        }

        .thumbnails-swiper .swiper-scrollbar {
          background: rgba(0, 0, 0, 0.1);
        }

        /* 📱 Mobile Devices */
        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 14px;
          }

          .thumbnails-swiper .swiper-button-next,
          .thumbnails-swiper .swiper-button-prev {
            width: 24px;
            height: 24px;
          }

          .swiper-pagination-bullet-active {
            width: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoGallery;
