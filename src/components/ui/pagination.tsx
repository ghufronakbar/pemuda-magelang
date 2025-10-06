"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  start: number;
  end: number;
}

export function usePagination(
  page: number,
  pageSize: number,
  total: number
): UsePaginationResult {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), totalPages);
  const start = (clamped - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  return { page: clamped, pageSize, total, totalPages, start, end };
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  className?: string;
}) {
  const go = (p: number) => () => onPageChange(Math.min(Math.max(1, p), totalPages));

  // Modern, minimal: prev/next + compact numbers around current
  const windowSize = 1; // show 1 on each side
  const pages: number[] = [];
  for (let i = Math.max(1, page - windowSize); i <= Math.min(totalPages, page + windowSize); i++) {
    pages.push(i);
  }

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Pagination">
      <button
        type="button"
        onClick={go(page - 1)}
        disabled={page <= 1}
        className={cn(
          "inline-flex h-9 items-center rounded-full border px-3 text-sm",
          "bg-white text-primary border-primary hover:bg-primary hover:text-white transition-colors",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        Sebelumnya
      </button>

      {pages[0] > 1 && (
        <>
          <button
            type="button"
            onClick={go(1)}
            className="inline-flex h-9 items-center rounded-full border px-3 text-sm bg-white text-primary border-primary hover:bg-primary hover:text-white transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && <span className="px-1 text-neutral-400">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={go(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center rounded-full border px-3 text-sm transition-colors",
            p === page
              ? "bg-primary text-white border-primary"
              : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
          )}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-neutral-400">…</span>
          )}
          <button
            type="button"
            onClick={go(totalPages)}
            className="inline-flex h-9 items-center rounded-full border px-3 text-sm bg-white text-primary border-primary hover:bg-primary hover:text-white transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={go(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          "inline-flex h-9 items-center rounded-full border px-3 text-sm",
          "bg-white text-primary border-primary hover:bg-primary hover:text-white transition-colors",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        Berikutnya
      </button>
    </nav>
  );
}


