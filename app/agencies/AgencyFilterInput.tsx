"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { regions, towns } from "@/fixtures/location";
import Link from "next/link";
import { X } from "lucide-react";
import { practices } from "@/fixtures/practice";
import { agencies } from "@/fixtures/agency";

interface Prop {
  className?: string;
}
const AgencyFilterInput = ({ className }: Prop) => {
  const [region, setRegion] = useState("");
  const [open, setOpen] = React.useState(false);
  const [townOpen, setTownOpen] = React.useState(false);
  const [town, setTown] = useState("");
  const [agency, setAgency] = useState("");
  const [agencyOpen, setAgencyOpen] = React.useState(false);

  const clearFilters = () => {
    setRegion(""), setTown(""), setAgency("");
  };

  return (
    <div
      className={cn(
        " flex justify-center flex-row flex-wrap  w-full gap-6 ",
        className
      )}
    >
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
            {regions.map((item) => (
              <DropdownMenuItem
                className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                onSelect={(e) => setRegion(item.location)}
                key={item.id}
              >
                {item.location}
              </DropdownMenuItem>
            ))}
          </div>

          <button
            onClick={() => {
              setRegion(""), setOpen(false);
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
        <DropdownMenuTrigger className="self-end cursor-pointer border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
          {town ? (
            <span className="text-slate-100 text-lg font-bold">{town}</span>
          ) : (
            <span className="text-white/50 text-lg font-medium">Town</span>
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
            {towns.map((item) => (
              <DropdownMenuItem
                className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                onSelect={(e) => setTown(item.location)}
                key={item.id}
              >
                {item.location}
              </DropdownMenuItem>
            ))}
          </div>

          <button
            onClick={() => {
              setTown(""), setTownOpen(false);
            }}
            className="inline-flex text-primary cursor-pointer  mx-auto items-center gap-2"
          >
            <X className="h-5 w-5" />
            <span className="font-medium">Cancel Filter</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* practices */}
      <DropdownMenu open={agencyOpen} onOpenChange={setAgencyOpen}>
        <DropdownMenuTrigger className=" cursor-pointer self-end border-0 flex w-full lg:w-[250px] justify-between items-center p-2 text-base px-5 bg-gray-1 rounded-md ">
          {agency ? (
            <span className="text-slate-100 text-lg font-bold capitalize">
              {agency}
            </span>
          ) : (
            <span className="text-white/50 text-lg font-medium">
              Select an Agency
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
            {agencies.map((item: any) => (
              <DropdownMenuItem
                className="rounded-lg cursor-pointer hover:bg-[#262322] p-1.5 px-6 text-white/70 text-base font-medium bg-[#262322]"
                onSelect={(e) => setAgency(item.name)}
                key={item.id}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </div>

          <button
            onClick={() => {
              setAgency(""), setAgencyOpen(false);
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

        <button className="rounded-md cursor-pointer hover:bg-primary/80 text-white bg-primary text-lg font-medium p-2 px-5">
          Filter the girls
        </button>
      </div>
    </div>
  );
};

export default AgencyFilterInput;
