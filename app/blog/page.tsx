// import { getAllSubcategories } from "@/constants/blog";
import React from "react";

import {
  getMainCategories,
  buildCategoryTree,
  CATEGORIES_FLAT,
} from "@/lib/blog/constants";
import CategorySection, { Category } from "./CategorySection";
// import { getAllSubcategories, BLOG_CATEGORIES } from "../../constants/blog";

const page = () => {
  // const res = getAllSubcategories();

  // Get all categories
  const allCategories = getMainCategories();

  console.log("categories flat => ", CATEGORIES_FLAT);

  // Original array remains unchanged
  console.log(CATEGORIES_FLAT.length); // Always the same

  // Using slice to get sections
  const firstSeven: any = CATEGORIES_FLAT.slice(0, 7); // Items 0-6
  const nextThree: any = CATEGORIES_FLAT.slice(7, 10); // Items 7-9
  const allRest = CATEGORIES_FLAT.slice(7); // Items 7 to end
  const lastThree = CATEGORIES_FLAT.slice(-3); // Last 3 items

  // Verify original unchanged
  console.log(firstSeven.length); // 7
  console.log(CATEGORIES_FLAT.length);

  // Get breadcrumbs for a subcategory
  // Returns: [{React category}, {React Core category}]
  return (
    <>
      <div className="flex w-full mx-auto flex-col-reverse  lg:max-w-7xl min-h-screen lg;flex-col lg:flex-row gap-2 ">
        {/* categories section*/}
        <aside className=" basis-full space-y-7 lg:basis-1/3 p-6 border border-green-600">
          <CategorySection title="Sexypedia" categories={firstSeven} />
          <CategorySection title="Magazine" categories={nextThree} />
        </aside>

        {/* blogs list */}
        <div className="basis-full p-8 border border-amber-300 lg:flex-1"></div>
      </div>
    </>
  );
};

export default page;
