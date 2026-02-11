import React from "react";
import CategorySection from "../CategorySection";
import { CATEGORIES_FLAT } from "@/lib/blog/constants";
import BreadCrumbHeader from "./BreadCrumbHeader";
import { getBlogPostBySlug } from "@/actions/blog";

interface Prop {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
const layout = async ({ children, params }: Prop) => {
  // Await the params promise
  const { slug } = await params;
  const firstSeven: any = CATEGORIES_FLAT.slice(0, 7); // Items 0-6
  const nextThree: any = CATEGORIES_FLAT.slice(7, 10); // Items 7-9

  console.log("slug name", slug);
  //   get blog by slugname
  const res: any = await getBlogPostBySlug(slug);

  console.log("blog article ==>", res);
  return (
    <>
      <BreadCrumbHeader title={res?.data?.post?.title} />
      <div className="flex w-full mx-auto flex-col-reverse  lg:max-w-[80%] min-h-screen lg;flex-col lg:flex-row gap-2 ">
        {/* categories section*/}
        <aside className=" basis-full space-y-7 lg:basis-1/3 p-6  border-green-600">
          <CategorySection title="Sexypedia" categories={firstSeven} />
          <CategorySection title="Magazine" categories={nextThree} />
        </aside>

        {/* render blog */}
        <article className="basis-full p-8  border-amber-300 lg:flex-1">
          {/* Posts Grid */}
          {children}
        </article>
      </div>
    </>
  );
};

export default layout;
