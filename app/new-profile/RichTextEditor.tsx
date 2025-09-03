"use client";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/store/formStore";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface Prop {
  className?: string;
}
const RichTextEditor = ({ className }: Prop) => {
  const [value, setValue] = useState("");

  const { description, setDescription } = useFormStore();

  return (
    <div className={cn("", className)}>
      <label className="text-white/50 font-bold  mb-4">
        Description of the girl:
      </label>
      <ReactQuill
        className="bg-white border-b-0 text-base my-5 rounded-md overflow-hidden  text-black "
        theme="snow"
        value={description}
        onChange={setDescription}
        // textareaClassName="h-48"
        placeholder="Write something about you ..."
        style={{ height: "200px", fontSize: "18px" }}
      />
    </div>
  );
};

export default RichTextEditor;
