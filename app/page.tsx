import {
  getHomeEscorts,
  // getSimpleFeaturedEscorts,
} from "@/actions/list-escort";
import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";

// export const metadata = {
//   title: "Over 900 girls for sex from all over Kenya - escortke.com",
//   description:
//     "Find the best escorts in Kenya. Browse profiles with photos, rates, and reviews. Book your perfect companion today!",
//   keywords: [
//     "escorts Kenya",
//     "Kenya escort services",
//     "Nairobi escorts",
//     "Mombasa escorts",
//     "Kisumu escorts",
//     "escort profiles Kenya",
//     "book escorts Kenya",
//     "Kenya companion services",
//     "Kenya adult services",
//     "Kenya escort agency",
//   ],

// TODO:// CALL SERVER ACTION OF GIRLS FOR HOME PAGE
interface HomePageProps {
  searchParams?: {
    featured?: string;
    recent?: string;
    verified?: string;
    popular?: string;
  };
}
export default async function Home({ searchParams }: HomePageProps) {
  // const { data, count, success, error } = await getSimpleFeaturedEscorts();
  // const { data, success, error } = await getHomeEscorts();
  // const { featured, popular, recent, verified } = data;
  // console.log("featured escorts", data);

  // Get current pages from searchParams
  const featuredPage = parseInt(searchParams?.featured || "1");
  const recentPage = parseInt(searchParams?.recent || "1");
  const verifiedPage = parseInt(searchParams?.verified || "1");
  const popularPage = parseInt(searchParams?.popular || "1");

  // Fetch all sections in parallel
  const { featured, recent, verified, popular } = await getHomeEscorts(
    featuredPage,
    recentPage,
    verifiedPage,
    popularPage,
  );
  return (
    <>
      <GirlRegions />
      <GirlList girls={recent.items} className="max-w-6xl" />

      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}
