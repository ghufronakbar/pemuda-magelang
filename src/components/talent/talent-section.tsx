// components/talent-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TalentCard, type TalentCardProps } from "@/components/talent/talent-card";

export interface TalentSectionProps {
  title?: string;
  description?: string;
  talents?: TalentCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function TalentSection({
  title = "Talenta",
  description = "Temukan profil kreator dan profesional pilihan.",
  talents,
  limit,
  viewAllHref,
  className,
}: TalentSectionProps) {
  const data = (talents?.length ? talents : DUMMY_TALENTS).slice(
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
          <TalentCard key={t.slug} {...t} />
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

/* ================= Dummy Data ================= */

const DUMMY_TALENTS: TalentCardProps[] = [
  {
    name: "Alya Putri",
    profileImage: null,
    bannerImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    slug: "/talenta/alya-putri",
    profession: "Product Designer",
    industry: "Design",
  },
  {
    name: "Bima Ardiansyah",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
    bannerImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    slug: "/talenta/bima-ardiansyah",
    profession: "Software Engineer",
    industry: "Technology",
  },
  {
    name: "Rani Pramudita",
    profileImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
    bannerImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    slug: "/talenta/rani-pramudita",
    profession: "Music Producer",
    industry: "Music",
  },
  {
    name: "Dimas Arief",
    profileImage:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop",
    bannerImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    slug: "/talenta/dimas-arief",
    profession: "Product Manager",
    industry: "Technology",
  },
  {
    name: "Nadia Anindya",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
    bannerImage:
      "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
    slug: "/talenta/nadia-anindya",
    profession: "Art Director",
    industry: "Art",
  },
  {
    name: "Raka Wijaya",
    profileImage:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop",
    bannerImage:
      "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=1200&auto=format&fit=crop",
    slug: "/talenta/raka-wijaya",
    profession: "Cinematographer",
    industry: "Film",
  },
];
