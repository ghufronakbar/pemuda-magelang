"use client";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArticleSectionProps } from "../type";
import { Filter } from "../../filter/filter";
import { ArticleGridMap } from "./article-grid-map";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { ARTICLE_CATEGORIES } from "@/data/article";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ArticleGridSection({
  title = "Artikel",
  description = "Wawasan dan cerita terbaru pilihan untukmu.",
  articles,
  viewAllHref,
  className,
}: ArticleSectionProps) {
  const [page, setPage] = React.useState(1);
  const pageSize = 16;
  const pager = usePagination(page, pageSize, articles.length);
  const visible = React.useMemo(() => articles.slice(pager.start, pager.end), [articles, pager.start, pager.end]);
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader className="border-b">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {viewAllHref && (
            <CardAction>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href={viewAllHref}>Lihat semua →</Link>
              </Button>
            </CardAction>
          )}
        </CardHeader>

        <CardContent>
          {!viewAllHref && (
            <Filter
              categories={ARTICLE_CATEGORIES}
              className="mb-4"
              placeholder="Cari artikel..."
              hideReset
            />
          )}
          <ArticleGridMap data={visible} />
        </CardContent>

        <Pagination
          page={pager.page}
          totalPages={pager.totalPages}
          onPageChange={setPage}
          className="mt-6"
        />

        {viewAllHref && (
          <CardFooter className="sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href={viewAllHref}>Lihat semua</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
