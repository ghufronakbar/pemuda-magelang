import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArticleSectionProps } from "../type";
import { Filter } from "../../filter/filter";
import { ArticleListMap } from "./article-list-map";
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

export function ArticleListSection({
  title = "Artikel",
  description = "Wawasan dan cerita terbaru pilihan untukmu.",
  articles,
  viewAllHref,
  className,
}: ArticleSectionProps) {
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
            <Filter categories={ARTICLE_CATEGORIES} hideReset />
          )}
          <ArticleListMap data={articles} />
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
