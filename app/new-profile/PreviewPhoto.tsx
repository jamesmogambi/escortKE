"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
interface Prop {
  className?: string;
  form?: any;
}
const PreviewPhoto = ({ className, form }: Prop) => {
  const [preview, setPreview] = useState<string | null>(null);
  const url = "husbjbjsbdjsbdsj";
  const { watch, setValue } = form;

  const inputRef = useRef<HTMLInputElement>(null);

  const photoFile = watch("photo");

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Clean up
    }
  }, [photoFile]);

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <label className=" text-base font-bold text-white/50 ">
        Preview Photo:
      </label>
      {/* Hidden native input */}
      <input
        type="file"
        accept="image/*"
        // {...register("photo")}
        ref={inputRef}
        className="hidden"
        onChange={(e) => setValue("photo", e.target.files as FileList)}
      />

      <div
        onClick={triggerFileSelect}
        className="border flex-1 overflow-hidden cursor-pointer flex rounded-full border-primary"
      >
        <span className="w-2/3 py-3 flex items-center text-nowrap  h-12 text-lg text-white/30">
          {preview}
        </span>
        <span className="flex-1 bg-primary justify-center items-center flex font-bold text-white uppercase  text-center text-xl">
          insert
        </span>
      </div>
    </div>
  );
};

export default PreviewPhoto;
