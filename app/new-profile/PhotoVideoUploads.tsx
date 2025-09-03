"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileStore } from "@/store/fileStore";
import Image from "next/image";
import React, { useRef } from "react";

interface Prop {
  className?: string;
  form: any;
}
const PhotoVideoUploads = ({ form, className }: Prop) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = useFileStore((s) => s.files);
  const removeFile = useFileStore((s) => s.removeFile);
  const addFiles = useFileStore((s) => s.addFiles);

  console.log("files from zustand", files);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log("files selected", e.target.files);
      addFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className={cn("mt-12  w-full", className)}>
      <h5 className="text-lg font-semibold">
        Upload your photos and now also videos{" "}
        <span className="text-primary">
          (New – you can now upload your videos too!)
        </span>
      </h5>
      <div className="p-8 flex border-2 rounded-lg border-dashed">
        {/* section 1 */}
        <div className="flex flex-col">
          <span className="text-sm">
            Upload one or more files to the gallery
          </span>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleSelect}
          />

          <Button
            onClick={() => inputRef.current?.click()}
            className="bg-primary cursor-pointer uppercase  font-semibold rounded-full"
          >
            upload a photo or video
          </Button>
        </div>

        {/* section 2- display file thumbnails */}
        <div className="flex-1  border-blue-600 flex flex-wrap gap-4 ml-10">
          {files.map(({ id, name, type, previewUrl }) => (
            <div
              key={id}
              className="relative overflow-hidden  h-[200px] w-[200px]  p-2 rounded-lg shadow"
            >
              {type === "image" && previewUrl && (
                <Image
                  src={previewUrl}
                  alt={name}
                  className=" object-cover rounded"
                  quality={100}
                  fill
                />
              )}
              {type === "video" && previewUrl && (
                <video
                  src={previewUrl}
                  // controls
                  className="w-full absolute h-full object-cover overflow-hidden rounded-lg"
                />
              )}
              {type === "file" && (
                <div className="h-32 flex items-center justify-center bg-gray-100 text-sm text-gray-600">
                  {name}
                </div>
              )}
              <button
                onClick={() => removeFile(id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full size-7 cursor-pointer text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoVideoUploads;
