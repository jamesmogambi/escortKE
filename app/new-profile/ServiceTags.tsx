"use client";
import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn, formatCategory } from "@/lib/utils";

type InputTagsProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  inputClass?: string;
};

export const ServiceTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, inputClass }, ref) => {
    const [inputValue, setInputValue] = useState("");

    const addTag = () => {
      const formatted = formatCategory(inputValue.trim());

      if (formatted && !value.includes(formatted)) {
        onChange([...value, formatted]);
        setInputValue("");
      }
    };

    const removeTag = (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    };

    return (
      <>
        <div className="flex items-center text-black/80 text-lg bg-white gap-2 p-2 rounded-md overflow-hidden">
          <Input
            ref={ref}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (["Enter", ",", " "].includes(e.key)) {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type and press Enter"
            className={cn(
              "w-full py-6  rounded-none bg-purple-darker text-xl shadow-none focus-visible:ring-0 border-0",
              inputClass
            )}
          />
          <Button type="button" className="flex-1" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          {value.map((tag, idx) => (
            <Badge
              key={idx}
              className="hover:bg-primary cursor-pointer hover:text-white text-lg"
              variant="secondary"
            >
              {tag}
              <button
                type="button"
                className="ml-2 py-2 cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </>
    );
  }
);
