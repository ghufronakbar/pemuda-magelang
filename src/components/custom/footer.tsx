"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { LOGO } from "@/constants";
import { AppSocialMedia } from "@prisma/client";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";

export interface FooterProps {
  className?: string;
  brand?: {
    name: string;
    logo?: string;
    description?: string;
  };
  socials: AppSocialMedia[];
  bottomLinks: { label: string; href: string }[];
  zhubLinks: { label: string; href: string }[];
}

export function Footer({
  className,
  brand = {
    name: "Pemuda Magelang",
    logo: LOGO, // ganti sesuai asetmu
    description:
      "Platform kolaborasi untuk karya, komunitas, dan kegiatan kebudayaan.",
  },
  socials,
  bottomLinks,
  zhubLinks,
}: FooterProps) {
  const columns = [
    {
      title: "Umum",
      links: [
        { label: "Beranda", href: "/" },
        { label: "Galeri", href: "/galeri" },
        { label: "Talenta", href: "/talenta" },
        { label: "Komunitas", href: "/komunitas" },
      ],
    },
    {
      title: "Townhall",
      links: [
        { label: "Detak", href: "/detak" },
        { label: "Gerak", href: "/gerak" },
        { label: "Dampak", href: "/dampak" },
      ],
    },
    // {
    //   title: "Zhub",
    //   links: zhubLinks,
    // },
    {
      title: "Bantuan",
      links: [
        { label: "Tentang", href: "/#about" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Brand + Newsletter */}
        <div className="flex flex-row flex-wrap gap-8 py-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo */}
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              ) : null}
              <span className="text-lg font-semibold">{brand.name}</span>
            </Link>
            {brand.description && (
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {brand.description}
              </p>
            )}

            {/* Socials */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {socials.map((s) => (
                <SocialLink key={s.id} item={s} />
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-2 items-end justify-end">
            <div className="flex flex-row flex-wrap gap-36 w-full">
              {columns?.map((col) => (
                <nav
                  key={col.title}
                  aria-labelledby={`footer-${slugify(col.title)}`}
                >
                  <h3
                    id={`footer-${slugify(col.title)}`}
                    className="text-sm font-medium"
                  >
                    {col.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {col.links?.map((l) => (
                      <li key={`${col.title}-${l.label}`}>
                        <Link
                          href={l.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-start justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {brand.name}. Hak cipta dilindungi.
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {bottomLinks.map((b) => (
              <li key={b.label}>
                <Link href={b.href} className="hover:text-foreground">
                  {b.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helpers ---------- */

function SocialLink({ item }: { item: AppSocialMedia }) {
  return (
    <Link
      href={item.url}
      aria-label={item.platform}
      target="_blank"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground"
    >
      {socialMediaPlatformEnum.getIcon(item.platform)}
    </Link>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
