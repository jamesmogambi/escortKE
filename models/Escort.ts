// import mongoose, { Schema, Document, Types } from "mongoose";

// export interface OpeningHour {
//   day: string;
//   open: string;
//   close: string;
//   closed: boolean;
// }

// export interface Rate {
//   label: string; // e.g., "1 Hour", "Overnight", "Weekend"
//   amount: string; // e.g., "KES 5,000" or "USD 100"
//   currency?: string; // Optional: "KES", "USD", etc.
// }

// export const defaultOpeningHours = [
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
//   { _id: false } // Prevents Mongoose from auto-generating _id for subdocuments
// );

// export interface EscortDoc extends Document {
//   name: string;
//   labels: string[];
//   age: string;
//   telephone: string;
//   whatsappPhone: string;
//   images: string[];
//   videos: string[]; // new field
//   about: string;
//   availability: string;
//   ethnicity: string;
//   nationality: string;
//   bustSize: string;
//   weight: string;
//   zodiacSign: string;
//   sexualOrientation: string;
//   languages: Record<string, string>;
//   clerkUserId: string; // ID from Clerk auth provider
//   avatar?: string; // profile image URL
//   estate: string;
//   city: string;
//   slug: String;
//   address: string; // new field
//   services: string[];
//   //   user: Types.ObjectId; // reference to User schema
//   role: "escort" | "business" | "admin"; // RBAC-ready
//   openingHours: OpeningHour[]; // ✅ New field
//   rates: Rate[];
// }

// const RateSchema = new Schema<Rate>(
//   {
//     label: { type: String, required: true },
//     amount: { type: String, required: true },
//     currency: { type: String }, // Optional
//   },
//   { _id: false }
// );

// const EscortSchema = new Schema<EscortDoc>(
//   {
//     name: { type: String, required: true },
//     clerkUserId: { type: String },
//     avatar: { type: String, trim: true },
//     labels: { type: [String], default: [] },
//     age: { type: String },
//     telephone: { type: String },
//     whatsappPhone: { type: String },
//     images: { type: [String], default: [] },
//     videos: { type: [String], default: [] }, // store video URLs or file paths
//     about: { type: String },
//     availability: { type: String },
//     ethnicity: { type: String },
//     nationality: { type: String },
//     bustSize: { type: String },
//     weight: { type: String },
//     zodiacSign: { type: String },
//     sexualOrientation: { type: String },
//     languages: { type: Map, of: String, default: {} },
//     estate: { type: String },
//     city: { type: String },
//     address: { type: String }, // could be a detailed street address
//     services: { type: [String], default: [] },
//     slug: { type: String },

//     openingHours: { type: [OpeningHourSchema], default: defaultOpeningHours }, // ✅ New field
//     rates: { type: [RateSchema], default: [] },
//     // user: { type: Schema.Types.ObjectId, ref: "User", required: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Escort ||
//   mongoose.model<EscortDoc>("Escort", EscortSchema);

import mongoose, { Schema, Document, Types } from "mongoose";

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Rate {
  duration: string;
  incall: string;
  outcall?: string;
}

export interface EscortDoc extends Document {
  name: string;
  clerkUserId?: string;
  avatar?: string;
  labels: string[];
  age?: string;
  telephone?: string;
  whatsappPhone?: string;
  images: string[];
  videos: string[];
  about?: string;
  availability?: string;
  ethnicity?: string;
  nationality?: string;
  bustSize?: string;
  weight?: string;
  zodiacSign?: string;
  sexualOrientation?: string;
  languages: Record<string, string>;
  estate?: string;
  city?: string;
  address?: string;
  practices: string[];
  bdsm: string[];
  massage: string[];
  extraServices: string[];
  slug: string;
  openingHours: OpeningHour[];
  rates: Rate[];
  role: "escort" | "business" | "admin" | "user";
  isActive?: boolean;
  isVerified?: boolean;
  street?: string;
  region?: string;
  user?: Types.ObjectId;
  // added fields
  breastSize?: string;
  ageCategory?: string;
  character?: string;
  hairColor?: string;
  experience?: string;
  categories?: string[];
}

export const defaultOpeningHours: OpeningHour[] = [
  {
    day: "Monday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
  {
    day: "Tuesday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
  {
    day: "Wednesday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
  {
    day: "Thursday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
  {
    day: "Friday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
  {
    day: "Saturday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
  {
    day: "Sunday",
    open: "Not Specified",
    close: "Not Specified",
    closed: true,
  },
];

const OpeningHourSchema = new Schema<OpeningHour>(
  {
    day: { type: String, required: true },
    open: { type: String, required: true },
    close: { type: String, required: true },
    closed: { type: Boolean, required: true },
  },
  { _id: false }
);

const EscortSchema = new Schema<EscortDoc>(
  {
    name: { type: String, required: true, trim: true },
    clerkUserId: { type: String, index: true },
    avatar: { type: String, trim: true },
    labels: { type: [String], default: [] },
    age: { type: String },
    telephone: { type: String },
    whatsappPhone: { type: String },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    about: { type: String },
    availability: { type: String },
    ethnicity: { type: String },
    nationality: { type: String },
    bustSize: { type: String },
    weight: { type: String },
    zodiacSign: { type: String },
    sexualOrientation: { type: String, default: null },
    languages: { type: Map, of: String, default: {} },
    estate: { type: String },
    region: { type: String },
    city: { type: String },
    address: { type: String },
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
    // openingHours: {
    //   type: [OpeningHourSchema],
    //   default: defaultOpeningHours,
    // },
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    rates: [
      {
        duration: { type: String, required: true },
        incall: { type: String, default: "" },
        outcall: { type: String, default: "" },
      },
    ],

    // ✅ Newly added fields
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    street: { type: String, trim: true },

    user: { type: Schema.Types.ObjectId, ref: "User" },

    breastSize: { type: String },
    ageCategory: { type: String },
    character: { type: String },
    hairColor: { type: String },
    experience: { type: String },
    categories: { type: String, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Escort ||
  mongoose.model<EscortDoc>("Escort", EscortSchema);
