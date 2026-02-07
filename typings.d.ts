interface Girl {
  id: string;
  fullName: string;
  userName: string;
  age: number;
  userId: string;
  address?: string;
  photos: {
    id: string;
    path: string;
  }[];
  videos: {
    id: string;
    path: string;
  }[];
  bio: string;
  phone: string;
  email: string;
  county: string;
  region: string;
  height: numbconster;
  breasts: number;
  weight: number;
  languages: {
    id: string;
    name: string;
  }[];
  openingHours: {
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }[];
  practices: {
    id: string;
    name: string;
  }[];
  whatsAppNumber: string;
  availability: {
    id: string;
    name: string;
  }[];
}

declare module "swiper/css";
declare module "swiper/css/*";
declare module "swiper/react";
declare module "swiper";
declare module "swiper/modules";
