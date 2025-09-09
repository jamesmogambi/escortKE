"use client";
import { cn } from "@/lib/utils";
import { useFileStore } from "@/store/fileStore";
import { useFormStore } from "@/store/formStore";
import React, { useEffect, useRef, useState } from "react";

interface Prop {
  className?: string;
  form?: any;
}

// TODO:// HOOK TO GLOBAL STORE
const PreviewPhoto = ({ className, form }: Prop) => {
  // const [preview, setPreview] = useState<string | null>const preview = files?.[0] ? URL.createObjectURL(files[0]) : "No file selected";
  null;
  const { watch, setValue } = form;
  const { setFiles, files } = useFormStore();
  // const preview = files?.[0]
  //   ? URL.createObjectURL(files[0])
  //   : "No file selected";
  const preview =
    files && files.length > 0
      ? URL.createObjectURL(files.item(0)!)
      : "No file selected";

  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   return () => {
  //     if (files?.[0]) URL.revokeObjectURL(URL.createObjectURL(files[0]));
  //   };
  // }, [files]);

  // const photoFile = watch("photo");

  // useEffect(() => {
  //   if (photoFile && photoFile.length > 0) {
  //     const file = photoFile[0];
  //     setValue(file);
  //     const objectUrl = URL.createObjectURL(file);
  //     setPreview(objectUrl);

  //     return () => URL.revokeObjectURL(objectUrl); // Clean up
  //   }
  // }, [photoFile]);

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: any) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles); // ✅ Store the files
      // setValue("photo", selectedFiles); // Optional: still update form
    }
  };

  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
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
        onChange={handleChange}
      />

      <div
        onClick={triggerFileSelect}
        className="border flex-1 overflow-hidden cursor-pointer flex rounded-full border-primary"
      >
        <span className="w-2/3  py-3 pl-3 flex items-center text-nowrap  h-12 text-lg text-white/30">
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
