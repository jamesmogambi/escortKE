// county.model.ts - Try this approach
import mongoose from "mongoose";

export interface ICounty extends mongoose.Document {
  name: string;
  code?: string;
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
  },
  { timestamps: true },
);

// Clear the model first to avoid OverwriteModelError in development
if (mongoose.models.County) {
  delete mongoose.models.County;
}

export const County = mongoose.model<ICounty>("County", CountySchema);
