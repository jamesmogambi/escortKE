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
// types/populated.agency.types.ts
export interface CountyData {
  _id: string;
  name: string;
  code: string;
}

export interface RegionData {
  _id: string;
  name: string;
}

export interface OwnerData {
  _id: string;
  name?: string;
  email?: string;
  isVerified?: boolean;
}

export interface EscortSummary {
  _id: string;
  name?: string;
  previewPhoto?: string;
  age?: string;
  rating: number;
  totalReviews: number;
  categories: string[];
  isAgencyFeatured?: boolean;
  rates?: Rate[];
  about?: string;
}

export interface Rate {
  duration: string;
  incall: string;
  outcall?: string;
}

// This is the EXACT type returned by getAgencies server action
export interface AgencyListing {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappPhone?: string;
  website?: string;

  // Location
  country: string;
  countyCode?: string;
  town: string;
  estate?: string;

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

  // Services
  services: string[];
  specialties: string[];

  // Media
  logo?: string;
  coverImage?: string;
  gallery: string[];

  // Statistics
  rating: number;
  totalReviews: number;
  totalBookings: number;
  totalViews: number;
  featuredEmployeesCount: number;

  // Status
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;

  // Populated fields
  county?: CountyData;
  region?: RegionData;
  owner?: OwnerData;

  // Virtual fields from getAgencies (when includeEmployees=true)
  employees?: EscortSummary[];
  totalEmployees?: number;
  hasEmployees?: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// types/server.actions.types.ts
// import { AgencyListing } from './populated.agency.types';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetAgenciesResponse {
  success: boolean;
  data: AgencyListing[];
  pagination: PaginationInfo;
  error?: string;
}

export interface GetAgencyBySlugResponse {
  success: boolean;
  data: AgencyListing | null;
  error?: string;
}

export interface GetAgencyEmployeesResponse {
  success: boolean;
  data: EscortSummary[];
  pagination: PaginationInfo;
  error?: string;
}

export interface GetCountiesResponse {
  success: boolean;
  data: Array<{
    _id: string;
    name: string;
    code: string;
    country: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  error?: string;
}

export interface GetRegionsResponse {
  success: boolean;
  data: Array<{
    _id: string;
    name: string;
    county: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  error?: string;
}

export interface GetBusinessTypesResponse {
  success: boolean;
  data: Array<{
    value: string;
    label: string;
  }>;
  error?: string;
}
