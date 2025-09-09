import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";
import { girls } from "@/fixtures/girl";

export const metadata = {
  title: "Over 800 girls for sex from all over Kenya - escortke.com",
};
export default function Home() {
  return (
    <>
      <GirlRegions />
      <GirlList girls={girls} className="max-w-6xl" />

      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}
