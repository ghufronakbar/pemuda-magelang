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
import { useMemo } from "react";
import { Filter } from "../filter/filter";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        p.category.toLowerCase().includes(category.toLowerCase())
    );
  }, [products, search, category]);
  const visible = useMemo(() => {
    return typeof limit === "number" && limit > 0 ? data.slice(0, limit) : data;
  }, [data, limit]);

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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((p, i) => (
              <Reveal key={p.slug} animation="fade-up" delayMs={i * 80}>
                <GalleryCard {...p} />
              </Reveal>
            ))}
          </div>
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
