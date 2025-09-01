// models/Area.ts
import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
});

export const Area = mongoose.models.Area || mongoose.model("Area", AreaSchema);
