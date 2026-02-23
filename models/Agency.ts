// models/Agency.ts
import { IAgency } from "@/types/agency.types";
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AgencyDoc extends Omit<IAgency, "_id">, Document {}

const AgencySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Agency name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
    },
    whatsappPhone: {
      type: String,
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, "Please enter a valid URL"],
    },

    // Owner (must be an escort with role='business')
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Escort",
      required: [true, "Owner reference is required"],
      index: true,
    },

    // Location
    country: {
      type: String,
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
    },
    address: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },

    // Business Details
    businessType: {
      type: String,
      enum: ["agency", "spa", "massage_parlor", "brothel"],
      default: "agency",
      index: true,
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },

    // Opening Hours
    openingHours: {
      monday: { type: String, default: "09:00-18:00" },
      tuesday: { type: String, default: "09:00-18:00" },
      wednesday: { type: String, default: "09:00-18:00" },
      thursday: { type: String, default: "09:00-18:00" },
      friday: { type: String, default: "09:00-18:00" },
      saturday: { type: String, default: "09:00-18:00" },
      sunday: { type: String, default: "09:00-18:00" },
    },

    // Services
    services: {
      type: [String],
      default: [],
    },
    specialties: {
      type: [String],
      default: [],
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationDocuments: {
      businessLicense: String,
      taxCertificate: String,
      idProof: String,
      otherDocuments: [String],
    },

    // Media
    logo: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },

    // Agency Features
    establishmentYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    languages: {
      type: [String],
      default: ["English", "Swahili"],
    },
    paymentMethods: {
      type: [String],
      default: ["Cash", "M-Pesa"],
    },

    // Social Media
    socialMedia: {
      instagram: String,
      twitter: String,
      facebook: String,
      telegram: String,
    },

    // Subscription Plan
    plan: {
      type: {
        type: String,
        enum: ["basic", "premium", "enterprise"],
        default: "basic",
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      activatedAt: {
        type: Date,
      },
      expiresAt: {
        type: Date,
      },
      features: {
        type: [String],
        default: [],
      },
      maxEmployees: {
        type: Number,
        default: 10,
      },
      maxGalleryImages: {
        type: Number,
        default: 20,
      },
    },

    // Statistics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    featuredEmployeesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
AgencySchema.virtual("owner", {
  ref: "Escort",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true,
});

AgencySchema.virtual("employees", {
  ref: "Escort",
  localField: "_id",
  foreignField: "agencyId",
  justOne: false,
  match: { isActive: true, workType: "agency_employee" },
});

AgencySchema.virtual("featuredEmployees", {
  ref: "Escort",
  localField: "_id",
  foreignField: "agencyId",
  justOne: false,
  match: {
    isActive: true,
    workType: "agency_employee",
    isAgencyFeatured: true,
  },
});

AgencySchema.virtual("totalEmployees").get(function () {
  // This would be updated via middleware or scheduled job
  return this.featuredEmployeesCount || 0;
});

// Indexes
AgencySchema.index({ slug: 1 });
AgencySchema.index({ country: 1, county: 1 });
AgencySchema.index({ county: 1, town: 1 });
AgencySchema.index({ businessType: 1, isActive: 1 });
AgencySchema.index({ isVerified: 1, isActive: 1 });
AgencySchema.index({ rating: -1, totalReviews: -1 });

// Middleware to update featured employees count
AgencySchema.pre("save", async function (next) {
  if (this.isModified("isActive")) {
    try {
      const Escort = mongoose.model("Escort");
      const count = await Escort.countDocuments({
        agencyId: this._id,
        isActive: true,
        workType: "agency_employee",
        isAgencyFeatured: true,
      });
      this.featuredEmployeesCount = count;
    } catch (error) {
      console.error("Error updating featured employees count:", error);
    }
  }
  next();
});

export default mongoose.models.Agency ||
  mongoose.model<AgencyDoc>("Agency", AgencySchema);
