// // app/components/ClientPaginationWrapper.tsx
// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { AppPagination } from "@/components/AppPagination";

// interface ClientPaginationWrapperProps {
//   totalPages: number;
//   currentPage: number;
// }

// export function ClientPaginationWrapper({
//   totalPages,
//   currentPage,
// }: ClientPaginationWrapperProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const handlePageChange = (page: number) => {
//     // Create new URL with updated page parameter
//     const params = new URLSearchParams(searchParams.toString());
//     params.set("page", page.toString());

//     // Navigate to new URL
//     router.push(`?${params.toString()}`);

//     // Optional: Scroll to top
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <AppPagination
//       totalPages={totalPages}
//       currentPage={currentPage}
//       onPageChange={handlePageChange}
//       className="mt-12"
//     />
//   );
// }

// app/components/ClientPaginationWrapper.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AppPagination } from "@/components/AppPagination";

interface ClientPaginationWrapperProps {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number; // Add this prop
  itemsCount?: number; // Optional: current page items count
  className?: string;
}

export function ClientPaginationWrapper({
  totalPages,
  currentPage,
  totalItems,
  itemsPerPage,
  itemsCount,
  className,
}: ClientPaginationWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Don't show pagination if:
  // 1. Only one page OR
  // 2. Total items less than or equal to items per page
  const shouldShowPagination = totalPages > 1 && totalItems > itemsPerPage;

  // Optional: Also check if current page has items
  const hasItems = itemsCount ? itemsCount > 0 : true;

  if (!shouldShowPagination || !hasItems) {
    return null;
  }

  const handlePageChange = (page: number) => {
    // Create new URL with updated page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    // Navigate to new URL
    router.push(`?${params.toString()}`);

    // Optional: Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppPagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      className={className}
    />
  );
}
