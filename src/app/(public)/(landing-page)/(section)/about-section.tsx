"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AboutItem } from "@prisma/client";
import { iconEnum } from "@/enum/icon-enum";
import { useSession } from "next-auth/react";
import { CdnImage } from "@/components/custom/cdn-image";

export interface AboutSectionProps {
  title?: string;
  description?: string;
  image?: string | null;
  highlights?: Omit<
    AboutItem,
    "id" | "createdAt" | "updatedAt" | "appDataId"
  >[];
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  className?: string;
}

export function AboutSection({
  title = "Tentang Pemuda Magelang",
  description = "Pemuda Magelang adalah wadah untuk menghubungkan talenta di Kota Magelang—mulai dari teknologi, seni, desain, musik, film, hingga penulisan. Kami memfasilitasi kolaborasi, membangun portofolio, dan membuka akses ke program, kesempatan, serta komunitas.",
  image = "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop",
  highlights = DEFAULT_HIGHLIGHTS,
  ctaPrimary = { label: "Bergabung Sekarang", href: "/register" },
  className,
}: AboutSectionProps) {
  const { data: session } = useSession();
  const isAuthed = !!session;
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      id="about"
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-muted/50 shadow-sm backdrop-blur block lg:hidden mb-4">
          {image ? (
            <CdnImage
              uniqueKey={image}
              alt="Pemuda Magelang"
              fill
              sizes="(max-width:1024px) 100vw, 40vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              Tambahkan gambar…
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
        </div>
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 sm:mt-3 max-w-3xl text-base text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-12">
        {/* Highlights / copy */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            {highlights.map((h, index) => (
              <Card key={index} className="border-muted/60">
                <CardContent className="flex gap-3 p-4 sm:p-5">
                  {h.icon
                    ? iconEnum.getIcon(h.icon, "mt-0.5 h-5 w-5 text-primary")
                    : null}
                  <div>
                    <h3 className="text-sm font-medium leading-6">{h.key}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-6">
                      {h.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthed ? null : (
              <Button asChild size="lg" className="w-full sm:w-auto shadow-sm">
                <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-muted/50 shadow-sm backdrop-blur hidden lg:block">
            {image ? (
              <CdnImage
                uniqueKey={image}
                alt="Pemuda Magelang"
                fill
                sizes="(max-width:1024px) 100vw, 40vw"
                className="object-cover"
                priority={false}
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Tambahkan gambar…
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/5 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== Defaults ===== */

const DEFAULT_HIGHLIGHTS: NonNullable<AboutSectionProps["highlights"]> = [
  {
    key: "Komunitas Talenta",
    value:
      "Jaringan lintas disiplin: teknologi, seni, desain, musik, film, dan penulisan.",
    icon: "users",
  },
  {
    key: "Kolaborasi Nyata",
    value:
      "Dari proyek komunitas hingga program kota—wadah untuk berkolaborasi.",
    icon: "handshake",
  },
  {
    key: "Fokus Kota Magelang",
    value:
      "Inisiatif lokal untuk dampak yang terasa—tumbuh dari daerah, untuk daerah.",
    icon: "mapPin",
  },
  {
    key: "Portofolio & Eksposur",
    value: "Bangun profil, tampilkan karya, dan raih kesempatan baru.",
    icon: "sparkles",
  },
];
