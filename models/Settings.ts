import mongoose, { Schema, Document } from "mongoose";

interface VariantItem {
  name: string;
  flag?: string;
}

interface VariantSettingDoc extends Document {
  age: VariantItem[];
  breast: VariantItem[];
  character: VariantItem[];
  hairColor: VariantItem[];
  nationality: VariantItem[];
  experience: VariantItem[];
  languages: VariantItem[];
  availability: string[];
  categories: string[];
  practices: { id: number; name: string }[];
  bdsm: { id: number; name: string }[];
  massage: { id: number; name: string }[];
}

const VariantItemSchema = new Schema<VariantItem>(
  {
    name: { type: String, required: true },
    flag: { type: String },
  },
  { _id: false }
);

const NamedIdSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const VariantSettingSchema = new Schema<VariantSettingDoc>(
  {
    age: [VariantItemSchema],
    breast: [VariantItemSchema],
    character: [VariantItemSchema],
    hairColor: [VariantItemSchema],
    nationality: [VariantItemSchema],
    experience: [VariantItemSchema],
    languages: [VariantItemSchema],
    availability: [{ type: String }],
    categories: [{ type: String }],
    practices: [NamedIdSchema],
    bdsm: [NamedIdSchema],
    massage: [NamedIdSchema],
  },
  { timestamps: true }
);

export const VariantSetting =
  mongoose.models.VariantSetting ||
  mongoose.model<VariantSettingDoc>("VariantSetting", VariantSettingSchema);
