"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileStore } from "@/store/fileStore";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface Prop {
  className?: string;
  form: any;
}
const PhotoVideoUploads = ({ form, className }: Prop) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = useFileStore((s) => s.files);
  const removeFile = useFileStore((s) => s.removeFile);
  const addFiles = useFileStore((s) => s.addFiles);

  const [fileErrors, setFileErrors] = useState<string[]>([]);

  console.log("files from zustand", files);

  const MAX_IMAGE_SIZE_MB = 1;
  const MAX_VIDEO_SIZE_MB = 128;

  // const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     console.log("files selected", e.target.files);
  //     addFiles(Array.from(e.target.files));
  //   }
  // };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileErrors([]); // Clear previous errors

    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      const sizeMB = file.size / (1024 * 1024);
      const type = file.type;

      if (type.startsWith("image/")) {
        if (sizeMB > MAX_IMAGE_SIZE_MB) {
          errors.push(
            `${
              file.name
            } is too big. Max image size is ${MAX_IMAGE_SIZE_MB} MB. Uploaded: ${sizeMB.toFixed(
              2
            )} MB.`
          );
          return;
        }
      } else if (type.startsWith("video/")) {
        if (sizeMB > MAX_VIDEO_SIZE_MB) {
          errors.push(
            `${
              file.name
            } is too big. Max video size is ${MAX_VIDEO_SIZE_MB} MB. Uploaded: ${sizeMB.toFixed(
              2
            )} MB.`
          );
          return;
        }
      } else {
        errors.push(`${file.name} is not a supported file type.`);
        return;
      }

      validFiles.push(file);
    });

    setFileErrors(errors); // ✅ Store errors in state

    if (validFiles.length > 0) {
      addFiles(validFiles); // ✅ Store valid files in Zustand
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
      <div className="p-8 gap-6 lg:gap-0 flex flex-col lg:flex-row border-2 rounded-lg border-dashed">
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
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-primary cursor-pointer uppercase  font-semibold rounded-full"
          >
            upload a photo or video
          </Button>
        </div>

        <div className="flex flex-col gap-3">
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

          {fileErrors.length > 0 && (
            <ul className="text-red-500 text-sm mt-2 space-y-1">
              {fileErrors.map((err, idx) => (
                <li
                  className="mx-4 bg-red-200 text-center border border-primary p-6 text-primary"
                  key={idx}
                >
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* display error */}
      </div>
    </div>
  );
};

export default PhotoVideoUploads;
