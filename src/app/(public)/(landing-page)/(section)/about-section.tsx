// components/landing/about-section.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type * as React from "react";
import { Users, Handshake, MapPin, Sparkles, ArrowRight } from "lucide-react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface AboutSectionProps {
  title?: string;
  description?: string;
  image?: string | null;
  highlights?: { title: string; description: string; icon?: IconType }[];
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  className?: string;
}

export function AboutSection({
  title = "Tentang Pemuda Magelang",
  description = "Pemuda Magelang adalah wadah untuk menghubungkan talenta di Kota Magelang—mulai dari teknologi, seni, desain, musik, film, hingga penulisan. Kami memfasilitasi kolaborasi, membangun portofolio, dan membuka akses ke program, kesempatan, serta komunitas.",
  image = "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop",
  highlights = DEFAULT_HIGHLIGHTS,
  ctaPrimary = { label: "Bergabung Sekarang", href: "/daftar" },
  ctaSecondary = { label: "Pelajari Selengkapnya", href: "/tentang" },
  className,
}: AboutSectionProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted shadow-sm block lg:hidden mb-4">
          {image ? (
            <Image
              src={image}
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
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Highlights / copy */}
        <div className="lg:col-span-7">
          <div className="mb-4">
            <Badge variant="secondary" className="rounded-full">
              Kota Magelang
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((h) => (
              <Card key={h.title} className="border-muted">
                <CardContent className="flex gap-3 p-4">
                  {h.icon ? (
                    <h.icon className="mt-0.5 h-5 w-5 text-primary" />
                  ) : null}
                  <div>
                    <h3 className="text-sm font-medium">{h.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {h.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center gap-1"
              >
                {ctaSecondary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted shadow-sm hidden lg:block">
            {image ? (
              <Image
                src={image}
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
        </div>
      </div>
    </section>
  );
}

/* ===== Defaults ===== */

const DEFAULT_HIGHLIGHTS: NonNullable<AboutSectionProps["highlights"]> = [
  {
    title: "Komunitas Talenta",
    description:
      "Jaringan lintas disiplin: teknologi, seni, desain, musik, film, dan penulisan.",
    icon: Users,
  },
  {
    title: "Kolaborasi Nyata",
    description:
      "Dari proyek komunitas hingga program kota—wadah untuk berkolaborasi.",
    icon: Handshake,
  },
  {
    title: "Fokus Kota Magelang",
    description:
      "Inisiatif lokal untuk dampak yang terasa—tumbuh dari daerah, untuk daerah.",
    icon: MapPin,
  },
  {
    title: "Portofolio & Eksposur",
    description: "Bangun profil, tampilkan karya, dan raih kesempatan baru.",
    icon: Sparkles,
  },
];
