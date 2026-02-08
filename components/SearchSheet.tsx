"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, XIcon } from "lucide-react";
import { Input } from "./ui/input";

const SearchSheet = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="bg-black/80" />

        <DialogTrigger>
          <Search className="h-8 w-8 text-white" />
        </DialogTrigger>
        <DialogContent className="top-[20%]  lg:max-w-6xl">
          <DialogClose asChild>
            <button className="absolute -top-12 right-4 p-2 rounded-sm overflow-hidden cursor-pointer z-20 bg-transparent text-primary">
              <XIcon className="size-8" />
            </button>
          </DialogClose>

          <form>
            <div className="flex gap-3 ">
              <Input className="bg-white h-12 font-semibold border-0 text-black focus-visible:ring-0  rounded-md text-lg" />
              <button className="bg-primary uppercase  p-3 font-bold text-xl text-white rounded-md px-4">
                Search
              </button>
            </div>
          </form>

          {/* TODO: display recent searches */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchSheet;
