"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {A11y, Navigation, Pagination, Scrollbar} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface Prop {
    images: string[];
}

const GirlImageSwiper = ({images}: Prop) => {
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const [swiperRef, setSwiperRef] = useState<any>(null);

    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => ({...prev, [index]: true}));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (swiperRef) swiperRef.slidePrev();
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (swiperRef) swiperRef.slideNext();
    };

    if (!images || images.length === 0) {
        return (
            <div
                className="w-full relative bg-gray-200 rounded-t-lg flex items-center justify-center h-[200px] lg:h-[300px]">
                <span className="text-gray-400">No images available</span>
            </div>
        );
    }

    return (
        <div className="w-full relative group">
            <div className="relative">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{clickable: true, dynamicBullets: true}}
                    scrollbar={{draggable: true}}
                    loop={images.length > 1}
                    className="rounded-t-lg overflow-hidden"
                    onSwiper={setSwiperRef}
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="relative w-full h-[200px] lg:h-[300px] bg-gray-100">
                                <div className="absolute inset-0 pb-[5px]">
                                    {!loadedImages[index] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                            <div
                                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                                <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-primary"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="custom-swiper-button-prev"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="custom-swiper-button-next"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={20}/>
                        </button>
                    </>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .custom-swiper-button-prev,
                .custom-swiper-button-next {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: white;
                    color: black;
                    opacity: 0.8;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 10;
                    padding: 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .group:hover .custom-swiper-button-prev,
                .group:hover .custom-swiper-button-next {
                    opacity: 1;
                }

                .custom-swiper-button-prev:hover,
                .custom-swiper-button-next:hover {
                    opacity: 1 !important;
                    background-color: white;
                    transform: translateY(-50%) scale(1.1);
                    color: #fe0032;
                }

                .custom-swiper-button-prev {
                    left: 10px;
                }

                .custom-swiper-button-next {
                    right: 10px;
                }

                /* Hide default Swiper navigation buttons */
                .swiper-button-next,
                .swiper-button-prev {
                    display: none !important;
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

                /* Mobile optimization */
                @media (max-width: 640px) {
                    .custom-swiper-button-prev,
                    .custom-swiper-button-next {
                        width: 28px;
                        height: 28px;
                        opacity: 0.8; /* Always visible on mobile */
                    }

                    .group:hover .custom-swiper-button-prev,
                    .group:hover .custom-swiper-button-next {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default GirlImageSwiper;
