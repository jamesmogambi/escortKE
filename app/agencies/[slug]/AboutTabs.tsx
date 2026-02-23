import { cn, slugify } from "@/lib/utils";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import About from "./About";
import { practices } from "@/fixtures/practice";
import Link from "next/link";
import About from "@/app/girl/About";

interface Prop {
  className?: string;
  agency: any;
}

interface WorkDay {
  id: string;
  date: string; // ISO date string: "2025-08-20"
  startTime: string; // "09:00"
  endTime: string; // "17:30"
}

const AboutTabs = ({ agency, className }: Prop) => {
  const { photos, videos } = agency;

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
    <section
      className={cn("inline-flex flex-col lg:flex-row gap-12 p-4", className)}
    >
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
    </section>
  );
};

export default AboutTabs;
