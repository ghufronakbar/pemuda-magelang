"use client";
// components/hub-category-section.tsx
import * as React from "react";
import { HubCard, type HubCardProps } from "@/components/hub/hub-card";
import { Pagination, usePagination } from "@/components/ui/pagination";

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

      <Pagination
        page={pager.page}
        totalPages={pager.totalPages}
        onPageChange={setPage}
        className="mt-6"
      />
    </section>
  );
}
