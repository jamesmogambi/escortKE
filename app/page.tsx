import { getSimpleFeaturedEscorts } from "@/actions/list-escort";
import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";
import { girls } from "@/fixtures/girl";
import { connectToDB, safeClone, serializeMongoDocs } from "@/lib/mongoose";
import { ICounty } from "@/models/County";
import Escort from "@/models/Escort";
import { IRegion } from "@/models/Region";
// import { IRegion } from "@/types/escort.types";

export const metadata = {
  title: "Over 800 girls for sex from all over Kenya - escortke.com",
  description:
    "Find the best escorts in Kenya. Browse profiles with photos, rates, and reviews. Book your perfect companion today!",
  keywords: [
    "escorts Kenya",
    "Kenya escort services",
    "Nairobi escorts",
    "Mombasa escorts",
    "Kisumu escorts",
    "escort profiles Kenya",
    "book escorts Kenya",
    "Kenya companion services",
    "Kenya adult services",
    "Kenya escort agency",
  ],
};
export default async function Home() {
  const { data, count, success, error } = await getSimpleFeaturedEscorts();

  console.log("featured escorts", data);
  return (
    <>
      <GirlRegions />
      <GirlList girls={data} className="max-w-6xl" />

      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}
