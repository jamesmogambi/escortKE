import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Prop {
  className?: string;
  author: any;
}
const AuthorSection = ({ author, className }: Prop) => {
  console.log("author==>", author);

  const { role, name, avatar, bio, _id } = author;
  return (
    <div
      className={cn(
        "flex bg-black/50 p-6 my-8 flex-col md:flex-row gap-6",
        className,
      )}
    >
      {/* <section 1 */}
      <div className="basis-full md:basis-3/4">
        <h3 className="text-2xl font-semibold text-primary">{name}</h3>

        <p className="text-base text-gray-1 font-semibold">{bio}</p>
      </div>
      {/* avatar */}
      <div className="relative basis-full h-48  md:basis-1/4  ">
        <Image
          src={avatar}
          alt={name}
          fill // This makes the image fill the parent container
          className="object-cover" // This ensures the image covers the area
          sizes="100vw" // Tell Next.js this image is full width
          priority // Optional: if it's above the fold
          quality={90}
        />
      </div>
    </div>
  );
};

export default AuthorSection;
