// components/landing/partners/partner-section.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* --- Types --- */
export interface PartnerItem {
  image: string;
  name: string;
  href: string;
}

export interface PartnerSectionProps {
  supportedPartners: PartnerItem[];
  collaborators: PartnerItem[];
  mediaPartners: PartnerItem[];
  title?: string;
  description?: string;
  className?: string;
  /** durasi animasi per baris (detik) */
  speedSeconds?: { supported?: number; collaborators?: number; media?: number };
}

export function PartnerSection({
  supportedPartners,
  collaborators,
  mediaPartners,
  title = "Mitra & Pendukung",
  description = "Honorable mention untuk pihak yang mendukung Pemuda Magelang.",
  className,
  speedSeconds,
}: PartnerSectionProps) {
  const hasAny =
    supportedPartners.length || collaborators.length || mediaPartners.length;
  if (!hasAny) return null;

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* dekorasi lembut */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header center */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          {description && (
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          {supportedPartners.length > 0 && (
            <Row
              label="Didukung oleh"
              items={supportedPartners}
              durationSec={speedSeconds?.supported ?? 26}
              direction="left"
            />
          )}

          {collaborators.length > 0 && (
            <Row
              label="Kolaborator"
              items={collaborators}
              durationSec={speedSeconds?.collaborators ?? 30}
              direction="right"
            />
          )}

          {mediaPartners.length > 0 && (
            <Row
              label="Media Partner"
              items={mediaPartners}
              durationSec={speedSeconds?.media ?? 28}
              direction="left"
            />
          )}
        </div>
      </div>

      {/* Keyframes global agar aman di seluruh subtree */}
      <style jsx global>{`
        @keyframes pm-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .pm-marquee {
          animation: pm-marquee var(--pm-duration, 30s) linear infinite;
          will-change: transform;
        }
        .pm-marquee.reverse {
          animation-direction: reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .pm-marquee {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ---------- Row (center label + marquee track) ---------- */

function Row({
  label,
  items,
  durationSec,
  direction,
}: {
  label: string;
  items: PartnerItem[];
  durationSec: number;
  direction: "left" | "right";
}) {
  // Gandakan konten agar transisi ujung-ke-ujung mulus.
  const doubled = [...items, ...items];

  return (
    <div className="space-y-3">
      <div className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>

      <div
        className="group relative overflow-hidden rounded-xl border bg-background/70 py-3 backdrop-blur"
        // fade kiri-kanan
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
        onMouseEnter={(e) => toggleAnim(e.currentTarget, /*run*/ false)}
        onMouseLeave={(e) => toggleAnim(e.currentTarget, /*run*/ true)}
      >
        {/* Track: gunakan width max-content + konten digandakan + translateX(-50%) */}
        <div
          className={cn(
            "pm-marquee flex w-max items-center gap-8 pr-8",
            direction === "right" && "reverse"
          )}
          style={
            {
              // var CSS buat ubah durasi
              "--pm-duration": `${durationSec}s`,
            } as React.CSSProperties
          }
        >
          {doubled.map((p, i) => (
            <Logo key={`${p.name}-${i}`} item={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Logo item ---------- */

function Logo({ item }: { item: PartnerItem }) {
  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex shrink-0 items-center gap-3"
      aria-label={item.name}
      title={item.name}
    >
      <div className="relative h-10 w-24 sm:h-12 sm:w-28">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width:768px) 96px, 112px"
          className="object-contain opacity-80 transition-opacity group-hover/link:opacity-100"
        />
      </div>
      <span className="hidden text-sm text-muted-foreground sm:inline-block">
        {item.name}
      </span>
    </Link>
  );
}

/* ---------- utils ---------- */
function toggleAnim(container: HTMLElement, run: boolean) {
  container
    .querySelectorAll<HTMLElement>(".pm-marquee")
    .forEach(
      (el) => (el.style.animationPlayState = run ? "running" : "paused")
    );
}
