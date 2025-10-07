"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  GalleryCard,
  GalleryCardProps,
} from "@/components/gallery/gallery-card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { useFilter } from "../filter/filter-context";
import { useMemo, useState } from "react";
import { Filter } from "../filter/filter";
import { computeSearchScore } from "@/lib/search";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { usePagination } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface GallerySectionProps {
  title?: string;
  description?: string;
  products: GalleryCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function GallerySection({
  title = "Galeri",
  description = "Produk dari para talenta Pemuda Magelang.",
  products,
  limit,
  viewAllHref,
  className,
}: GallerySectionProps) {
  const { search, category } = useFilter();
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);
  const data = useMemo(() => {
    const filtered = products
      .map((p) => ({
        item: p,
        score: computeSearchScore(p, search, {
          title: { weight: 3, accessor: (x) => x.title },
          tags: { weight: 2, accessor: (x) => (x.tags || []).join(" ") },
          category: { weight: 1.5, accessor: (x) => x.category },
          description: { weight: 1, accessor: (x) => x.description },
          author: { weight: 0.8, accessor: (x) => [x.author.name, x.author.profession] },
        }),
      }))
      .filter(({ score }) => (search ? score > 0 : true))
      .filter(({ item }) =>
        item.category.toLowerCase().includes(category.toLowerCase())
      )
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
    return filtered;
  }, [products, search, category]);
  const [page, setPage] = useState(1);
  const pageSize = 16;
  const pager = usePagination(page, pageSize, data.length);
  const visible = useMemo(() => data.slice(pager.start, pager.end), [data, pager.start, pager.end]);

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader className="border-b">
          <Reveal animation="fade-up">
            <div>
              <CardTitle className="text-2xl sm:text-3xl tracking-tight">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
            </div>
          </Reveal>

          {viewAllHref && (
            <CardAction>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href={viewAllHref}>Lihat semua →</Link>
              </Button>
            </CardAction>
          )}
        </CardHeader>

        <CardContent>
          <Reveal animation="fade-up" delayMs={80}>
            <Filter
              categories={categories}
              className="mb-4"
              placeholder="Cari produk..."
              hideReset
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch content-stretch">
            {visible.map((p, i) => (
              <Reveal key={p.slug} animation="fade-up" delayMs={i * 80}>
                <div className="h-full">
                  <GalleryCard {...p} />
                </div>
              </Reveal>
            ))}
          </div>
          {/* Pagination - match user management style */}
          {pager.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {data.length === 0 ? 0 : pager.start + 1}
                –{Math.min(pager.end, data.length)} dari {data.length} produk
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
          {visible.length === 0 && (
            <div className="mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border py-12 text-center">
              <div className="text-2xl">🔎</div>
              <p className="text-sm text-muted-foreground">Tidak ada produk yang cocok dengan pencarian</p>
            </div>
          )}
        </CardContent>

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
