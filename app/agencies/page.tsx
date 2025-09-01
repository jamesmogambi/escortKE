import FilterInput from "@/components/FilterInput";
import GirlRegions from "@/components/GirlRegions";
import React from "react";
import AgencyFilterInput from "./AgencyFilterInput";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import AgencyList from "./AgencyList";
import { agencies } from "@/fixtures/agency";

const page = () => {
  return (
    <div>
      <div className="w-full -mt-4  pb-6 py-10 bg-black">
        <AgencyFilterInput className="border-0 -mt-4" />
      </div>

      <div className="w-full lg:max-w-7xl mx-auto p-4">
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

            <BreadcrumbItem className="cursor-default">
              <Link
                className=" hover:text-white text-white cursor-default bg-transparent text-sm lg:text-lg font-bold"
                href="#"
              >
                Erotic Privates
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AgencyList agencies={agencies} />
      </div>
    </div>
  );
};

export default page;
