"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Hub, HubCategory, HubStatusEnum } from "@prisma/client";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { formatIDDate } from "@/lib/helper";
import { Reveal } from "@/components/ui/reveal";
import { CdnImage } from "@/components/custom/cdn-image";

interface ZHubDetailProps {
  hub: Hub & {
    hubCategory: HubCategory & {
      hubs: Hub[];
    };
  };
  className?: string;
}

export function ZHubDetail({ hub, className }: ZHubDetailProps) {
  const {
    slug,
    name, // asumsi: kolom nama program
    description, // string (boleh panjang)
    image, // url banner/cover
    status, // "active" | "inactive" | "soon"
    hubCategory,
    createdAt,
    ctaLink,
  } = hub;
  const { hubs } = hubCategory;
  // Program lain (yang sama kategori) selain yang sedang dibuka
  const related = (hubs ?? []).filter((h) => h.slug !== slug);

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* ===== Header (Banner + Basic Info) ===== */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border bg-card">
        {/* Banner */}
        <Reveal>
          <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-72">
            <CdnImage
              uniqueKey={image || PLACEHOLDER_IMAGE}
              alt={name}
              fill
              sizes="(max-width:1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/10 to-transparent" />
          </div>
        </Reveal>

        {/* Basic Info */}
        <div className="px-4 pb-6 pt-5 sm:px-6 sm:pb-6 sm:pt-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Reveal>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {hubCategory?.name ?? "Tanpa Kategori"}
                  </Badge>
                  <StatusBadge status={status} />
                </div>
              </Reveal>
              <Reveal delayMs={60}>
                <h1 className="truncate text-2xl font-bold leading-tight sm:text-3xl">
                  {name}
                </h1>
                <span className="text-sm text-muted-foreground">
                  Dibuat pada {formatIDDate(createdAt)}
                </span>
              </Reveal>
            </div>

            {/* CTA opsional — arahkan ke program eksternal */}
            <div className="shrink-0 flex flex-col gap-2">
              {ctaLink && status === HubStatusEnum.active && (
                <Button asChild size="lg">
                  <Link href={ctaLink} target="_blank">
                    Cek Program Sekarang
                  </Link>
                </Button>
              )}
            </div>
          </div>
          {/* Description moved into top card */}
          {description && (
            <Reveal delayMs={80}>
              <div className="mt-5">
                <Separator className="my-4" />
                <div className="prose prose-neutral text-sm">
                  <p className="whitespace-pre-wrap">{description}</p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* ===== Program lain dalam kategori ini ===== */}
      {related.length > 0 && (
        <section>
          <Card>
            <CardHeader className="pb-0">
              <div className="mb-3 flex items-end justify-between gap-4">
                <CardTitle className="text-lg sm:text-xl">
                  Program lain di kategori {hubCategory?.name}
                </CardTitle>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden sm:inline-flex"
                >
                  <Link
                    href={`/zhub?kategori=${encodeURIComponent(
                      hubCategory?.name ?? ""
                    )}`}
                  >
                    Lihat semua →
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) => (
                  <Reveal key={r.id} delayMs={i * 80}>
                    <Link href={`/zhub/${r.slug}`} className="group">
                      <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="relative aspect-[16/9] w-full bg-muted">
                          <CdnImage
                            uniqueKey={r.image ?? PLACEHOLDER_IMAGE}
                            alt={r.name}
                            fill
                            sizes="(max-width:1024px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="space-y-1 p-4">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={r.status} size="sm" />
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {hubCategory?.name}
                            </span>
                          </div>
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                            {r.name}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  </Reveal>
                ))}
              </div>

              <div className="mt-6 sm:hidden">
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href={`/zhub?kategori=${encodeURIComponent(
                      hubCategory?.name ?? ""
                    )}`}
                  >
                    Lihat semua
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </section>
  );
}

/* ============ Subcomponent: Status Badge ============ */

function StatusBadge({
  status,
  size = "md",
}: {
  status: "active" | "inactive" | "soon";
  size?: "sm" | "md";
}) {
  const base = "rounded-full border px-2.5 py-0.5 text-xs font-medium";
  const sm = "px-2 py-0 text-[10px]";
  const map: Record<typeof status, string> = {
    active: "border-green-500/30 bg-green-500/10 text-green-600",
    soon: "border-amber-500/30 bg-amber-500/10 text-amber-600",
    inactive: "border-neutral-500/30 bg-neutral-500/10 text-neutral-600",
  };
  return (
    <span className={cn(base, size === "sm" && sm, map[status])}>
      {status === "active"
        ? "Aktif"
        : status === "soon"
        ? "Segera"
        : "Nonaktif"}
    </span>
  );
}
