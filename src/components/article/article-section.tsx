// components/article-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArticleCard,
  type ArticleCardProps,
} from "@/components/article/article-card";

export interface ArticleSectionProps {
  title?: string;
  description?: string;
  articles: ArticleCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function ArticleSection({
  title = "Artikel",
  description = "Wawasan dan cerita terbaru pilihan untukmu.",
  articles,
  limit,
  viewAllHref,
  className,
}: ArticleSectionProps) {
  const data = articles.slice(0, typeof limit === "number" ? limit : undefined);

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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((a) => (
          <ArticleCard key={a.slug} {...a} />
        ))}
      </div>

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
