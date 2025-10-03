// components/landing/branding-section.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface BrandingSectionProps {
  title: string;
  url: string | null; // URL YouTube: watch?v=..., youtu.be/..., atau shorts/...
  description?: string; // opsional: teks di sisi kanan
  className?: string;
  ctaHref?: string; // opsional
  ctaLabel?: string; // opsional
}

export function BrandingSection({
  title,
  url,
  description = "Pemuda Magelang adalah wadah kolaborasi talenta—temukan komunitas, bangun portofolio, dan bertumbuh bersama lewat program dan kegiatan yang relevan.",
  ctaHref,
  ctaLabel = "Pelajari Selengkapnya",
  className,
}: BrandingSectionProps) {
  const src = React.useMemo(() => toYouTubeEmbed(url || ""), [url]);

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* White container with split layout */}
      <div className="relative overflow-visible rounded-2xl border bg-primary shadow-sm">
        <div className="grid grid-cols-1 items-center gap-6 p-4 sm:p-6 lg:grid-cols-12 lg:gap-8 lg:p-8">
          {/* Left: Video (sticks out to the left on larger screens) */}
          <div className="lg:col-span-7">
            <div
              className={cn(
                "relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow"
                // sengaja keluar kiri: kecil di sm, lebih besar di lg
                // "-ml-2 sm:-ml-4 lg:-ml-16"
              )}
            >
              {src && (
                <iframe
                  title={title}
                  src={src}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Right: Text */}
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold sm:text-3xl text-white">{title}</h3>
              <p className="text-sm text-white">{description}</p>
              {ctaHref && (
                <div className="pt-2">
                  <Button asChild size="lg">
                    <Link href={ctaHref}>{ctaLabel}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */
function toYouTubeEmbed(input: string): string | null {
  try {
    const u = new URL(input);
    const host = u.hostname.replace(/^www\./, "");
    const t = u.searchParams.get("t") || u.searchParams.get("start");
    const start = t ? parseYouTubeStart(t) : null;

    let id: string | null = null;

    if (host.endsWith("youtube.com")) {
      const shorts = u.pathname.match(/\/shorts\/([^/?#]+)/)?.[1];
      id = shorts || u.searchParams.get("v");
    } else if (host.endsWith("youtu.be")) {
      id = u.pathname.replace(/^\//, "").split(/[/?#]/)[0] || null;
    }

    if (!id) return null;

    const base = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      id
    )}`;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      color: "white",
      iv_load_policy: "3",
      playsinline: "1",
    });
    if (start && start > 0) params.set("start", String(start));
    return `${base}?${params.toString()}`;
  } catch {
    return null;
  }
}

function parseYouTubeStart(v: string): number {
  if (/^\d+$/.test(v)) return parseInt(v, 10);
  const m = v.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!m) return 0;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  return h * 3600 + min * 60 + s;
}
