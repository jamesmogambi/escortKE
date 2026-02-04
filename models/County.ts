// models/County.ts
import mongoose from "mongoose";

export interface ICounty extends mongoose.Document {
  name: string;
  code?: string;
  description?: string;
  isPopular?: boolean;
  population?: number;
  area?: string; // e.g., "696 km²"
  capital?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CountySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined without duplicate error
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true, // Index for faster queries
    },
    population: {
      type: Number,
      min: 0,
    },
    area: {
      type: String,
      trim: true,
    },
    capital: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for total escorts in this county (if you have an Escort model)
CountySchema.virtual("escortCount", {
  ref: "Escort", // Reference to your Escort model
  localField: "code",
  foreignField: "countyCode",
  count: true,
});

// Virtual for average rating (if you have ratings)
CountySchema.virtual("averageRating", {
  ref: "Rating", // Reference to your Rating model
  localField: "code",
  foreignField: "countyCode",
  justOne: false,
  options: {
    sort: { createdAt: -1 },
    match: { isActive: true },
  },
});

// Indexes for better query performance
CountySchema.index({ isPopular: 1, name: 1 });
CountySchema.index({ population: -1 });
CountySchema.index({ name: "text", description: "text" });

// Clear the model first to avoid OverwriteModelError in development
if (mongoose.models.County) {
  delete mongoose.models.County;
}

export const County = mongoose.model<ICounty>("County", CountySchema);
