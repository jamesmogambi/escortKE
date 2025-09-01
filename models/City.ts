// models/City.ts
import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, default: "Kenya" },
});

export const City = mongoose.models.City || mongoose.model("City", CitySchema);
