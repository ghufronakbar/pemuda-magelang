"use client";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArticleSectionProps } from "../type";
import { Filter } from "../../filter/filter";
import { ArticleGridMap } from "./article-grid-map";
import { usePagination } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

        {/* Pagination - match user management style */}
        {pager.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Menampilkan {articles.length === 0 ? 0 : pager.start + 1}
              –{Math.min(pager.end, articles.length)} dari {articles.length} artikel
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
