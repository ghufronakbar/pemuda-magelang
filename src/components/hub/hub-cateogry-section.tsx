"use client";
// components/hub-category-section.tsx
import * as React from "react";
import { HubCard, type HubCardProps } from "@/components/hub/hub-card";
import { usePagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HubCategorySectionProps {
  title: string;
  items: HubCardProps[];
}

export function HubCategorySection({ title, items }: HubCategorySectionProps) {
  const data = items?.length ? items : [];
  const [page, setPage] = React.useState(1);
  const pageSize = 16;
  const pager = usePagination(page, pageSize, data.length);
  const visible = React.useMemo(() => data.slice(pager.start, pager.end), [data, pager.start, pager.end]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((hub, index) => (
            <HubCard key={hub.slug + index} {...hub} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Belum ada program dalam kategori ini.
        </p>
      )}

      {/* Pagination - match user management style */}
      {pager.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {data.length === 0 ? 0 : pager.start + 1}
            –{Math.min(pager.end, data.length)} dari {data.length} program
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={pager.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pager.totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (pager.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pager.page <= 3) {
                  pageNum = i + 1;
                } else if (pager.page >= pager.totalPages - 2) {
                  pageNum = pager.totalPages - 4 + i;
                } else {
                  pageNum = pager.page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pager.page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, pager.totalPages))}
              disabled={pager.page === pager.totalPages}
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
