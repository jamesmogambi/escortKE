export interface EscortCardData {
  _id: string;
  name: string | null;
  username: string | null;
  slug: string;

  // Media
  previewPhoto: string | null;
  images: string[];

  // Contact Info - NOW INCLUDED
  telephone?: string | null;
  whatsappPhone?: string | null;
  email?: string | null;

  // Basic Info
  age: string | null;
  gender: string | null;
  about: string | null;
  aboutExcerpt: string | null;
  ethnicity: string | null;
  nationality: string | null;
  bustSize: string | null;
  weight: string | null;
  zodiacSign: string | null;
  languages: string[];

  // Services
  practices: string[];
  categories: string[];

  // Status
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;

  // Stats
  rating: number;
  totalReviews: number;
  totalViews: number;

  // Location - Enhanced with full details
  primaryRegion: {
    _id: string;
    name: string;
    county?: string;
  } | null;

  countyDetails: {
    _id: string;
    name: string;
    code: string;
  } | null;

  primaryLocationDisplay: string;
  allLocationsDisplay: string[];

  locationDetails: {
    town: string | null;
    estate: string | null;
    address: string | null;
    street: string | null;
    postalCode: string | null;
    notes: string | null;
    isActive: boolean;
  } | null;

  locations: Array<{
    _id?: string;
    region: string;
    regionName: string | null;
    town?: string;
    estate?: string;
    address?: string;
    street?: string;
    postalCode?: string;
    isActive: boolean;
    notes?: string;
  }>;

  // Working areas summary
  workingAreas: Array<{
    id: string;
    name: string;
    countyName: string | null;
    isPrimary: boolean;
    locationDetails: {
      town?: string;
      estate?: string;
      address?: string;
    } | null;
  }>;

  // Rates
  rates: Array<{
    duration: string;
    incall: string;
    outcall: string | null;
    region?: string;
  }>;

  hourlyRate: {
    duration: string;
    incall: string;
    outcall: string | null;
  } | null;

  // Work Type
  workType: "independent" | "agency_employee" | null;
  workTypeDisplay: string;

  // Agency
  agency: {
    _id: string;
    name: string;
    slug: string;
    logo: string | null;
    isVerified: boolean;
  } | null;

  // videos
  videos?: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Detailed escort type for profile pages
 */
export interface EscortProfileData {
  _id: string;
  name?: string | null;
  username?: string | null;
  clerkUserId?: string | null;
  slug: string;

  // Media
  previewPhoto?: string | null;
  images: string[];
  videos: string[];

  // Basic Info
  email?: string | null;
  telephone?: string | null; // Only if verified
  whatsappPhone?: string | null; // Only if verified
  age?: string | null;
  gender?: "girl" | "boy" | "transgender" | "non-binary" | "other" | null;
  ethnicity?: string | null;
  nationality?: string | null;
  bustSize?: string | null;
  weight?: string | null;
  zodiacSign?: string | null;
  sexualOrientation?: string | null;
  about?: string | null;
  availability?: string[];
  labels: string[];

  // Languages & Categories
  languages: string[];
  categories: string[];

  // Location Details (Full)
  country: string;
  countyCode?: string | null;

  county: {
    _id: string;
    name: string;
    code: string;
  } | null;

  regions: Array<{
    _id: string;
    name: string;
    county: string | Types.ObjectId;
    slug?: string;
  }>;

  primaryRegion: {
    _id: string;
    name: string;
    county: string | Types.ObjectId;
    slug?: string;
  } | null;

  locations: LocationDetailData[];

  // Virtual location displays
  primaryLocationDisplay: string;
  allLocationsDisplay: string[];
  workingAreas: WorkingAreaData[];

  // Services
  practices: string[];
  bdsm: string[];
  massage: string[];
  extraServices: string[];

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

  // Rates
  rates: RateData[];

  // Physical Attributes
  breastSize?: string | null;
  ageCategory?: string | null;
  character?: string | null;
  hairColor?: string | null;
  experience?: string | null;

  // Agency Relationship
  workType?: "independent" | "agency_employee" | null;
  agency?: {
    _id: string;
    name: string;
    slug: string;
    logo?: string | null;
    description?: string | null;
    website?: string | null;
    email?: string | null;
    telephone?: string | null;
    isVerified: boolean;
  } | null;
  agencyRole?:
    | "owner"
    | "manager"
    | "employee"
    | "independent_contractor"
    | null;
  agencyCommissionRate?: number | null;
  isAgencyFeatured?: boolean;

  // Status
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;

  // Plan
  plan: {
    type: "basic" | "vip" | "premium";
    isActive: boolean;
    expiresAt?: string | null;
  };

  // Stats
  totalBookings: number;
  totalReviews: number;
  rating: number;
  totalViews: number;

  // SEO
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Location detail data for client
 */
export interface LocationDetailData {
  _id?: string;
  region: {
    _id: string;
    name: string;
    county: {
      _id: string;
      name: string;
    };
  };
  town?: string | null;
  estate?: string | null;
  address?: string | null;
  street?: string | null;
  postalCode?: string | null;
  isActive: boolean;
  notes?: string | null;

  // Formatted address
  formattedAddress: string;
}

/**
 * Working area data for client
 */
export interface WorkingAreaData {
  id: string;
  name: string;
  countyName?: string | null;
  isPrimary: boolean;
  locationDetails?: {
    town?: string | null;
    estate?: string | null;
    address?: string | null;
  } | null;
  formattedLocation: string;
}

/**
 * Rate data for client
 */
export interface RateData {
  _id?: string;
  duration: string;
  incall: string;
  outcall?: string | null;
  region?: {
    _id: string;
    name: string;
  } | null;
  displayValue: string; // Formatted rate string
}

/**
 * API Response types for escort endpoints
 */
export interface EscortApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated escorts response
 */
export interface EscortPaginatedResponse {
  escorts: EscortCardData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: Record<string, any>;
}

// ============ TYPE GUARDS ============

export function isEscortProfile(data: any): data is EscortProfileData {
  return data && typeof data === "object" && "_id" in data && "slug" in data;
}

export function isEscortCard(data: any): data is EscortCardData {
  return (
    data &&
    typeof data === "object" &&
    "_id" in data &&
    "primaryLocationDisplay" in data
  );
}
