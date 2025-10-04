"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  GalleryCard,
  GalleryCardProps,
} from "@/components/gallery/gallery-card";
import { Button } from "@/components/ui/button";
import { useFilter } from "../filter/filter-context";
import { useMemo } from "react";
import { Filter } from "../filter/filter";

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
  viewAllHref,
  className,
}: GallerySectionProps) {
  const { search, category } = useFilter();
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);
  const data = useMemo(() => {
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        p.category.toLowerCase().includes(category.toLowerCase())
    );
  }, [products, search, category]);

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {viewAllHref && (
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={viewAllHref}>Lihat semua →</Link>
          </Button>
        )}
      </div>

      <Filter
        categories={categories}
        className="mb-4"
        placeholder="Cari produk..."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => (
          <GalleryCard key={p.slug} {...p} />
        ))}
      </div>
      {data.length === 0 && (
        <div className="flex flex-col gap-5 max-w-4xl mx-auto h-40 items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            Tidak ada produk yang cocok dengan pencarian
          </p>
        </div>
      )}

      {viewAllHref && (
        <div className="mt-6 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={viewAllHref}>Lihat semua</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
