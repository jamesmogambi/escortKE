"use client";
import { cn, formatSlugToTitle } from "@/lib/utils";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { regions, towns } from "@/fixtures/location";
import Link from "next/link";
import { X } from "lucide-react";
// import { practices } from "@/fixtures/practice";
import { useFilterInputStore } from "@/app/girls/filterInputStore";
import LocationInitializer from "./FileInputInitializer";
import { useRouter, useSearchParams } from "next/navigation";

interface Prop {
  className?: string;
}
const FilterInput = ({ className }: Prop) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [region, setRegion] = useState("");
  const [open, setOpen] = React.useState(false);
  const [townOpen, setTownOpen] = React.useState(false);
  const [town, setTown] = useState("");
  const [towns, setTowns] = useState([]);

  const [practice, setPractice] = useState("");
  const [practiceOpen, setPracticeOpen] = React.useState(false);

  const { practices, regions, towns: fetchedTowns } = useFilterInputStore();
  const clearFilters = () => {
    (setRegion(""), setTown(""), setPractice(""), setTowns([]));
    const params = new URLSearchParams(searchParams.toString());
    params.delete("region");
    params.delete("area");
    params.delete("practice");
    router.replace(`?${params.toString()}`);
  };

  const handleRegion = (val: string) => {
    (setTown(""), setTowns([]));
    // Update region state
    setRegion(val);

    // Update query params
    const params = new URLSearchParams(searchParams.toString());
    params.delete("region");
    params.delete("area"); // Optional: remove stale town param
    params.delete("practice"); // Optional: remove stale practice param
    router.replace(`?${params.toString()}`);

    // Filter towns based on selected region
    const filteredTowns = fetchedTowns.filter(
      (town: { region: { name: string } }) => town.region.name === val
    );

    console.log("filteredTowns", filteredTowns);
    setTowns(filteredTowns);
  };

  const handlePractice = (val: string) => {
    // const params = new URLSearchParams(searchParams.toString());
    setPractice(val);
    // params.set("practice", val);
    // router.replace(`?${params.toString()}`);
  };

  const handleTown = (val: any) => {
    if (!region) {
      alert("You must first select region");
    }
    setTown(val);
    // const params = new URLSearchParams(searchParams.toString());
    // params.set("area", val); // Replace "filter" with your param key

    // router.replace(`?${params.toString()}`);
  };

  const onFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("region", region);
    params.set("area", town);
    params.set("practice", practice);
    router.replace(`?${params.toString()}`);
  };
  return (
    <div
      className={cn(
        " flex justify-center flex-row flex-wrap   w-full gap-6 ",
        className
      )}
    >
      <LocationInitializer />
      {/* regiosn */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className=" self-end  cursor-pointer border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
          {region ? (
            <span className="text-slate-100 text-lg font-bold">{region}</span>
          ) : (
            <span className="text-white/50 text-lg font-medium">Region</span>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 32 32"
            className="text-white/50"
          >
            <path
              fill="currentColor"
              d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"
              strokeWidth={1}
              stroke="currentColor"
            ></path>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          //   side="left"
          className="flex border-0 flex-col outline-none p-2 gap-3 w-screen  lg:max-w-[900px] bg-gray-1 "
        >
          <div className="flex flex-row w-full gap-1.5  flex-wrap">
            {regions.map((item: any) => (
              <DropdownMenuItem
                className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                onSelect={(e) => handleRegion(item.name)}
                key={item.id}
              >
                {formatSlugToTitle(item.name)}
              </DropdownMenuItem>
            ))}
          </div>

          <button
            onClick={() => {
              (setRegion(""), setOpen(false));
            }}
            className="inline-flex text-primary cursor-pointer  mx-auto items-center gap-2"
          >
            <X className="h-5 w-5" />
            <span className="font-medium">Cancel Filter</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* town */}

      <DropdownMenu open={townOpen} onOpenChange={setTownOpen}>
        <DropdownMenuTrigger className="self-end text-nowrap overflow-ellipsis pr-2 cursor-pointer border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
          {town ? (
            <span className="text-slate-100 text-lg font-bold">{town}</span>
          ) : (
            <span className="text-white/50 text-lg font-medium">
              Town or Area
            </span>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 32 32"
            className="text-white/50"
          >
            <path
              fill="currentColor"
              d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"
              strokeWidth={1}
              stroke="currentColor"
            ></path>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          //   side="left"
          className="flex border-0 flex-col outline-none p-2 gap-3 w-screen  lg:max-w-[900px] bg-gray-1 "
        >
          <div className="flex -2 gap-1.5 flex-wrap">
            {towns.map((item: any) => (
              <DropdownMenuItem
                className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                onSelect={(e) => handleTown(item.name)}
                key={item.id}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </div>

          <button
            onClick={() => {
              (setTown(""), setTownOpen(false));
            }}
            className="inline-flex text-primary cursor-pointer  mx-auto items-center gap-2"
          >
            <X className="h-5 w-5" />
            <span className="font-medium">Cancel Filter</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* practices */}
      <DropdownMenu open={practiceOpen} onOpenChange={setPracticeOpen}>
        <DropdownMenuTrigger className=" cursor-pointer self-end border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
          {practice ? (
            <span className="text-slate-100 text-lg font-bold capitalize">
              {practice}
            </span>
          ) : (
            <span className="text-white/50 text-lg font-medium">Practice</span>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 32 32"
            className="text-white/50"
          >
            <path
              fill="currentColor"
              d="M8.037 11.166L14.5 22.36c.825 1.43 2.175 1.43 3 0l6.463-11.195c.826-1.43.15-2.598-1.5-2.598H9.537c-1.65 0-2.326 1.17-1.5 2.6z"
              strokeWidth={1}
              stroke="currentColor"
            ></path>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          //   side="left"
          className="flex border-0 flex-col outline-none p-2 gap-3 w-screen  lg:max-w-[900px] bg-gray-1 "
        >
          <div className="flex -2 gap-1.5 flex-wrap">
            {practices.map((item: any) => (
              <DropdownMenuItem
                className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                onSelect={(e) => {
                  handlePractice(item.name);
                }}
                key={item.id}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </div>

          <button
            onClick={() => {
              (setPractice(""), setPracticeOpen(false));
            }}
            className="inline-flex text-primary cursor-pointer  mx-auto items-center gap-2"
          >
            <X className="h-5 w-5" />
            <span className="font-medium">Cancel Filter</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-col   items-center gap-2">
        <button
          onClick={clearFilters}
          className="text-pink-600 cursor-pointer flex items-center"
        >
          <X className="h-5 w-5" />
          <span className="font-bold text-base">Cancel Filter</span>
        </button>

        <button
          onClick={onFilter}
          className="rounded-md cursor-pointer hover:bg-primary/80 text-white bg-primary text-lg font-medium p-2 px-5"
        >
          Filter the girls
        </button>
      </div>
    </div>
  );
};

export default FilterInput;
