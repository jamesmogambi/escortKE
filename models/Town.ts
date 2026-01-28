// models/Town.ts
import mongoose from "mongoose";

const TownSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
});

export const Town = mongoose.models.Town || mongoose.model("Town", TownSchema);
