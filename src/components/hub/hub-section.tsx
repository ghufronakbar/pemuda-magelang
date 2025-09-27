// components/hub-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HubCategorySection,
  type HubCategorySectionProps,
} from "@/components/hub/hub-cateogry-section";

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
    <section className={cn("space-y-6", className)}>
      {/* Header konsisten dengan section lain */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
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
      </div>

      {/* Daftar kategori (tiap kategori punya container sendiri dari HubCategorySection) */}
      <div className="space-y-10">
        {data.map((cat, index) => {
          const sliced: HubCategorySectionProps = {
            title: cat.title,
            items:
              typeof limitPerCategory === "number"
                ? cat.items.slice(0, limitPerCategory)
                : cat.items,
          };
          return <HubCategorySection key={cat.title + index} {...sliced} />;
        })}
      </div>

      {/* CTA mobile untuk lihat semua */}
      {viewAllHref && (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={viewAllHref}>Lihat semua</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
