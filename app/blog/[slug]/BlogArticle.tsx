import SectionCard from "@/components/SectionCard";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AuthorSection from "./AuthorSection";

interface Prop {
  blog: any;
  className?: string;
}
const BlogArticle = ({ blog, className }: Prop) => {
  const { publishedAt, title, slug, excerpt, featuredImage, content, author } =
    blog;

  const formatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC", // Important for consistent results
  });

  const formattedDate = formatter.format(new Date(publishedAt));
  return (
    <article className={cn("", className)}>
      {/* header */}
      <div className=" lg:ml-10 border-green-700 w-fit flex justify-center items-center  flex-col">
        <p className="text-primary font-bold text-sm   uppercase">
          published : {formattedDate}
        </p>
        <h4 className="lg:text-2xl text-xl text-center mb-6 font-bold">
          {title}
        </h4>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          //   width="8"
          //   height="8"
          viewBox="0 0 8 8"
          className="size-10 text-stone-500"
        >
          <path
            fill="currentColor"
            d="M4 0C2.9 0 2 .9 2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2M3 4.81V8l1-1l1 1V4.81c-.31.11-.65.19-1 .19s-.69-.08-1-.19"
          />
        </svg>
      </div>

      {/* rest section */}
      <SectionCard className="md:p-12 p-6 my-8">
        <div className="relative w-full h-48 md:h-[420px] ">
          <Image
            src={featuredImage}
            alt={excerpt || slug}
            fill // This makes the image fill the parent container
            className="object-cover" // This ensures the image covers the area
            sizes="100vw" // Tell Next.js this image is full width
            priority // Optional: if it's above the fold
            quality={90}
          />
        </div>

        {/* Render HTML content */}
        <div
          className="prose  prose-lg max-w-none my-10"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* // render author */}
        <AuthorSection author={author} />

        {/* // section */}
        <div className="border-b border-gray-1 "></div>
        <div className="border-b border-gray-1 mt-14 "></div>

        <div className="flex my-8 justify-center items-center p-4">
          <Link
            href="/blog"
            className="text-white uppercase font-bold rounded-md px-6 text-base p-4 bg-primary"
          >
            back to the blog
          </Link>
        </div>
      </SectionCard>
    </article>
  );
};

export default BlogArticle;
