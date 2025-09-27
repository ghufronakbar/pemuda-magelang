// components/galeri/galeri-detail.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SocialMediaPlatformEnum,
  type Product,
  type SocialMedia,
  type Talent,
} from "@prisma/client";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { formatIDR, getInitials } from "@/lib/helper";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";

export interface GalleryDetailProps {
  product: Product & {
    talent: Talent & {
      socialMedias: SocialMedia[];
      products: Product[];
    };
  };
  className?: string;
}

export function GaleriDetail({ product, className }: GalleryDetailProps) {
  const { slug, title, images, description, price, tags, talent } = product;

  const [current, setCurrent] = React.useState(0);
  const safeImages = images?.length ? images : [PLACEHOLDER_IMAGE];

  React.useEffect(() => {
    if (current >= safeImages.length) setCurrent(0);
  }, [safeImages.length, current]);

  // Pilih CTA: WhatsApp > pertama
  const ctaSM: SocialMedia | null =
    talent.socialMedias.find(
      (sm) => sm.platform === SocialMediaPlatformEnum.whatsapp
    ) ??
    talent.socialMedias[0] ??
    null;
  const ctaHref = ctaSM ? normalizeSocialUrl(ctaSM.platform, ctaSM.url) : null;
  const ctaLabel = socialMediaPlatformEnum.getLabel(ctaSM.platform)
    ? `Hubungi di ${socialMediaPlatformEnum.getLabel(ctaSM.platform)}`
    : "Hubungi";

  // Produk lain dari talent yang sama (kecuali produk sekarang)
  const otherProducts = (talent.products ?? []).filter((p) => p.slug !== slug);

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Media */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <div className="relative aspect-square w-full">
              <Image
                key={safeImages[current]}
                src={safeImages[current]}
                alt={title}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {safeImages.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {safeImages.map((src, idx) => (
                <button
                  key={src + idx}
                  type="button"
                  aria-label={`Gambar ${idx + 1}`}
                  onClick={() => setCurrent(idx)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border",
                    current === idx
                      ? "ring-2 ring-primary"
                      : "opacity-90 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt={`${title} - ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-5">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {tags?.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full">
                #{t}
              </Badge>
            ))}
          </div>

          <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
            {title}
          </h1>

          {/* Price (opsional) */}
          {typeof price === "number" && (
            <div className="mt-2 text-xl font-semibold">{formatIDR(price)}</div>
          )}

          <div className="my-5">
            <Separator />
          </div>

          {/* Talent */}
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src={talent.profilePicture ?? ""}
                alt={talent.name}
              />
              <AvatarFallback>{getInitials(talent.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{talent.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {talent.profession} • {talent.industry}
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/talenta/${talent.slug}`}>Lihat Profil</Link>
              </Button>
              {ctaHref && (
                <Button asChild size="sm">
                  <Link
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {socialMediaPlatformEnum.getIcon(ctaSM!.platform, "mr-2 text-white")}
                    {ctaLabel}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Socials */}
          {talent.socialMedias.length > 0 && (
            <>
              <div className="my-5">
                <Separator />
              </div>
              <div className="flex flex-wrap gap-2">
                {talent.socialMedias.map((sm) => {
                  const href = normalizeSocialUrl(sm.platform, sm.url);
                  return (
                    <Button
                      key={sm.id}
                      asChild
                      size="sm"
                      variant="secondary"
                      className="justify-start gap-2"
                    >
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {socialMediaPlatformEnum.getIcon(sm.platform)}
                        <span className="text-xs">
                          {socialMediaPlatformEnum.getLabel(sm.platform)}
                        </span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </>
          )}

          <div className="my-5">
            <Separator />
          </div>

          {/* Description */}
          <div className="prose prose-neutral max-w-none text-sm">
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        </div>
      </div>

      {/* Produk lain dari talent ini */}
      {otherProducts.length > 0 && (
        <>
          <div className="my-8">
            <Separator />
          </div>

          <section>
            <h2 className="mb-3 text-lg font-semibold sm:text-xl">
              Produk lain dari {talent.name}
            </h2>

            <div className="-mx-1 flex gap-4 overflow-x-auto pb-1 pl-1 pr-1">
              {otherProducts.map((p) => {
                const cover = p.images?.[0] ?? PLACEHOLDER_IMAGE;
                return (
                  <Link
                    key={p.id}
                    href={`/galeri/${p.slug}`}
                    className="group w-[240px] shrink-0"
                  >
                    <div className="overflow-hidden rounded-xl border bg-muted">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={cover}
                          alt={p.title}
                          fill
                          sizes="240px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="line-clamp-2 text-sm font-medium">
                        {p.title}
                      </div>
                      {typeof p.price === "number" && (
                        <div className="text-xs text-muted-foreground">
                          {formatIDR(p.price)}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

/* ================= Helpers ================= */

function normalizeSocialUrl(platform: SocialMediaPlatformEnum, raw: string) {
  const url = (raw || "").trim();

  // sudah punya scheme?
  const hasScheme =
    /^([a-z][a-z0-9+\-.]*:)?\/\//i.test(url) ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:");

  if (hasScheme) return url;

  switch (platform) {
    case SocialMediaPlatformEnum.email:
      return `mailto:${url}`;
    case SocialMediaPlatformEnum.phone:
      // tel: without spaces
      return `tel:${url.replace(/\s+/g, "")}`;
    case SocialMediaPlatformEnum.whatsapp: {
      // ambil digit saja (+ optional), default asumsikan nomor lokal/intl yang valid
      const digits = url.replace(/[^\d+]/g, "");
      return `https://wa.me/${digits.replace(/^\+/, "")}`;
    }
    case SocialMediaPlatformEnum.address:
      // jika bukan links, arahkan ke Google Maps query
      return `https://maps.google.com/?q=${encodeURIComponent(url)}`;
    case SocialMediaPlatformEnum.instagram:
      return `https://instagram.com/${stripAt(url)}`;
    case SocialMediaPlatformEnum.twitter:
      return `https://x.com/${stripAt(url)}`;
    case SocialMediaPlatformEnum.facebook:
      return `https://facebook.com/${stripAt(url)}`;
    case SocialMediaPlatformEnum.youtube:
      return `https://youtube.com/${url}`;
    case SocialMediaPlatformEnum.linkedin:
      return `https://www.linkedin.com/in/${stripAt(url)}`;
    case SocialMediaPlatformEnum.tiktok:
      return `https://www.tiktok.com/@${stripAt(url)}`;
    case SocialMediaPlatformEnum.website:
    case SocialMediaPlatformEnum.other:
    default:
      // fallback tambah https
      return `https://${url}`;
  }
}

function stripAt(s: string) {
  return s.replace(/^@/, "");
}
