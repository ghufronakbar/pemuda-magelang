// components/landing/articles/article-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ArticleCard,
  type ArticleCardProps,
} from "@/components/article/article-card";

export interface ArticleLandingSectionProps {
  title?: string;
  description?: string;
  articles: ArticleCardProps[]; // assumed unsorted
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function ArticleSectionLanding({
  title = "Artikel Terbaru",
  description = "Wawasan dan cerita terkini dari komunitas Pemuda Magelang.",
  articles,
  limit,
  viewAllHref = "/artikel",
  className,
}: ArticleLandingSectionProps) {
  const data = articles.slice(0, typeof limit === "number" ? limit : undefined);

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* decorative bg lembut */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 rounded-full">
              Artikel
            </Badge>
            <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={viewAllHref}>Lihat semua →</Link>
            </Button>
          )}
        </div>

        {/* Carousel horizontal (landing-friendly) */}
        <ScrollArea className="-mx-4">
          <div className="flex gap-4 px-4 py-2">
            {data.map((a, index) => (
              <ArticleCard {...a} className="w-[300px] sm:w-[360px] h-full" key={index} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* CTA mobile */}
        {viewAllHref && (
          <div className="mt-6 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={viewAllHref}>Lihat semua</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
