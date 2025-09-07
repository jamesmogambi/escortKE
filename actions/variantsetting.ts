// app/actions/getVariantSettings.ts
"use server";

// import { VariantSetting } from "@/models/VariantSetting";
import { connectToDB, safeClone } from "@/lib/mongoose";
import { VariantSetting } from "@/models/Settings";

export async function getVariantSettings() {
  await connectToDB();
  const res = await VariantSetting.findOne({}).lean();
  const settings = safeClone(res);
  return settings;
}
