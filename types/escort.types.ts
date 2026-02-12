// // types/escort.types.ts

// import { EscortDoc } from "@/models/Escort";
// import { Types } from "mongoose";

// // ============ ENUMS ============
// export enum EscortPlanType {
//   BASIC = "basic",
//   VIP = "vip",
//   PREMIUM = "premium",
// }

// export enum EscortRole {
//   ESCORT = "escort",
//   BUSINESS = "business",
//   ADMIN = "admin",
//   USER = "user",
// }

// export enum AgeCategory {
//   YOUNG = "Young",
//   MATURE = "Mature",
//   SENIOR = "Senior",
// }

// export enum EscortSource {
//   CUSTOM = "custom",
//   SCRAPED = "scraped",
//   IMPORTED = "imported",
// }

// // ============ INTERFACES ============

// // Opening Hours Types
// export interface OpeningHour {
//   day: string;
//   open: string;
//   close: string;
//   closed: boolean;
// }

// export interface WeeklyOpeningHours {
//   monday: string;
//   tuesday: string;
//   wednesday: string;
//   thursday: string;
//   friday: string;
//   saturday: string;
//   sunday: string;
// }

// // Rate/Pricing Interface
// export interface Rate {
//   duration: string;
//   incall: string;
//   outcall?: string;
// }

// // Plan Details Interface
// export interface PlanDetails {
//   type: EscortPlanType;
//   isActive: boolean;
//   activatedAt?: Date;
//   expiresAt?: Date;
//   features: string[];
// }

// // Location Interface
// export interface EscortLocation {
//   country?: string;
//   region?: string;
//   town?: string;
//   city?: string;
//   estate?: string;
//   street?: string;
//   address?: string;
// }

// // Physical Attributes Interface
// export interface PhysicalAttributes {
//   age?: string;
//   bustSize?: string;
//   breastSize?: string;
//   weight?: string;
//   height?: string;
//   hairColor?: string;
//   ethnicity?: string;
//   nationality?: string;
//   zodiacSign?: string;
//   sexualOrientation?: string;
//   ageCategory?: string;
//   character?: string;
//   experience?: string;
// }

// // Services Interface
// export interface EscortServices {
//   practices: string[];
//   bdsm: string[];
//   massage: string[];
//   extraServices: string[];
//   categories: string[];
//   languages: string[];
//   availability: string[];
// }

// // Media Interface
// export interface EscortMedia {
//   images: string[];
//   videos: string[];
//   previewPhoto?: string;
// }

// // Contact Interface
// export interface EscortContact {
//   email: string;
//   telephone?: string;
//   whatsappPhone?: string;
// }

// // ============ MAIN ESCORT INTERFACES ============

// // Database Document (Mongoose)
// export interface EscortDocument {
//   _id: string;
//   name?: string;
//   clerkUserId?: string;
//   username?: string;
//   previewPhoto?: string;
//   email: string;
//   labels: string[];
//   age?: string;
//   telephone?: string;
//   whatsappPhone?: string;
//   images: string[];
//   videos: string[];
//   about?: string;
//   availability: string[];
//   ethnicity?: string;
//   nationality?: string;
//   bustSize?: string;
//   weight?: string;
//   source?: string;
//   zodiacSign?: string;
//   sexualOrientation?: string;
//   languages: string[];
//   categories: string[];
//   estate?: string;
//   town?: string;
//   address?: string;
//   practices: string[];
//   bdsm: string[];
//   massage: string[];
//   extraServices: string[];
//   slug: string;
//   openingHours: WeeklyOpeningHours;
//   rates: Rate[];
//   role: EscortRole;
//   isActive?: boolean;
//   isVerified?: boolean;
//   street?: string;
//   region?: string;
//   user?: string;
//   breastSize?: string;
//   ageCategory?: string;
//   character?: string;
//   hairColor?: string;
//   experience?: string;
//   plan?: PlanDetails;
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Frontend/API Escort Type
// export interface Escort {
//   // Core Identifiers
//   id: string;
//   slug: string;
//   source?: EscortSource;

//   // Basic Information
//   name: string;
//   username?: string;
//   clerkUserId?: string;

//   // Contact Information
//   contact: EscortContact;

//   // Location
//   location: EscortLocation;

//   // Physical Attributes
//   attributes: PhysicalAttributes;

//   // Services
//   services: EscortServices;

//   // Media
//   media: EscortMedia;

//   // Description
//   about?: string;
//   description?: string;

//   // Pricing
//   rates: Rate[];

//   // Opening Hours
//   openingHours: WeeklyOpeningHours;

//   // Labels & Tags
//   labels: string[];

//   // Status
//   isActive: boolean;
//   isVerified: boolean;
//   isFeatured?: boolean;

//   // Role & Plan
//   role: EscortRole;
//   plan?: PlanDetails;

//   // Timestamps
//   createdAt: Date;
//   updatedAt: Date;
//   lastActive?: Date;

//   // Relationships
//   userId?: string;

//   // Metadata
//   viewCount?: number;
//   favoriteCount?: number;
//   rating?: number;
//   totalReviews?: number;
// }

// // ============ SIMPLIFIED TYPES FOR UI ============

// // For cards and lists
// export interface EscortCard {
//   id: string;
//   slug: string;
//   name: string;
//   age?: string;
//   city?: string;
//   town?: string;
//   region?: string;
//   nationality?: string;
//   ethnicity?: string;
//   bustSize?: string;
//   previewPhoto?: string;
//   images: string[];
//   planType?: EscortPlanType;
//   isVerified: boolean;
//   isActive: boolean;
//   rates: Rate[];
//   createdAt: Date;
//   labels: string[];
// }

// // For search results
// export interface EscortSearchResult {
//   id: string;
//   slug: string;
//   name: string;
//   age?: string;
//   city?: string;
//   previewPhoto?: string;
//   planType?: EscortPlanType;
//   isVerified: boolean;
//   bustSize?: string;
//   rates: Rate[];
//   distance?: number;
//   rating?: number;
// }

// // For forms
// export interface EscortFormData {
//   // Basic Info
//   name: string;
//   username?: string;
//   email: string;

//   // Contact
//   telephone?: string;
//   whatsappPhone?: string;

//   // Location
//   country?: string;
//   region?: string;
//   town?: string;
//   estate?: string;
//   address?: string;
//   street?: string;

//   // Physical
//   age?: string;
//   bustSize?: string;
//   breastSize?: string;
//   weight?: string;
//   hairColor?: string;
//   ethnicity?: string;
//   nationality?: string;
//   zodiacSign?: string;
//   sexualOrientation?: string;
//   ageCategory?: string;
//   character?: string;
//   experience?: string;

//   // Services
//   practices: string[];
//   bdsm: string[];
//   massage: string[];
//   extraServices: string[];
//   categories: string[];
//   languages: string[];
//   availability: string[];

//   // Description
//   about?: string;

//   // Media
//   images: string[];
//   videos: string[];
//   previewPhoto?: string;

//   // Pricing
//   rates: Omit<Rate, "_id">[];

//   // Opening Hours
//   openingHours: Partial<WeeklyOpeningHours>;

//   // Labels
//   labels: string[];

//   // Status
//   isActive: boolean;
//   isVerified: boolean;
//   plan?: Partial<PlanDetails>;

//   // Role
//   role: EscortRole;

//   // Source
//   source?: string;
// }

// // ============ API REQUEST/RESPONSE TYPES ============

// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
//   pagination?: PaginationMeta;
// }

// export interface PaginationMeta {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// export interface GetEscortsRequest {
//   // Filters
//   search?: string;
//   city?: string;
//   region?: string;
//   country?: string;
//   minAge?: number;
//   maxAge?: number;
//   planType?: EscortPlanType;
//   isVerified?: boolean;
//   isActive?: boolean;
//   category?: string;
//   practice?: string;
//   language?: string;
//   ethnicity?: string;
//   nationality?: string;
//   bustSize?: string;

//   // Sorting
//   sortBy?: "name" | "age" | "createdAt" | "updatedAt" | "plan" | "rating";
//   sortOrder?: "asc" | "desc";

//   // Pagination
//   page?: number;
//   limit?: number;
// }

// export interface GetEscortsResponse extends ApiResponse<Escort[]> {
//   pagination: PaginationMeta;
// }

// export interface GetEscortBySlugResponse extends ApiResponse<Escort> {}

// export interface CreateEscortRequest {
//   escort: Omit<EscortFormData, "id" | "createdAt" | "updatedAt">;
// }

// export interface UpdateEscortRequest {
//   id: string;
//   updates: Partial<EscortFormData>;
// }

// export interface DeleteEscortResponse extends ApiResponse {
//   id: string;
// }

// // ============ UTILITY TYPES ============

// export type PartialEscort = Partial<Escort>;

// // export type EscortPreview = Pick<
// //   Escort,
// //   | "id"
// //   | "slug"
// //   | "name"
// //   | "age"
// //   | "city"
// //   | "previewPhoto"
// //   | "planType"
// //   | "isVerified"
// // >;

// export type EscortWithStats = Escort & {
//   stats: {
//     totalViews: number;
//     totalFavorites: number;
//     totalContacts: number;
//     averageRating: number;
//   };
// };

// // ============ COMPONENT PROP TYPES ============

// export interface EscortCardProps {
//   escort: EscortCard;
//   variant?: "default" | "compact" | "featured" | "detailed";
//   showActions?: boolean;
//   showContact?: boolean;
//   className?: string;
//   onClick?: (escort: EscortCard) => void;
// }

// export interface EscortListProps {
//   escorts: EscortCard[];
//   isLoading?: boolean;
//   isError?: boolean;
//   emptyMessage?: string;
//   variant?: "grid" | "list";
//   columns?: number;
//   onLoadMore?: () => void;
//   hasMore?: boolean;
// }

// export interface EscortDetailProps {
//   escort: Escort;
//   isLoading?: boolean;
//   isError?: boolean;
//   onContact?: () => void;
//   onFavorite?: () => void;
//   onReport?: () => void;
// }

// export interface EscortFiltersProps {
//   filters: Partial<GetEscortsRequest>;
//   onFilterChange: (filters: Partial<GetEscortsRequest>) => void;
//   onReset?: () => void;
//   className?: string;
// }

// // ============ HOOK TYPES ============

// export interface UseEscortsOptions {
//   filters?: Partial<GetEscortsRequest>;
//   enabled?: boolean;
//   keepPreviousData?: boolean;
// }

// export interface UseEscortOptions {
//   slug?: string;
//   id?: string;
//   enabled?: boolean;
// }

// // ============ STATE MANAGEMENT TYPES ============

// export interface EscortState {
//   escorts: EscortCard[];
//   selectedEscort: Escort | null;
//   filters: Partial<GetEscortsRequest>;
//   isLoading: boolean;
//   error: string | null;
//   pagination: PaginationMeta;
// }

// export interface EscortActions {
//   setEscorts: (escorts: EscortCard[]) => void;
//   setSelectedEscort: (escort: Escort | null) => void;
//   setFilters: (filters: Partial<GetEscortsRequest>) => void;
//   clearFilters: () => void;
//   loadMore: () => Promise<void>;
//   refresh: () => Promise<void>;
// }

// // ============ TRANSFORMER FUNCTIONS ============

// /**
//  * Transform Mongoose document to frontend Escort type
//  */
// export function transformEscortDocument(doc: EscortDocument): Escort {
//   return {
//     id: doc._id,
//     slug: doc.slug,
//     source: doc.source as EscortSource,

//     // Basic Information
//     name: doc.name || "",
//     username: doc.username,
//     clerkUserId: doc.clerkUserId,

//     // Contact Information
//     contact: {
//       email: doc.email,
//       telephone: doc.telephone,
//       whatsappPhone: doc.whatsappPhone,
//     },

//     // Location
//     location: {
//       country: doc.region, // Note: your schema uses region for country
//       region: doc.region,
//       town: doc.town,
//       city: doc.town, // Assuming town is city
//       estate: doc.estate,
//       street: doc.street,
//       address: doc.address,
//     },

//     // Physical Attributes
//     attributes: {
//       age: doc.age,
//       bustSize: doc.bustSize,
//       breastSize: doc.breastSize,
//       weight: doc.weight,
//       hairColor: doc.hairColor,
//       ethnicity: doc.ethnicity,
//       nationality: doc.nationality,
//       zodiacSign: doc.zodiacSign,
//       sexualOrientation: doc.sexualOrientation,
//       ageCategory: doc.ageCategory,
//       character: doc.character,
//       experience: doc.experience,
//     },

//     // Services
//     services: {
//       practices: doc.practices,
//       bdsm: doc.bdsm,
//       massage: doc.massage,
//       extraServices: doc.extraServices,
//       categories: doc.categories,
//       languages: doc.languages,
//       availability: doc.availability || [],
//     },

//     // Media
//     media: {
//       images: doc.images,
//       videos: doc.videos,
//       previewPhoto: doc.previewPhoto,
//     },

//     // Description
//     about: doc.about,
//     description: doc.about,

//     // Pricing
//     rates: doc.rates,

//     // Opening Hours
//     openingHours: doc.openingHours,

//     // Labels & Tags
//     labels: doc.labels,

//     // Status
//     isActive: doc.isActive || false,
//     isVerified: doc.isVerified || false,

//     // Role & Plan
//     role: doc.role as EscortRole,
//     plan: doc.plan,

//     // Timestamps
//     createdAt: doc.createdAt,
//     updatedAt: doc.updatedAt,

//     // Relationships
//     userId: doc.user?.toString(),
//   };
// }

// /**
//  * Transform to card view
//  */
// export function transformToEscortCard(escort: Escort): EscortCard {
//   return {
//     id: escort.id,
//     slug: escort.slug,
//     name: escort.name,
//     age: escort.attributes.age,
//     city: escort.location.city,
//     town: escort.location.town,
//     region: escort.location.region,
//     nationality: escort.attributes.nationality,
//     ethnicity: escort.attributes.ethnicity,
//     bustSize: escort.attributes.bustSize,
//     previewPhoto: escort.media.previewPhoto,
//     images: escort.media.images,
//     planType: escort.plan?.type,
//     isVerified: escort.isVerified,
//     isActive: escort.isActive,
//     rates: escort.rates,
//     createdAt: escort.createdAt,
//     labels: escort.labels,
//   };
// }

// /**
//  * Transform form data to database format
//  */
// export function transformFormToDocument(
//   data: EscortFormData,
// ): Partial<EscortDocument> {
//   return {
//     name: data.name,
//     username: data.username,
//     email: data.email,
//     telephone: data.telephone,
//     whatsappPhone: data.whatsappPhone,
//     age: data.age,
//     bustSize: data.bustSize,
//     breastSize: data.breastSize,
//     weight: data.weight,
//     hairColor: data.hairColor,
//     ethnicity: data.ethnicity,
//     nationality: data.nationality,
//     zodiacSign: data.zodiacSign,
//     sexualOrientation: data.sexualOrientation,
//     ageCategory: data.ageCategory,
//     character: data.character,
//     experience: data.experience,
//     estate: data.estate,
//     region: data.region,
//     town: data.town,
//     address: data.address,
//     street: data.street,
//     practices: data.practices,
//     bdsm: data.bdsm,
//     massage: data.massage,
//     extraServices: data.extraServices,
//     categories: data.categories,
//     languages: data.languages,
//     availability: data.availability,
//     about: data.about,
//     images: data.images,
//     videos: data.videos,
//     previewPhoto: data.previewPhoto,
//     rates: data.rates,
//     openingHours: data.openingHours as WeeklyOpeningHours,
//     labels: data.labels,
//     isActive: data.isActive,
//     isVerified: data.isVerified,
//     // plan: data.plan,
//     role: data.role,
//     source: data.source,
//   };
// }

// // export interface EscortPopulated extends Omit<EscortDoc, "region" | "county"> {
// //   regionDetails?: IRegion;
// //   countyDetails?: ICounty;
// //   region?: IRegion;
// //   county?: ICounty;
// //   displayLocation?: string;
// // }

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

  // Location (Kenya) - REFACTORED FOR MULTIPLE REGIONS
  country?: string;
  county?: Types.ObjectId;
  countyCode?: string;

  // Changed from single region to array of regions
  regions?: Types.ObjectId[];

  // Primary location (main working area)
  primaryRegion?: Types.ObjectId;

  // Location details - can vary by region
  locations?: Array<{
    region: Types.ObjectId;
    town?: string;
    estate?: string;
    address?: string;
    street?: string;
    postalCode?: string;
    isActive?: boolean;
    notes?: string;
  }>;

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
