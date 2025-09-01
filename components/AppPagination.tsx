"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";

interface AppPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AppPagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: AppPaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination className={cn("mt-12 mb-6", className)}>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "hidden"
                : "bg-transparent border rounded-none border-pink-500 text-lg font-bold hover:bg-transparent hover:text-primary cursor-pointer text-primary"
            }
          />
        </PaginationItem>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis className="bg-transparent border rounded-none text-stone-500 border-pink-500 " />
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(Number(page))}
                className={cn(
                  "border-pink-500 border text-lg focus:bg-green-500 rounded-none cursor-pointer hover:bg-transparent hover:text-primary text-primary ",
                  page === currentPage &&
                    "bg-primary text-white border-none rounded-sm hover:text-white  p-7 text-2xl hover:bg-primary cursor-default"
                )}
                // className="border-pink-500 border text-lg focus:bg-green-500 rounded-none cursor-pointer hover:bg-transparent hover:text-primary text-primary"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={
              currentPage === totalPages
                ? "hidden"
                : "bg-transparent border rounded-none border-pink-500 text-lg font-bold hover:bg-transparent hover:text-primary cursor-pointer text-primary"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// Helper to create page numbers with ellipsis
function getVisiblePages(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return range;
}
