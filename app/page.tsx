import { fetchGirlEscorts } from "@/actions/escort.action";
import {
  getHomeEscorts,
  // getSimpleFeaturedEscorts,
} from "@/actions/list-escort";
import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";
import NotFoundList from "@/components/NotFoundList";
import { ITEMS_PER_PAGE } from "@/constants";
import { notFound } from "next/navigation";

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

interface PageProps {
  searchParams: Promise<{
    county?: string;
    region?: string;
    practice?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const { county, region, practice } = params;

  const res = await fetchGirlEscorts({
    countyName: params.county,
    regionName: params.region,
    practice: params.practice,
    page: params.page ? parseInt(params.page, 10) : 1,
    limit: ITEMS_PER_PAGE,
  });

  if (!res.success) {
    notFound();
  }

  console.log("home listing escorts -->", res);

  return (
    <>
      <GirlRegions />
      {res.success && res.total > 0 && <GirlList girls={res.escorts} />}

      {res.success && res.total === 0 && (
        <>
          <p className="font-semibold  text-center text-xl">
            {" "}
            <span className="text-primary">
              Unfortunately, we have to disappoint you, but there are no girls
              for sex{" "}
            </span>
            {"  "}
            advertised in this city yet , try girls from other cities
            below.{" "}
          </p>
          {/* TODO:// ADD NOT FOUND LIST */}
          {/* <NotFoundList /> */}
        </>
      )}
      {/* <GirlList girls={recent.items} className="max-w-6xl" /> */}

      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}
