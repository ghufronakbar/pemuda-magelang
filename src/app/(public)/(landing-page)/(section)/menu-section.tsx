"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MENU_ITEMS, MenuCard } from "./menu-card";

export interface MenuSectionProps {
  title?: string;
  description?: string;
  className?: string;
  /** jarak sekali scroll (px). default: 80% lebar viewport, minimal 320px */
  scrollStep?: number;
}

export function MenuSection({
  title = "Mulai dari sini",
  description = "Pilih tujuanmu: baca artikel, temukan talenta, ikuti program Zhub, atau gabung diskusi.",
  className,
  scrollStep,
}: MenuSectionProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const updateCanScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < max - 1);
  }, []);

  React.useEffect(() => {
    // ambil viewport radix dari dalam ScrollArea
    const root = rootRef.current;
    if (!root) return;
    viewportRef.current = root.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null;

    const el = viewportRef.current;
    if (!el) return;

    updateCanScroll();

    const onScroll = () => updateCanScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    // Nonaktifkan scroll via wheel/trackpad di desktop; tetap izinkan swipe di mobile
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    // observe resize supaya tombol ikut update saat layout berubah
    const ro = new ResizeObserver(updateCanScroll);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel as EventListener);
      ro.disconnect();
    };
  }, [updateCanScroll]);

  const nudge = (dir: "prev" | "next") => {
    const el = viewportRef.current;
    if (!el) return;
    const base = scrollStep ?? Math.max(320, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({
      left: dir === "next" ? base : -base,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* Header: center */}
      <div className="mb-6 sm:mb-8 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-base text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="relative">
        {/* <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent" /> */}

        <ScrollArea ref={rootRef} className="flex flex-row pm-no-scrollbar">
          <div className="flex w-max space-x-3 sm:space-x-4 p-4 sm:p-5">
            {MENU_ITEMS.map((m) => (
              <MenuCard
                key={m.href}
                {...m}
                className={cn("w-[220px] sm:w-[240px]", m.className)}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="flex flex-row items-center gap-3 sm:gap-4 p-6 sm:p-8 justify-end">
          <div className="pointer-events-none flex-shrink-0 flex items-center pl-1">
            <Button
              type="button"
              onClick={() => nudge("prev")}
              disabled={!canPrev}
              size="icon"
              className="pointer-events-auto rounded-full shadow-sm bg-white text-green-600 border border-green-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              aria-label="Scroll kiri"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* tombol kanan */}
          <div className="pointer-events-none flex-shrink-0 flex items-center pr-1">
            <Button
              type="button"
              onClick={() => nudge("next")}
              disabled={!canNext}
              size="icon"
              className="pointer-events-auto rounded-full shadow-sm bg-white text-green-600 border border-green-600 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              aria-label="Scroll kanan"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hide native scrollbar in all browsers for ScrollArea viewport */}
      <style jsx global>{`
        .pm-no-scrollbar [data-radix-scroll-area-viewport] {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .pm-no-scrollbar [data-radix-scroll-area-viewport]::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
      `}</style>
    </section>
  );
}
