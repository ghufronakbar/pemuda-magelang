"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { LOGO } from "@/constants";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface FooterProps {
  className?: string;
  brand?: {
    name: string;
    logo?: string;
    description?: string;
  };
  socials?: { label: string; href: string; icon: IconType }[];
  bottomLinks?: { label: string; href: string }[];
  zhubLinks: { label: string; href: string }[];
}

const DEFAULT_SOCIALS: NonNullable<FooterProps["socials"]> = [
  { label: "Email", href: "mailto:hello@example.com", icon: Mail },
  { label: "Instagram", href: "https://instagram.com/", icon: Instagram },
  { label: "Twitter/X", href: "https://twitter.com/", icon: Twitter },
  { label: "YouTube", href: "https://youtube.com/", icon: Youtube },
  { label: "Facebook", href: "https://facebook.com/", icon: Facebook },
];

const DEFAULT_BOTTOM: NonNullable<FooterProps["bottomLinks"]> = [
  { label: "Privasi", href: "/privacy" },
  { label: "Ketentuan", href: "/terms" },
  { label: "Peta Situs", href: "/sitemap" },
];

export function Footer({
  className,
  brand = {
    name: "Pemuda Magelang",
    logo: LOGO, // ganti sesuai asetmu
    description:
      "Platform kolaborasi untuk karya, komunitas, dan kegiatan kebudayaan.",
  },
  socials = DEFAULT_SOCIALS,
  bottomLinks = DEFAULT_BOTTOM,
  zhubLinks,
}: FooterProps) {
  const columns = [
    {
      title: "Umum",
      links: [
        { label: "Beranda", href: "/" },
        { label: "Galeri", href: "/galeri" },
        { label: "Talenta", href: "/talenta" },
      ],
    },
    {
      title: "Townhall",
      links: [
        { label: "Detak", href: "/detak" },
        { label: "Gerak", href: "/gerak" },
      ],
    },
    {
      title: "Zhub",
      links: zhubLinks,
    },
    {
      title: "Bantuan",
      links: [
        { label: "Tentang", href: "/tentang" },
        { label: "Kontak", href: "/kontak" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Brand + Newsletter */}
        <div className="grid gap-8 py-10 md:grid-cols-3">
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
                <SocialLink
                  key={s.label}
                  href={s.href}
                  label={s.label}
                  icon={s.icon}
                />
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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

        {/* Newsletter row */}
        {/* <div className="flex flex-col items-start justify-between gap-3 py-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Dapatkan kabar terbaru dan kurasi pilihan setiap minggunya.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm items-center gap-2"
          >
            <Input type="email" placeholder="Email kamu" aria-label="Email" />
            <Button type="submit">Langganan</Button>
          </form>
        </div> */}

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

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: IconType;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
