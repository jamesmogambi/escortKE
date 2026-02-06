// types/escort.types.ts
import { Types } from "mongoose";

export interface IOpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface IRate {
  duration: string;
  incall: string;
  outcall?: string;
}

export interface IPlanDetails {
  type: "basic" | "vip" | "premium";
  isActive: boolean;
  activatedAt?: Date;
  expiresAt?: Date;
  features: string[];
}

export interface IEscort {
  _id: Types.ObjectId;

  // Basic Info
  name?: string;
  clerkUserId?: string;
  username?: string;
  previewPhoto?: string;
  email: string;
  labels: string[];
  age?: string;
  telephone?: string;
  whatsappPhone?: string;

  // Media
  images: string[];
  videos: string[];

  // About
  about?: string;
  availability?: string[];
  ethnicity?: string;
  nationality?: string;
  bustSize?: string;
  weight?: string;
  source?: string;
  zodiacSign?: string;
  sexualOrientation?: string;

  // Languages & Categories
  languages: string[];
  categories: string[];

  // Location (Kenya)
  country?: string;
  county?: Types.ObjectId;
  countyCode?: string;
  region?: Types.ObjectId;
  town?: string;
  estate?: string;
  address?: string;
  street?: string;
  postalCode?: string;

  // Services
  practices: string[];
  bdsm: string[];
  massage: string[];
  extraServices: string[];

  // Professional Details
  slug: string;

  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  rates: IRate[];
  role: "escort" | "business" | "admin" | "user";

  // Physical Attributes
  breastSize?: string;
  ageCategory?: string;
  character?: string;
  hairColor?: string;
  experience?: string;

  // Agency Relationship
  workType: "independent" | "agency_employee";
  agencyId?: Types.ObjectId; // Only if workType = "agency_employee"
  agencyRole?: "owner" | "manager" | "employee" | "independent_contractor";
  agencyCommissionRate?: number; // For independent contractors
  isAgencyFeatured?: boolean; // Featured within agency

  // Status
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;

  // Subscription
  plan?: IPlanDetails;

  // Statistics
  totalBookings: number;
  totalReviews: number;
  rating: number;
  totalViews: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
