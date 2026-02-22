import { fetchGirlEscorts } from "@/actions/escort.action";
import {
  getHomeEscorts,
  // getSimpleFeaturedEscorts,
} from "@/actions/list-escort";
import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
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
  const { county, region, practice, page } = params;
  console.log("home params ==>", county, region, practice, page);

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

      {res.success && res.total === 0 && <NotFoundList />}
      <ClientPaginationWrapper
        totalPages={res.totalPages}
        currentPage={res.page}
        totalItems={res.total}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <WhyProfile className="mt-20" />
      <PassionateMoments className="mt-8" />
    </>
  );
}
