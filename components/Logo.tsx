import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Prop {
  className?: string;
  href?: string;
  height?: number;
  width?: number;
}
const Logo = ({ className, height = 100, href, width = 200 }: Prop) => {
  return (
    <Link className={cn("", className)} href="/">
      <Image
        alt="logo"
        width={width}
        height={height}
        src={"/logo.jpg"}
        priority
        quality={100}
        className=""
      />
    </Link>
  );
};

export default Logo;
