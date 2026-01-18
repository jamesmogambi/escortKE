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
  name?: string;
  clerkUserId?: string;
  username?: string;
  previewPhoto?: string;
  email: string;
  labels: string[];
  age?: string;
  telephone?: string;
  whatsappPhone?: string;
  images: string[];
  videos: string[];
  about?: string;
  availability?: string[];
  ethnicity?: string;
  nationality?: string;
  bustSize?: string;
  weight?: string;
  source?: string;
  zodiacSign?: string;
  sexualOrientation?: string;
  languages: string[];
  categories: string[];
  estate?: string;
  town?: string;
  address?: string;
  practices: string[];
  bdsm: string[];
  massage: string[];
  extraServices: string[];
  slug: string;
  // openingHours: OpeningHour[];
  openingHours: {
    monday: { type: String; default: "" };
    tuesday: { type: String; default: "" };
    wednesday: { type: String; default: "" };
    thursday: { type: String; default: "" };
    friday: { type: String; default: "" };
    saturday: { type: String; default: "" };
    sunday: { type: String; default: "" };
  };

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
  { _id: false },
);

const EscortSchema = new Schema<EscortDoc>(
  {
    name: { type: String, required: true, trim: true },
    clerkUserId: { type: String, index: true },
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
    estate: { type: String },
    region: { type: String },
    town: { type: String },
    address: { type: String },
    // custom means the escort created her own a/c
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
    // openingHours: {
    //   type: [OpeningHourSchema],
    //   default: defaultOpeningHours,
    // },
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

    // ✅ Newly added fields
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    street: { type: String, trim: true },

    user: { type: Schema.Types.ObjectId, ref: "User" },

    breastSize: { type: String, default: "" },
    ageCategory: { type: String, default: "" },
    character: { type: String, default: "" },
    hairColor: { type: String, default: "" },
    experience: { type: String, default: "" },
    categories: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.models.Escort ||
  mongoose.model<EscortDoc>("Escort", EscortSchema);
