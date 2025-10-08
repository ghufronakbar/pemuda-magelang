"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HERO_IMAGE } from "@/constants";
import { CdnImage } from "@/components/custom/cdn-image";

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  heroImage: string | null; // gambar ilustrasi/kolase kanan (opsional)
  className?: string;
  countTalent: number;
  countCommunity: number;
  countZhub: number;
}

export function HeroSection({
  title = "Pemuda Magelang",
  subtitle = "Wadah kolaborasi talenta Kota Magelang — temukan komunitas, bangun portofolio, dan bertumbuh bersama.",
  heroImage,
  className,
  countTalent,
  countCommunity,
  countZhub,
}: HeroSectionProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 z-10 w-full h-full">
        <CdnImage
          uniqueKey={HERO_IMAGE}
          alt="Ilustrasi Pemuda Magelang"
          width={1920}
          height={1080}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-28 lg:px-8 z-10">
        {/* Left: copy & CTAs */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div className="mb-4">
            <Badge variant="secondary" className="rounded-full">
              Kota Magelang
            </Badge>
          </div>

          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-black">
            {title}
          </h1>
          <p className="mt-3 max-w-prose text-base text-black sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto shadow-sm">
              <Link href={"/register"}>Gabung Komunitas</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              <Link href={"/zhub"}>Lihat Program</Link>
            </Button>
          </div>

          {/* Stats */}

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <dt className="text-xs text-muted-foreground">
                Talenta terdaftar
              </dt>
              <dd className="mt-1 text-2xl font-semibold sm:text-3xl text-black">
                {countTalent}
              </dd>
            </div>
            <div className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <dt className="text-xs text-muted-foreground">
                Komunitas tergabung
              </dt>
              <dd className="mt-1 text-2xl font-semibold sm:text-3xl text-black">
                {countCommunity}
              </dd>
            </div>
            <div className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <dt className="text-xs text-muted-foreground">Program aktif</dt>
              <dd className="mt-1 text-2xl font-semibold sm:text-3xl text-black">
                {countZhub}
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: hero image / collage */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur">
            {heroImage ? (
              <CdnImage
                uniqueKey={heroImage}
                alt="Ilustrasi Pemuda Magelang"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Tambahkan heroImage…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
