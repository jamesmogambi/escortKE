// // import mongoose, { Schema, Document, Types } from "mongoose";
// // import { ICounty } from "./County";
// // import { IRegion } from "./Region";

// // export interface OpeningHour {
// //   day: string;
// //   open: string;
// //   close: string;
// //   closed: boolean;
// // }

// // export interface Rate {
// //   duration: string;
// //   incall: string;
// //   outcall?: string;
// // }

// // export interface PlanDetails {
// //   type: "basic" | "vip" | "premium";
// //   isActive: boolean;
// //   activatedAt?: Date;
// //   expiresAt?: Date;
// //   features: string[];
// // }

// // // export interface EscortDoc extends Document {
// // //   name?: string;
// // //   clerkUserId?: string;
// // //   username?: string;
// // //   previewPhoto?: string;
// // //   email: string;
// // //   labels: string[];
// // //   age?: string;
// // //   telephone?: string;
// // //   whatsappPhone?: string;
// // //   images: string[];
// // //   videos: string[];
// // //   about?: string;
// // //   availability?: string[];
// // //   ethnicity?: string;
// // //   nationality?: string;
// // //   bustSize?: string;
// // //   weight?: string;
// // //   source?: string;
// // //   zodiacSign?: string;
// // //   sexualOrientation?: string;
// // //   languages: string[];
// // //   categories: string[];
// // //   estate?: string;
// // //   town?: string;
// // //   address?: string;
// // //   practices: string[];
// // //   bdsm: string[];
// // //   massage: string[];
// // //   extraServices: string[];
// // //   slug: string;
// // //   // openingHours: OpeningHour[];
// // //   openingHours: {
// // //     monday: { type: String; default: "" };
// // //     tuesday: { type: String; default: "" };
// // //     wednesday: { type: String; default: "" };
// // //     thursday: { type: String; default: "" };
// // //     friday: { type: String; default: "" };
// // //     saturday: { type: String; default: "" };
// // //     sunday: { type: String; default: "" };
// // //   };

// // //   rates: Rate[];
// // //   role: "escort" | "business" | "admin" | "user";
// // //   isActive?: boolean;
// // //   isVerified?: boolean;
// // //   street?: string;
// // //   region?: string;
// // //   user?: Types.ObjectId;
// // //   // added fields
// // //   breastSize?: string;
// // //   ageCategory?: string;
// // //   character?: string;
// // //   hairColor?: string;
// // //   experience?: string;
// // //   plan?: PlanDetails;
// // // }

// // export interface EscortDoc extends Document {
// //   name?: string;
// //   clerkUserId?: string;
// //   username?: string;
// //   previewPhoto?: string;
// //   email: string;
// //   labels: string[];
// //   age?: string;
// //   telephone?: string;
// //   whatsappPhone?: string;
// //   images: string[];
// //   videos: string[];
// //   about?: string;
// //   availability?: string[];
// //   ethnicity?: string;
// //   nationality?: string;
// //   bustSize?: string;
// //   weight?: string;
// //   source?: string;
// //   zodiacSign?: string;
// //   sexualOrientation?: string;
// //   languages: string[];
// //   categories: string[];

// //   // Location fields for Kenya
// //   country?: string; // Default to "Kenya"
// //   county?: Types.ObjectId; // Reference to County (Nairobi, Mombasa, etc.)
// //   countyCode?: string; // Alternative: store county code directly
// //   region?: Types.ObjectId; // Reference to Region (within county)
// //   town?: string; // Specific town/location within region
// //   estate?: string; // Neighborhood/estate within town
// //   address?: string;
// //   street?: string;
// //   postalCode?: string;

// //   practices: string[];
// //   bdsm: string[];
// //   massage: string[];
// //   extraServices: string[];
// //   slug: string;

// //   openingHours: {
// //     monday: { type: String; default: "" };
// //     tuesday: { type: String; default: "" };
// //     wednesday: { type: String; default: "" };
// //     thursday: { type: String; default: "" };
// //     friday: { type: String; default: "" };
// //     saturday: { type: String; default: "" };
// //     sunday: { type: String; default: "" };
// //   };

// //   rates: Rate[];
// //   role: "escort" | "business" | "admin" | "user";
// //   isActive?: boolean;
// //   isVerified?: boolean;
// //   user?: Types.ObjectId;

// //   // added fields
// //   breastSize?: string;
// //   ageCategory?: string;
// //   character?: string;
// //   hairColor?: string;
// //   experience?: string;
// //   plan?: PlanDetails;

// //   // Virtual populated fields
// //   countyDetails?: ICounty;
// //   regionDetails?: IRegion;
// // }

// // export const defaultOpeningHours: OpeningHour[] = [
// //   {
// //     day: "Monday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// //   {
// //     day: "Tuesday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// //   {
// //     day: "Wednesday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// //   {
// //     day: "Thursday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// //   {
// //     day: "Friday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// //   {
// //     day: "Saturday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// //   {
// //     day: "Sunday",
// //     open: "Not Specified",
// //     close: "Not Specified",
// //     closed: true,
// //   },
// // ];

// // const OpeningHourSchema = new Schema<OpeningHour>(
// //   {
// //     day: { type: String, required: true },
// //     open: { type: String, required: true },
// //     close: { type: String, required: true },
// //     closed: { type: Boolean, required: true },
// //   },
// //   { _id: false },
// // );

// // // models/escort.model.ts - Update schema
// // const EscortSchema = new Schema<EscortDoc>(
// //   {
// //     name: { type: String, trim: true },
// //     clerkUserId: { type: String, index: true },
// //     username: { type: String, unique: true, trim: true },
// //     previewPhoto: { type: String, trim: true },
// //     labels: { type: [String], default: [] },
// //     email: { type: String },
// //     age: { type: String },
// //     telephone: { type: String },
// //     whatsappPhone: { type: String },
// //     images: { type: [String], default: [] },
// //     videos: { type: [String], default: [] },
// //     about: { type: String },
// //     availability: { type: [String], default: [] },
// //     ethnicity: { type: String, default: "" },
// //     nationality: { type: String, default: "" },
// //     bustSize: { type: String },
// //     weight: { type: String },
// //     zodiacSign: { type: String },
// //     sexualOrientation: { type: String, default: null },
// //     languages: { type: [String], default: [] },
// //     categories: { type: [String], default: [] },

// //     // Kenya-specific location fields
// //     country: {
// //       type: String,
// //       trim: true,
// //       default: "Kenya",
// //       index: true,
// //     },
// //     county: {
// //       type: Schema.Types.ObjectId,
// //       ref: "County",
// //       index: true,
// //     },
// //     countyCode: {
// //       type: String,
// //       trim: true,
// //       index: true,
// //     },
// //     region: {
// //       type: Schema.Types.ObjectId,
// //       ref: "Region",
// //       index: true,
// //     },
// //     town: {
// //       type: String,
// //       trim: true,
// //       index: true,
// //     },
// //     estate: {
// //       type: String,
// //       trim: true,
// //       index: true,
// //     },
// //     address: { type: String, trim: true },
// //     street: { type: String, trim: true },
// //     postalCode: { type: String, trim: true },

// //     source: { type: String, default: "custom" },
// //     practices: { type: [String], default: [] },
// //     bdsm: { type: [String], default: [] },
// //     massage: { type: [String], default: [] },
// //     extraServices: { type: [String], default: [] },
// //     slug: { type: String, required: false, unique: true, index: true },
// //     role: {
// //       type: String,
// //       enum: ["escort", "business", "admin", "user"],
// //       default: "escort",
// //     },

// //     openingHours: {
// //       monday: { type: String, default: "" },
// //       tuesday: { type: String, default: "" },
// //       wednesday: { type: String, default: "" },
// //       thursday: { type: String, default: "" },
// //       friday: { type: String, default: "" },
// //       saturday: { type: String, default: "" },
// //       sunday: { type: String, default: "" },
// //     },

// //     rates: [
// //       {
// //         duration: { type: String, required: true },
// //         incall: { type: String, default: "" },
// //         outcall: { type: String, default: "" },
// //       },
// //     ],

// //     isActive: { type: Boolean, default: true },
// //     isVerified: { type: Boolean, default: false },

// //     user: { type: Schema.Types.ObjectId, ref: "User" },

// //     breastSize: { type: String, default: "" },
// //     ageCategory: { type: String, default: "" },
// //     character: { type: String, default: "" },
// //     hairColor: { type: String, default: "" },
// //     experience: { type: String, default: "" },
// //     plan: {
// //       type: {
// //         type: String,
// //         enum: ["basic", "vip", "premium"],
// //         default: "basic",
// //       },
// //       isActive: { type: Boolean, default: true },
// //       activatedAt: { type: Date },
// //       expiresAt: { type: Date },
// //       features: { type: [String], default: [] },
// //     },
// //   },
// //   {
// //     timestamps: true,
// //     toJSON: { virtuals: true },
// //     toObject: { virtuals: true },
// //   },
// // );

// // // Add indexes for common location queries in Kenya
// // EscortSchema.index({ country: 1, county: 1 });
// // EscortSchema.index({ county: 1, region: 1 });
// // EscortSchema.index({ county: 1, town: 1 });
// // EscortSchema.index({ countyCode: 1, town: 1 });
// // EscortSchema.index({ estate: 1, town: 1 });
// // EscortSchema.index({ county: 1, categories: 1 });
// // EscortSchema.index({ countyCode: 1, isActive: 1 });

// // // Virtual for populated location details
// // EscortSchema.virtual("countyDetails", {
// //   ref: "County",
// //   localField: "county",
// //   foreignField: "_id",
// //   justOne: true,
// // });

// // EscortSchema.virtual("regionDetails", {
// //   ref: "Region",
// //   localField: "region",
// //   foreignField: "_id",
// //   justOne: true,
// // });

// // // Virtual for full location string (Kenya format)
// // EscortSchema.virtual("displayLocation").get(function () {
// //   const parts = [];
// //   if (this.estate) parts.push(this.estate);
// //   if (this.town) parts.push(this.town);
// //   if (this.regionDetails?.name) parts.push(this.regionDetails.name);
// //   if (this.countyDetails?.name) parts.push(`${this.countyDetails.name} County`);
// //   return parts.length > 0 ? parts.join(", ") : "Location not specified";
// // });

// // // Virtual for simplified location (County, Town)
// // EscortSchema.virtual("simpleLocation").get(function () {
// //   const parts = [];
// //   if (this.town) parts.push(this.town);
// //   if (this.countyDetails?.name) parts.push(`${this.countyDetails.name} County`);
// //   return parts.length > 0 ? parts.join(", ") : "Location not specified";
// // });

// // // Middleware to ensure countyCode is synced with county reference
// // EscortSchema.pre("save", async function (next) {
// //   if (this.county && this.isModified("county")) {
// //     try {
// //       const { County } = await import("./County");
// //       const countyDoc = await County.findById(this.county);
// //       if (countyDoc) {
// //         this.countyCode = countyDoc.code;
// //       }
// //     } catch (error) {
// //       console.error("Error syncing county code:", error);
// //     }
// //   }
// //   next();
// // });

// // export default mongoose.models.Escort ||
// //   mongoose.model<EscortDoc>("Escort", EscortSchema);

// // // const EscortSchema = new Schema<EscortDoc>(
// // //   {
// // //     name: { type: String, trim: true },
// // //     clerkUserId: { type: String, index: true },
// // //     username: { type: String, unique: true, trim: true },
// // //     previewPhoto: { type: String, trim: true },
// // //     labels: { type: [String], default: [] },
// // //     email: { type: String },
// // //     age: { type: String },
// // //     telephone: { type: String },
// // //     whatsappPhone: { type: String },
// // //     images: { type: [String], default: [] },
// // //     videos: { type: [String], default: [] },
// // //     about: { type: String },
// // //     availability: { type: [String], default: [] },
// // //     ethnicity: { type: String, default: "" },
// // //     nationality: { type: String, default: "" },
// // //     bustSize: { type: String },
// // //     weight: { type: String },
// // //     zodiacSign: { type: String },
// // //     sexualOrientation: { type: String, default: null },
// // //     languages: { type: [String], default: [] },
// // //     estate: { type: String },
// // //     region: { type: String },
// // //     town: { type: String },
// // //     address: { type: String },
// // //     // custom means the escort created her own a/c
// // //     source: { type: String, default: "custom" },

// // //     practices: { type: [String], default: [] },
// // //     bdsm: { type: [String], default: [] },
// // //     massage: { type: [String], default: [] },
// // //     extraServices: { type: [String], default: [] },
// // //     slug: { type: String, required: false, unique: true, index: true },
// // //     role: {
// // //       type: String,
// // //       enum: ["escort", "business", "admin", "user"],
// // //       default: "escort",
// // //     },
// // //     // openingHours: {
// // //     //   type: [OpeningHourSchema],
// // //     //   default: defaultOpeningHours,
// // //     // },
// // //     openingHours: {
// // //       monday: { type: String, default: "" },
// // //       tuesday: { type: String, default: "" },
// // //       wednesday: { type: String, default: "" },
// // //       thursday: { type: String, default: "" },
// // //       friday: { type: String, default: "" },
// // //       saturday: { type: String, default: "" },
// // //       sunday: { type: String, default: "" },
// // //     },

// // //     rates: [
// // //       {
// // //         duration: { type: String, required: true },
// // //         incall: { type: String, default: "" },
// // //         outcall: { type: String, default: "" },
// // //       },
// // //     ],

// // //     // ✅ Newly added fields
// // //     isActive: { type: Boolean, default: true },
// // //     isVerified: { type: Boolean, default: false },
// // //     street: { type: String, trim: true },

// // //     user: { type: Schema.Types.ObjectId, ref: "User" },

// // //     breastSize: { type: String, default: "" },
// // //     ageCategory: { type: String, default: "" },
// // //     character: { type: String, default: "" },
// // //     hairColor: { type: String, default: "" },
// // //     experience: { type: String, default: "" },
// // //     categories: { type: [String], default: [] },
// // //     plan: {
// // //       type: {
// // //         type: String,
// // //         enum: ["basic", "vip", "premium"],
// // //         default: "basic",
// // //       },
// // //       isActive: { type: Boolean, default: true },
// // //       activatedAt: { type: Date },
// // //       expiresAt: { type: Date },
// // //       features: { type: [String], default: [] },
// // //     },
// // //   },
// // //   { timestamps: true },
// // // );

// // // export default mongoose.models.Escort ||
// // //   mongoose.model<EscortDoc>("Escort", EscortSchema);

// import mongoose, { Schema, Document, Types } from "mongoose";
// import { ICounty } from "./County";
// import { IRegion } from "./Region";

// export interface OpeningHour {
//   day: string;
//   open: string;
//   close: string;
//   closed: boolean;
// }

// export interface Rate {
//   duration: string;
//   incall: string;
//   outcall?: string;
// }

// export interface PlanDetails {
//   type: "basic" | "vip" | "premium";
//   isActive: boolean;
//   activatedAt?: Date;
//   expiresAt?: Date;
//   features: string[];
// }

// export interface EscortDoc extends Document {
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
//   availability?: string[];
//   ethnicity?: string;
//   nationality?: string;
//   bustSize?: string;
//   weight?: string;
//   source?: string;
//   zodiacSign?: string;
//   sexualOrientation?: string;

//   // NEW FIELD: Gender with default value 'girl'
//   gender?: "girl" | "boy" | "transgender" | "non-binary" | "other";

//   languages: string[];
//   categories: string[];

//   // Location fields for Kenya
//   country?: string; // Default to "Kenya"
//   county?: Types.ObjectId; // Reference to County (Nairobi, Mombasa, etc.)
//   countyCode?: string; // Alternative: store county code directly
//   region?: Types.ObjectId; // Reference to Region (within county)
//   town?: string; // Specific town/location within region
//   estate?: string; // Neighborhood/estate within town
//   address?: string;
//   street?: string;
//   postalCode?: string;

//   practices: string[];
//   bdsm: string[];
//   massage: string[];
//   extraServices: string[];
//   slug: string;

//   openingHours: {
//     monday: { type: String; default: "" };
//     tuesday: { type: String; default: "" };
//     wednesday: { type: String; default: "" };
//     thursday: { type: String; default: "" };
//     friday: { type: String; default: "" };
//     saturday: { type: String; default: "" };
//     sunday: { type: String; default: "" };
//   };

//   rates: Rate[];
//   role: "escort" | "business" | "admin" | "user";
//   isActive?: boolean;
//   isVerified?: boolean;
//   user?: Types.ObjectId;

//   // added fields
//   breastSize?: string;
//   ageCategory?: string;
//   character?: string;
//   hairColor?: string;
//   experience?: string;
//   plan?: PlanDetails;

//   // Virtual populated fields
//   countyDetails?: ICounty;
//   regionDetails?: IRegion;
// }

// export const defaultOpeningHours: OpeningHour[] = [
//   {
//     day: "Monday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
//   {
//     day: "Tuesday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
//   {
//     day: "Wednesday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
//   {
//     day: "Thursday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
//   {
//     day: "Friday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
//   {
//     day: "Saturday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
//   {
//     day: "Sunday",
//     open: "Not Specified",
//     close: "Not Specified",
//     closed: true,
//   },
// ];

// const OpeningHourSchema = new Schema<OpeningHour>(
//   {
//     day: { type: String, required: true },
//     open: { type: String, required: true },
//     close: { type: String, required: true },
//     closed: { type: Boolean, required: true },
//   },
//   { _id: false },
// );

// // models/escort.model.ts - Updated schema with gender field
// const EscortSchema = new Schema<EscortDoc>(
//   {
//     name: { type: String, trim: true },
//     clerkUserId: { type: String, index: true },
//     username: { type: String, unique: true, trim: true },
//     previewPhoto: { type: String, trim: true },
//     labels: { type: [String], default: [] },
//     email: { type: String },
//     age: { type: String },
//     telephone: { type: String },
//     whatsappPhone: { type: String },
//     images: { type: [String], default: [] },
//     videos: { type: [String], default: [] },
//     about: { type: String },
//     availability: { type: [String], default: [] },
//     ethnicity: { type: String, default: "" },
//     nationality: { type: String, default: "" },
//     bustSize: { type: String },
//     weight: { type: String },
//     zodiacSign: { type: String },
//     sexualOrientation: { type: String, default: null },

//     // NEW FIELD: Gender schema definition
//     gender: {
//       type: String,
//       enum: ["girl", "boy", "transgender", "non-binary", "other"],
//       default: "girl",
//       trim: true,
//       index: true,
//     },

//     languages: { type: [String], default: [] },
//     categories: { type: [String], default: [] },

//     // Kenya-specific location fields
//     country: {
//       type: String,
//       trim: true,
//       default: "Kenya",
//       index: true,
//     },
//     county: {
//       type: Schema.Types.ObjectId,
//       ref: "County",
//       index: true,
//     },
//     countyCode: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     region: {
//       type: Schema.Types.ObjectId,
//       ref: "Region",
//       index: true,
//     },
//     town: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     estate: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     address: { type: String, trim: true },
//     street: { type: String, trim: true },
//     postalCode: { type: String, trim: true },

//     source: { type: String, default: "custom" },
//     practices: { type: [String], default: [] },
//     bdsm: { type: [String], default: [] },
//     massage: { type: [String], default: [] },
//     extraServices: { type: [String], default: [] },
//     slug: { type: String, required: false, unique: true, index: true },
//     role: {
//       type: String,
//       enum: ["escort", "business", "admin", "user"],
//       default: "escort",
//     },

//     openingHours: {
//       monday: { type: String, default: "" },
//       tuesday: { type: String, default: "" },
//       wednesday: { type: String, default: "" },
//       thursday: { type: String, default: "" },
//       friday: { type: String, default: "" },
//       saturday: { type: String, default: "" },
//       sunday: { type: String, default: "" },
//     },

//     rates: [
//       {
//         duration: { type: String, required: true },
//         incall: { type: String, default: "" },
//         outcall: { type: String, default: "" },
//       },
//     ],

//     isActive: { type: Boolean, default: true },
//     isVerified: { type: Boolean, default: false },

//     user: { type: Schema.Types.ObjectId, ref: "User" },

//     breastSize: { type: String, default: "" },
//     ageCategory: { type: String, default: "" },
//     character: { type: String, default: "" },
//     hairColor: { type: String, default: "" },
//     experience: { type: String, default: "" },
//     plan: {
//       type: {
//         type: String,
//         enum: ["basic", "vip", "premium"],
//         default: "basic",
//       },
//       isActive: { type: Boolean, default: true },
//       activatedAt: { type: Date },
//       expiresAt: { type: Date },
//       features: { type: [String], default: [] },
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
// );

// // Add indexes for common queries including gender
// EscortSchema.index({ gender: 1, isActive: 1 });
// EscortSchema.index({ gender: 1, county: 1 });
// EscortSchema.index({ gender: 1, countyCode: 1 });
// EscortSchema.index({ gender: 1, categories: 1 });
// EscortSchema.index({ country: 1, county: 1 });
// EscortSchema.index({ county: 1, region: 1 });
// EscortSchema.index({ county: 1, town: 1 });
// EscortSchema.index({ countyCode: 1, town: 1 });
// EscortSchema.index({ estate: 1, town: 1 });
// EscortSchema.index({ county: 1, categories: 1 });
// EscortSchema.index({ countyCode: 1, isActive: 1 });

// // Virtual for populated location details
// EscortSchema.virtual("countyDetails", {
//   ref: "County",
//   localField: "county",
//   foreignField: "_id",
//   justOne: true,
// });

// EscortSchema.virtual("regionDetails", {
//   ref: "Region",
//   localField: "region",
//   foreignField: "_id",
//   justOne: true,
// });

// // Virtual for full location string (Kenya format)
// EscortSchema.virtual("displayLocation").get(function () {
//   const parts = [];
//   if (this.estate) parts.push(this.estate);
//   if (this.town) parts.push(this.town);
//   if (this.regionDetails?.name) parts.push(this.regionDetails.name);
//   if (this.countyDetails?.name) parts.push(`${this.countyDetails.name} County`);
//   return parts.length > 0 ? parts.join(", ") : "Location not specified";
// });

// // Virtual for simplified location (County, Town)
// EscortSchema.virtual("simpleLocation").get(function () {
//   const parts = [];
//   if (this.town) parts.push(this.town);
//   if (this.countyDetails?.name) parts.push(`${this.countyDetails.name} County`);
//   return parts.length > 0 ? parts.join(", ") : "Location not specified";
// });

// // NEW: Virtual for gender display with proper capitalization
// EscortSchema.virtual("genderDisplay").get(function () {
//   const genderMap: Record<string, string> = {
//     girl: "Girl",
//     boy: "Boy",
//     transgender: "Transgender",
//     "non-binary": "Non-binary",
//     other: "Other",
//   };
//   const gender = (this.gender as string) || "girl";
//   return genderMap[gender] || "Girl";
// });

// // NEW: Virtual for gender-based profile classification
// EscortSchema.virtual("profileType").get(function () {
//   if (this.gender === "girl") return "female";
//   if (this.gender === "boy") return "male";
//   if (this.gender === "transgender") return "trans";
//   return "other";
// });

// // Middleware to ensure countyCode is synced with county reference
// EscortSchema.pre("save", async function (next) {
//   if (this.county && this.isModified("county")) {
//     try {
//       const { County } = await import("./County");
//       const countyDoc = await County.findById(this.county);
//       if (countyDoc) {
//         this.countyCode = countyDoc.code;
//       }
//     } catch (error) {
//       console.error("Error syncing county code:", error);
//     }
//   }
//   next();
// });

// // NEW: Static method to find escorts by gender
// EscortSchema.statics.findByGender = function (gender: EscortDoc["gender"]) {
//   return this.find({ gender, isActive: true });
// };

// // NEW: Static method to get gender statistics
// EscortSchema.statics.getGenderStats = async function () {
//   return this.aggregate([
//     { $match: { isActive: true } },
//     { $group: { _id: "$gender", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//   ]);
// };

// // Add the static methods to the model
// interface EscortModel extends mongoose.Model<EscortDoc> {
//   findByGender(gender: EscortDoc["gender"]): Promise<EscortDoc[]>;
//   getGenderStats(): Promise<Array<{ _id: string; count: number }>>;
// }

// export default mongoose.models.Escort ||
//   mongoose.model<EscortDoc, EscortModel>("Escort", EscortSchema);

// models/escort.model.ts
import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { ICounty } from "./County";
import { IRegion } from "./Region";
import { IEscort } from "@/types/escort.types";
import { IAgency } from "@/types/agency.types";

export interface EscortDoc extends IEscort {
  // Virtual populated fields
  countyDetails?: ICounty;
  regionDetails?: IRegion;
  agencyDetails?: IAgency;
}

const EscortSchema: Schema = new Schema<EscortDoc>(
  {
    name: { type: String, trim: true },
    clerkUserId: { type: String, index: true },
    username: { type: String, unique: true, trim: true },
    previewPhoto: { type: String, trim: true },
    labels: { type: [String], default: [] },
    email: { type: String },
    age: { type: String },
    telephone: { type: String },
    whatsappPhone: { type: String },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    about: { type: String },
    availability: { type: [String], default: [] },
    ethnicity: { type: String, default: "" },
    nationality: { type: String, default: "" },
    bustSize: { type: String },
    weight: { type: String },
    zodiacSign: { type: String },
    sexualOrientation: { type: String, default: null },
    languages: { type: [String], default: [] },
    categories: { type: [String], default: [] },

    // Kenya-specific location fields
    country: {
      type: String,
      trim: true,
      default: "Kenya",
      index: true,
    },
    county: {
      type: Schema.Types.ObjectId,
      ref: "County",
      index: true,
    },
    countyCode: {
      type: String,
      trim: true,
      index: true,
    },
    region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
      index: true,
    },
    town: {
      type: String,
      trim: true,
      index: true,
    },
    estate: {
      type: String,
      trim: true,
      index: true,
    },
    address: { type: String, trim: true },
    street: { type: String, trim: true },
    postalCode: { type: String, trim: true },

    source: { type: String, default: "custom" },
    practices: { type: [String], default: [] },
    bdsm: { type: [String], default: [] },
    massage: { type: [String], default: [] },
    extraServices: { type: [String], default: [] },
    slug: { type: String, required: false, unique: true, index: true },
    role: {
      type: String,
      enum: ["escort", "business", "admin", "user"],
      default: "escort",
    },

    openingHours: {
      monday: { type: String, default: "" },
      tuesday: { type: String, default: "" },
      wednesday: { type: String, default: "" },
      thursday: { type: String, default: "" },
      friday: { type: String, default: "" },
      saturday: { type: String, default: "" },
      sunday: { type: String, default: "" },
    },

    rates: [
      {
        duration: { type: String, required: true },
        incall: { type: String, default: "" },
        outcall: { type: String, default: "" },
      },
    ],

    // Physical Attributes
    breastSize: { type: String, default: "" },
    ageCategory: { type: String, default: "" },
    character: { type: String, default: "" },
    hairColor: { type: String, default: "" },
    experience: { type: String, default: "" },

    // Agency Relationship
    workType: {
      type: String,
      enum: ["independent", "agency_employee"],
      default: "independent",
      index: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      index: true,
    },
    agencyRole: {
      type: String,
      enum: ["owner", "manager", "employee", "independent_contractor"],
    },
    agencyCommissionRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    isAgencyFeatured: {
      type: Boolean,
      default: false,
    },

    // Status
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },

    // Subscription Plan
    plan: {
      type: {
        type: String,
        enum: ["basic", "vip", "premium"],
        default: "basic",
      },
      isActive: { type: Boolean, default: true },
      activatedAt: { type: Date },
      expiresAt: { type: Date },
      features: { type: [String], default: [] },
    },

    // Statistics
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
EscortSchema.virtual("countyDetails", {
  ref: "County",
  localField: "county",
  foreignField: "_id",
  justOne: true,
});

EscortSchema.virtual("regionDetails", {
  ref: "Region",
  localField: "region",
  foreignField: "_id",
  justOne: true,
});

EscortSchema.virtual("agencyDetails", {
  ref: "Agency",
  localField: "agencyId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for work type display
EscortSchema.virtual("workTypeDisplay").get(function () {
  if (this.workType === "independent") {
    return "Independent Escort";
  } else if (this.agencyDetails) {
    return `Agency: ${(this.agencyDetails as IAgency).name}`;
  }
  return "Escort";
});

// Indexes
EscortSchema.index({ workType: 1, isActive: 1 });
EscortSchema.index({ agencyId: 1, isActive: 1 });
EscortSchema.index({ county: 1, workType: 1 });
EscortSchema.index({ rating: -1, totalReviews: -1 });
EscortSchema.index({ isFeatured: 1, createdAt: -1 });
EscortSchema.index({ workType: 1, isVerified: 1 });

// for search optimization
EscortSchema.index({
  name: "text",
  username: "text",
  about: "text",
  town: "text",
  estate: "text",
  categories: "text",
  practices: "text",
});

EscortSchema.index({ isActive: 1, isVerified: 1 });
EscortSchema.index({ "countyDetails.name": 1 });
EscortSchema.index({ "regionDetails.name": 1 });

export default mongoose.models.Escort ||
  mongoose.model<EscortDoc>("Escort", EscortSchema);
