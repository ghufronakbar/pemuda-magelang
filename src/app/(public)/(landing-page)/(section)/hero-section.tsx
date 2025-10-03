"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HERO_IMAGE } from "@/constants";

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
    <section
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-b from-background via-background to-background",
        className
      )}
    >
      <div className="absolute inset-0 z-10 w-full h-full">
        <Image
          src={HERO_IMAGE}
          alt="Ilustrasi Pemuda Magelang"
          width={1920}
          height={1080}
          className="object-cover w-full h-full"
          priority
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10" />
      </div>

      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-24 lg:px-8 z-10">
        {/* Left: copy & CTAs */}
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div className="mb-4">
            <Badge variant="secondary" className="rounded-full">
              Kota Magelang
            </Badge>
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            {title}
          </h1>
          <p className="mt-3 max-w-prose text-sm text-gray-200 sm:text-base">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={"/register"}>Gabung Komunitas</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href={"/zhub"}>Lihat Program</Link>
            </Button>
          </div>

          {/* Stats */}

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-background/60 p-4">
              <dt className="text-xs text-muted-foreground">
                Talenta terdaftar
              </dt>
              <dd className="mt-1 text-lg font-semibold sm:text-xl">
                {countTalent}
              </dd>
            </div>
            <div className="rounded-lg border bg-background/60 p-4">
              <dt className="text-xs text-muted-foreground">
                Komunitas tergabung
              </dt>
              <dd className="mt-1 text-lg font-semibold sm:text-xl">
                {countCommunity}
              </dd>
            </div>
            <div className="rounded-lg border bg-background/60 p-4">
              <dt className="text-xs text-muted-foreground">Program aktif</dt>
              <dd className="mt-1 text-lg font-semibold sm:text-xl">
                {countZhub}
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: hero image / collage */}
        <div className="order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-2xl border bg-muted shadow-sm">
            {heroImage ? (
              <Image
                src={heroImage}
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

            {/* subtle overlay gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
