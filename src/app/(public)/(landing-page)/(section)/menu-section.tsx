// components/landing/menu-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiMessageSquare,
  FiGrid,
} from "react-icons/fi";
import { FaPeopleArrows, FaPeopleCarry } from "react-icons/fa";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface MenuItem {
  title: string;
  href: string;
  /** Tak dipakai lagi di komponen ini, biarkan untuk kompatibilitas */
  image?: string | null;
  description?: string;
  /** (Baru) Ikon react-icons */
  icon?: IconType;
  className?: string;
}

export interface MenuSectionProps {
  title?: string;
  description?: string;
  items?: MenuItem[];
  className?: string;
}

export function MenuSection({
  title = "Mulai dari sini",
  description = "Pilih tujuanmu: baca artikel, temukan talenta, ikuti program Zhub, atau gabung diskusi.",
  items,
  className,
}: MenuSectionProps) {
  const data = items?.length ? items : DUMMY_MENUS;

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* Header: center */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> */}

      <ScrollArea className="flex flex-row">
        <div className="flex w-max space-x-4 p-4">
          {data.map((m) => (
            <MenuCard
              key={m.href}
              {...m}
              className={cn("w-[200px]", m.className)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

/* ---------- Card ---------- */

function MenuCard({
  title,
  href,
  description,
  icon: Icon,
  className,
}: MenuItem) {
  const FallbackIcon = getDefaultIcon(title);

  return (
    <Link href={href} aria-label={`Buka menu ${title}`} className="group block">
      <Card
        className={cn(
          "h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg",
          className
        )}
      >
        <CardHeader className="items-center space-y-3 text-center">
          <div className="rounded-full flex aspect-square w-fit h-fit bg-background p-4 shadow-sm transition-colors group-hover:bg-primary group-hover:text-white items-center justify-center mx-auto">
            {Icon ? (
              <Icon aria-hidden className="h-7 w-7" />
            ) : (
              <FallbackIcon aria-hidden className="h-7 w-7" />
            )}
          </div>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardHeader>

        <CardContent />

        <CardFooter className="justify-center mt-auto">
          <Button
            size="sm"
            variant="outline"
            className="transition-transform group-hover:translate-x-0.5 hover:bg-primary"
          >
            Buka →
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

/* ---------- Helpers & Dummy ---------- */

function getDefaultIcon(title: string): IconType {
  const t = title.toLowerCase();
  if (t.includes("artikel")) return FiBookOpen;
  if (t.includes("talenta")) return FiUsers;
  if (t.includes("forum")) return FiMessageSquare;
  if (t.includes("zhub") || t.includes("program")) return FiLayers;
  return FiGrid;
}

const DUMMY_MENUS: MenuItem[] = [
  {
    title: "Galeri",
    href: "/galeri",
    icon: FiGrid,
    description: "Produk & karya para talenta muda.",
  },
  {
    title: "Talenta",
    href: "/talenta",
    icon: FiUsers,
    description: "Kenali kreator & profesional di Kota Magelang.",
  },
  {
    title: "Komunitas",
    href: "/komunitas",
    icon: FaPeopleCarry,
    description: "Temukan komunitas & kolaborasi di Kota Magelang.",
  },
  {
    title: "Zhub",
    href: "/zhub",
    icon: FiLayers,
    description: "Program dukungan & kolaborasi untuk ekosistem kreatif.",
  },
  {
    title: "Detak",
    href: "/detak",
    icon: FiMessageSquare,
    description: "Kolom opini berbagai topik.",
  },
  {
    title: "Gerak",
    href: "/gerak",
    icon: FiBookOpen,
    description: "Artikel & berita terbaru dari admin.",
  },
  {
    title: "Dampak",
    href: "/dampak",
    icon: FaPeopleArrows,
    description: "Artikel & berita terbaru dari komunitas.",
  },
];
