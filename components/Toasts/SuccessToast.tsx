import { cn } from "@/lib/utils";
import React from "react";

interface Prop {
  className?: string;
  message?: string;
}
const SuccessToast = ({
  className,
  message = "Operation suceesful.",
}: Prop) => {
  return (
    <div
      className={cn(
        "bg-primary p-6 py-8 text-white flex items-center gap-3",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-8 flex-shrink-0 text-primary"
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>

      <p className="text-base">{message}</p>
    </div>
  );
};

export default SuccessToast;
