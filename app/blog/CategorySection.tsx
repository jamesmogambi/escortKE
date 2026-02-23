import { cn, slugify } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  colorCode: string;
  icon: string;
  isActive: boolean;
  parentId: string | null;
  level: 0 | 1; // 0 = main category, 1 = subcategory
  order: number;
  createdAt?: Date; // Optional if you add timestamps later
  updatedAt?: Date; // Optional if you add timestamps later
}
interface Prop {
  className?: string;
  title: string;
  categories: Category[];
}
const CategorySection = ({ categories, title, className }: Prop) => {
  return (
    <ul
      className={cn(
        "w-full bg-stone-900 flex flex-col border border-black ",
        className,
      )}
    >
      {/* header */}
      <li className="bg-black px-2 text-primary text-xl font-semibold p-5">
        {title}
      </li>

      {/* loop through the categories */}

      {categories.map((category, _) => (
        <Link
          className="p-5 text-base font-medium py-2.5"
          href={`/blog/${slugify(category.name)}`}
        >
          {category.name}
        </Link>
      ))}
    </ul>
  );
};

export default CategorySection;
