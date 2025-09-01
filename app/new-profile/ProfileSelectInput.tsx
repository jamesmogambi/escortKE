import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import React, { useState } from "react";

interface Props {
  name?: string;
  type?: string;
  register?: any;
  error?: any;
  isMust?: boolean;
  className?: string;
  label?: string;
  options: any[];
  placeholder?: string;
  onChange: (value: any, name: any) => void;
  value?: any;
  defaultValue?: any;
  inputClass?: string;
}

const ProfileSelectInput = ({
  name,
  type = "text",
  register,
  error,
  isMust = false,
  className = "",
  options,
  label,
  placeholder = "- Select -",
  onChange,
  value,
  defaultValue,
  inputClass,
}: Props) => {
  // const handleSelectChange = (value: string) => {
  //     if (onChange) {
  //       onChange(value, name); // Call the onChange handler with the selected value
  //     }
  //   };

  return (
    <div className={cn("", className)}>
      <label className="mb-3">{label}</label>

      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={(val) => onChange(val, name)}
      >
        <SelectTrigger
          className={cn(
            "mt-3 py-6 w-full outline-none rounded-none border-0  bg-purple-darker",
            inputClass
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-none outline-none border-0 text-white bg-purple-darker ">
          <SelectGroup>
            <SelectLabel>Select</SelectLabel>
            <SelectItem
              className="rounded-none focus:text-white focus:bg-purple-dark"
              value={"namem"}
            >
              james Mogambi
            </SelectItem>
            {/* {options.map((i) => (
              <SelectItem
                className="rounded-none focus:text-white focus:bg-purple-dark"
                value={i}
              >
                {i.name}
              </SelectItem>
            ))} */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfileSelectInput;
