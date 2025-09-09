// models/Region.ts
import mongoose from "mongoose";

const RegionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, default: "Kenya" },
});

export const Region =
  mongoose.models.Region || mongoose.model("Region", RegionSchema);
