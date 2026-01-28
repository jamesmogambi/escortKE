import { Schema, model, models } from "mongoose";

/* ---------- Interface ---------- */

export interface IRegion {
  name: string;
  countyCode: string; // e.g. "047" for Nairobi
  isActive?: boolean;
}

/* ---------- Schema ---------- */

const RegionSchema = new Schema<IRegion>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    countyCode: {
      type: String,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

/* ---------- Indexes ---------- */

// Prevent duplicate region names within the same county
RegionSchema.index({ countyCode: 1, name: 1 }, { unique: true });

export const Region = models.Region || model<IRegion>("Region", RegionSchema);
