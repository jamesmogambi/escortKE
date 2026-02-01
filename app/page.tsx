import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";
import { girls } from "@/fixtures/girl";
import { connectToDB, safeClone } from "@/lib/mongoose";
import Escort from "@/models/Escort";
import { connect } from "http2";

export const metadata = {
  title: "Over 800 girls for sex from all over Kenya - escortke.com",
};
export default async function Home() {
  await connectToDB();

  // Get 15 featured escorts
  const featuredEscorts = await Escort.find({
    isActive: true,
    previewPhoto: { $exists: true, $ne: "" }, // Has profile photo
    images: { $exists: true, $ne: [] }, // Has at least one image
  })
    // .select(
    //   "name age nationality previewPhoto city plan slug bustSize about isVerified images",
    // )
    .sort({
      // plan: -1, // VIP/Premium first
      // isVerified: -1, // Verified profiles
      images: -1, // More images first
      createdAt: -1, // Newest
    })
    .limit(20)
    .lean(); // Convert to plain objects for better performance

  console.log("featured escorts", featuredEscorts);
  return (
    <>
      <GirlRegions />
      <GirlList girls={safeClone(featuredEscorts)} className="max-w-6xl" />

      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}
