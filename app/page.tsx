import { fetchGirlEscorts } from "@/actions/escort.action";
import PassionateMoments from "@/components/blog/PassionateMoments";
import WhyProfile from "@/components/blog/WhyProfile";
import { ClientPaginationWrapper } from "@/components/ClientPaginationWrapper";
import GirlList from "@/components/GirlList";
import GirlRegions from "@/components/GirlRegions";
import NotFoundList from "@/components/NotFoundList";
import { ITEMS_PER_PAGE } from "@/constants";
import { notFound } from "next/navigation";

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
