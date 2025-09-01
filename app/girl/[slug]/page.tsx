import React from "react";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Minus } from "lucide-react";
import Link from "next/link";
import GirlProfile from "../GirlProfile";
import { girls } from "@/fixtures/girl";

const page = ({ params }: { params: { slug: string } }) => {
  // const { slug } = params;

  // if (!slug) {
  //   notFound(); // optional: redirect to 404
  // }

  // TODO: GET USER BY DATA FROM DATABASE USING SLUG
  const county = "Nairobi";
  const region = "Langata";
  const userName = "Monica_Kimani_33";

  return (
    <div className="w-full lg:max-w-7xl mx-auto p">
      {/* // introduction */}

      <Breadcrumb className="p-4">
        <BreadcrumbList className="items-center flex-nowrap ">
          <BreadcrumbItem>
            <Link
              className="text-primary hover:text-primary bg-transparent text-sm lg:text-lg font-bold"
              href="/"
            >
              Introduction
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-lg text-white">
            -
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <Link
              className="text-primary hover:text-primary bg-transparent text-sm lg:text-lg font-bold"
              href={`/girls/${region}`}
            >
              sex {region}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-white text-lg">
            -
          </BreadcrumbSeparator>
          <BreadcrumbItem className="cursor-default">
            <Link
              className=" hover:text-white text-white cursor-default bg-transparent text-sm lg:text-lg font-bold"
              href="#"
            >
              {userName}
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <GirlProfile girl={girls[0]} />
    </div>
  );
};

export default page;
