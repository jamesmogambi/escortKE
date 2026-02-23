// import { getSimpleFeaturedEscorts } from "@/actions/list-escort";
import React from "react";
import GirlList from "./GirlList";
import { cn } from "@/lib/utils";
import { fetchGirlEscorts } from "@/actions/escort.action";
import { ITEMS_PER_PAGE } from "@/constants";

interface Prop {
  className?: string;
}
const NotFoundList = async ({ className }: Prop) => {
  const res = await fetchGirlEscorts({
    sortBy: "newest",
    limit: ITEMS_PER_PAGE,
  });
  return (
    <section className={cn("my-6", className)}>
      <p className="font-semibold mb-8 text-center text-xl">
        {" "}
        <span className="text-primary">
          Unfortunately, we have to disappoint you, but there are no girls for
          sex{" "}
        </span>
        {"  "}
        advertised in this region yet , try girls from other regions below.{" "}
      </p>
      <div>
        {res.success && res.total > 0 && <GirlList girls={res.escorts} />}
      </div>
    </section>
  );
};

export default NotFoundList;
