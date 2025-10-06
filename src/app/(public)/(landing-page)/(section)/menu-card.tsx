import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiMessageSquare,
  FiGrid,
} from "react-icons/fi";
import { FaPeopleArrows, FaPeopleCarry } from "react-icons/fa";
import { IconType } from "react-icons";

export interface MenuItem {
  title: string;
  href: string;
  description: string;
  icon: IconType;
  className?: string;
}

export function MenuCard({
  title,
  href,
  description,
  icon: Icon,
  className,
}: MenuItem) {
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
            <Icon aria-hidden className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold leading-snug">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardHeader>

        <CardContent />

        <CardFooter className="justify-center mt-auto">
          {/* Removed explicit Buka button for cleaner card; whole card is clickable */}
        </CardFooter>
      </Card>
    </Link>
  );
}

export const MENU_ITEMS: MenuItem[] = [
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
