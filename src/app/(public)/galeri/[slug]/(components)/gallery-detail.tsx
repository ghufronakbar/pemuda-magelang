// components/galeri/galeri-detail.tsx
"use client";

import * as React from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CdnImage, cdnUrl } from "@/components/custom/cdn-image";

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

  const goPrev = React.useCallback(() => {
    setCurrent((idx) => (idx - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  const goNext = React.useCallback(() => {
    setCurrent((idx) => (idx + 1) % safeImages.length);
  }, [safeImages.length]);

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
  const ctaLabel = ctaSM
    ? `Hubungi di ${socialMediaPlatformEnum.getLabel(ctaSM.platform)}`
    : "Hubungi";

  // Produk lain dari talent yang sama (kecuali produk sekarang)
  const otherProducts = (talent.products ?? []).filter((p) => p.slug !== slug);

  const otherListRef = React.useRef<HTMLDivElement>(null);

  const scrollOtherPrev = React.useCallback(() => {
    const el = otherListRef.current;
    if (!el) return;
    el.scrollBy({ left: -320, behavior: "smooth" });
  }, []);

  const scrollOtherNext = React.useCallback(() => {
    const el = otherListRef.current;
    if (!el) return;
    el.scrollBy({ left: 320, behavior: "smooth" });
  }, []);

  const maxLenDescription = 100;
  const lenDescription = description?.length ?? 0;
  const [isShowAllDescription, setIsShowAllDescription] = React.useState(false);
  const descriptionEllipsis = isShowAllDescription
    ? description
    : description?.slice(0, maxLenDescription) + "...";
  const isLongDescription = lenDescription > maxLenDescription;

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Media */}
            <div className="lg:col-span-7">
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="overflow-hidden rounded-2xl border bg-muted cursor-zoom-in"
                    aria-label="Perbesar gambar"
                  >
                    <div className="relative aspect-square w-full">
                      <CdnImage
                        key={safeImages[current]}
                        uniqueKey={safeImages[current]}
                        alt={title}
                        fill
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent
                  showCloseButton
                  className="border-0 bg-black p-0 sm:max-w-3xl"
                >
                  <div className="relative w-full h-[60vh]">
                    <CdnImage
                      key={`fullscreen-${safeImages[current]}`}
                      uniqueKey={safeImages[current]}
                      alt={title}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority
                    />
                    {safeImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Sebelumnya"
                          onClick={goPrev}
                          className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-hidden focus:ring-2 focus:ring-white/40"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          aria-label="Berikutnya"
                          onClick={goNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 focus:outline-hidden focus:ring-2 focus:ring-white/40"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {safeImages.length > 1 && (
                <div className="p-2 flex gap-3 overflow-x-auto pb-1">
                  {safeImages.map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      aria-label={`Gambar ${idx + 1}`}
                      onClick={() => setCurrent(idx)}
                      className={cn(
                        "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border",
                        current === idx
                          ? "ring-2 ring-primary"
                          : "opacity-90 hover:opacity-100"
                      )}
                    >
                      <CdnImage
                        uniqueKey={src}
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
            <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {title}
              </h1>

              {/* Price (opsional) */}
              {typeof price === "number" && price !== 0 && (
                <div className="mt-2 text-2xl font-semibold">
                  {formatIDR(price)}
                </div>
              )}

              <div className="my-5">
                <Separator />
              </div>

              {/* Talent */}
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage
                    src={cdnUrl(talent.profilePicture ?? "")}
                    alt={talent.name}
                  />
                  <AvatarFallback>{getInitials(talent.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {talent.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {talent.profession} • {talent.industry}
                  </div>
                </div>
                <div className="ml-auto flex flex-col gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/talenta/${talent.slug}`}>Lihat Profil</Link>
                  </Button>
                  {ctaHref && (
                    <Button asChild size="sm" className="shadow-sm">
                      <Link
                        href={ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {socialMediaPlatformEnum.getIcon(
                          ctaSM.platform,
                          "mr-2 text-white"
                        )}
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
                          className="justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20"
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
              <div
                className={cn(
                  "prose prose-neutral max-w-none text-sm",
                  isShowAllDescription && "line-clamp-none"
                )}
              >
                <p className="whitespace-pre-wrap">{descriptionEllipsis}</p>
              </div>
              <span
                className="text-xs text-muted-foreground"
                onClick={() => setIsShowAllDescription(!isShowAllDescription)}
              >
                {isLongDescription &&
                  (isShowAllDescription
                    ? "Lihat lebih sedikit"
                    : "Lihat selengkapnya")}
              </span>

              {/* Tags moved below description */}
              {tags?.length ? (
                <>
                  <div className="my-5">
                    <Separator />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((t) => (
                      <Badge key={t} variant="outline" className="rounded-full">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Produk lain dari talent ini */}
          {otherProducts.length > 0 && (
            <>
              <div className="my-8">
                <Separator />
              </div>

              <section className="relative">
                <h2 className="mb-3 text-lg font-semibold sm:text-xl">
                  Produk lain dari {talent.name}
                </h2>

                <div
                  ref={otherListRef}
                  className="-mx-1 flex gap-4 overflow-x-auto pb-1 pl-1 pr-1 scroll-smooth"
                >
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
                            <CdnImage
                              uniqueKey={cover}
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

                {/* Nav buttons */}
                <button
                  type="button"
                  aria-label="Sebelumnya"
                  onClick={scrollOtherPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full border border-foreground/10 bg-background/80 p-2 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 transition hover:bg-background focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Berikutnya"
                  onClick={scrollOtherNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full border border-foreground/10 bg-background/80 p-2 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 transition hover:bg-background focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </section>
            </>
          )}
        </CardContent>
      </Card>
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
