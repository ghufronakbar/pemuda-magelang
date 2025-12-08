// components/hub-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HubCategorySection,
  type HubCategorySectionProps,
} from "@/components/hub/hub-cateogry-section";
import { Reveal } from "@/components/ui/reveal";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardAction,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export interface HubSectionProps {
  title?: string;
  description?: string;
  /** Array kategori berisi item HubCardProps[] */
  categories: HubCategorySectionProps[];
  /** Batasi jumlah item per kategori (opsional) */
  limitPerCategory?: number;
  /** Tautan "Lihat semua" (opsional) */
  viewAllHref?: string;
  className?: string;
}

export function HubSection({
  title = "Zhub Program",
  description = "Kumpulan program dukungan dan inisiatif untuk ekosistem kebudayaan.",
  categories,
  limitPerCategory,
  viewAllHref,
  className,
}: HubSectionProps) {
  const data = categories;

  return (
    <section className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <Card className="bg-card/50 backdrop-blur">
        <CardHeader className="border-b">
          <Reveal>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-semibold">{title}</CardTitle>
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
          <div className="space-y-10">
            {data.map((cat, index) => {
              const sliced: HubCategorySectionProps = {
                title: cat.title,
                items:
                  typeof limitPerCategory === "number"
                    ? cat.items.slice(0, limitPerCategory)
                    : cat.items,
              };
              return (
                <Reveal key={cat.title + index} delayMs={index * 80}>
                  <HubCategorySection {...sliced} />
                </Reveal>
              );
            })}
          </div>
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
