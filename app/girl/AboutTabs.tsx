import { cn, slugify } from "@/lib/utils";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import About from "./About";
import { practices } from "@/fixtures/practice";
import Link from "next/link";

interface Prop {
  className?: string;
  girl: Girl;
}

interface WorkDay {
  id: string;
  date: string; // ISO date string: "2025-08-20"
  startTime: string; // "09:00"
  endTime: string; // "17:30"
}

const AboutTabs = ({ girl, className }: Prop) => {
  const { photos, videos } = girl;

  const days = Array.from({ length: 7 }, (_, i) => {
    // const date = new Date(today);
    // date.setDate(today.getDate() + i);

    return {
      id: i.toString(),
      day: "Monday",
      startTime: "09:00",
      endTime: "17:30",
    };
  });

  const [firstFive, lastTwo] = [days.slice(0, 5), days.slice(5)];

  function splitIntoThreeColumns<T>(items: T[]): [T[], T[], T[]] {
    const columns: [T[], T[], T[]] = [[], [], []];

    items.forEach((item, index) => {
      columns[index % 3].push(item);
    });

    return columns;
  }

  const [col1, col2, col3] = splitIntoThreeColumns(practices);

  return (
    <div className={cn("", className)}>
      <Tabs defaultValue="about" className="w-full bg-transparent">
        <TabsList className="w-full gap-10  bg-transparent ">
          <TabsTrigger
            className=" data-[state=active]:bg-primary text-white text-base font-semibold cursor-pointer py-6  items-center flex  bg-gray-1"
            value="about"
          >
            about me
          </TabsTrigger>
          <TabsTrigger
            className=" data-[state=active]:bg-primary text-white text-base font-semibold cursor-pointer py-6  items-center flex  bg-gray-1"
            value="openingHours"
          >
            opening Hours
          </TabsTrigger>
          <TabsTrigger
            className=" data-[state=active]:bg-primary text-white text-base font-semibold cursor-pointer py-6  items-center flex  bg-gray-1"
            value="practices"
          >
            practices
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="about">
          <About girl={girl} />
        </TabsContent>
        <TabsContent className="text-base" value="openingHours">
          <div className="inline-flex flex-col lg:flex-row gap-12 p-4">
            {/* Column 1 */}
            <div className="space-y-2 basis-full lg:basis-1/2">
              {firstFive.map((item, index) => (
                <div key={index} className="">
                  <span className="mr-4 text-white/40">{item.day}:</span>
                  {"             "}
                  <span className="font-medium">
                    {item.startTime}-{item.endTime}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-2 basis-full lg:basis-1/2">
              {lastTwo.map((item, index) => (
                <div key={index} className="">
                  <span className="mr-4 text-white/40">{item.day}:</span>
                  {"             "}
                  <span className="font-medium">
                    {item.startTime}-{item.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="practices">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
            {[col1, col2, col3].map((column, i) => (
              <div key={i} className="space-y-3 flex flex-col">
                {column.map((item, j) => (
                  <Link
                    href={`/practices/${slugify(item.practice)}`}
                    key={j}
                    className="bg-primary font-medium text-white  text-center rounded-full p-2.5 "
                  >
                    {item.practice}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutTabs;
