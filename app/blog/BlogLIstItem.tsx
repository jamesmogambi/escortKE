import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Prop {
  blog: any;
  className?: string;
}
const BlogLIstItem = ({ blog, className }: Prop) => {
  return (
    <Link href={`/blog/${blog.slug}`} className={cn("w-full", className)}>
      {/* BlogLIstItem: {blog.slug} */}

      <div className="relative w-full h-48 ">
        <Image
          src={blog.featuredImage}
          alt={blog.slug}
          fill // This makes the image fill the parent container
          className="object-cover" // This ensures the image covers the area
          sizes="100vw" // Tell Next.js this image is full width
          priority // Optional: if it's above the fold
        />
      </div>

      <h4 className="mt-5 text-xl text-center text-primary font-semibold">
        {blog.title}
      </h4>
    </Link>
  );
};

export default BlogLIstItem;
