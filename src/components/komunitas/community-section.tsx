// components/talent-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CommunityCard, CommunityCardProps } from "./community-card";

export interface CommunitySectionProps {
  title?: string;
  description?: string;
  communities: CommunityCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function CommunitySection({
  title = "Komunitas",
  description = "Temukan komunitas dan bergabung bersama.",
  communities,
  limit,
  viewAllHref,
  className,
}: CommunitySectionProps) {
  const data = communities.slice(
    0,
    typeof limit === "number" ? limit : undefined
  );

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
        {data.map((t) => (
          <CommunityCard key={t.slug} {...t} />
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
