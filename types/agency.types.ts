// types/agency.types.ts
import { Types } from "mongoose";

export interface IAgency {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappPhone?: string;
  website?: string;

  // Owner must be an escort with role='business'
  ownerId: Types.ObjectId;

  // Location
  country: string;
  county?: Types.ObjectId;
  countyCode?: string;
  region?: Types.ObjectId;
  town?: string;
  estate?: string;
  address?: string;
  street?: string;
  postalCode?: string;

  // Business Details
  businessType: "agency" | "spa" | "massage_parlor" | "brothel";
  categories: string[];

  // Opening Hours
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  // Services offered by agency
  services: string[];
  specialties: string[];

  // Verification
  isVerified: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationDocuments?: {
    businessLicense?: string;
    taxCertificate?: string;
    idProof?: string;
    otherDocuments?: string[];
  };

  // Media
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  videos?: string[];

  // Agency Features
  establishmentYear?: number;
  languages: string[];
  paymentMethods: string[];

  // Social Media
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    telegram?: string;
  };

  // Subscription Plan
  plan?: {
    type: "basic" | "premium" | "enterprise";
    isActive: boolean;
    activatedAt?: Date;
    expiresAt?: Date;
    features: string[];
    maxEmployees?: number;
    maxGalleryImages?: number;
  };

  // Statistics
  rating: number;
  totalReviews: number;
  totalBookings: number;
  totalViews: number;
  featuredEmployeesCount: number;

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
