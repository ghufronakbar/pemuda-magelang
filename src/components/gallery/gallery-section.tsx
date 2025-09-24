import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  GalleryCard,
  GalleryCardProps,
} from "@/components/gallery/gallery-card";
import { Button } from "@/components/ui/button";

export interface GallerySectionProps {
  title?: string;
  description?: string;
  products?: GalleryCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function GallerySection({
  title = "Galeri",
  description = "Koleksi pilihan yang dikurasi untuk kamu.",
  products,
  limit,
  viewAllHref,
  className,
}: GallerySectionProps) {
  const data = (products?.length ? products : DUMMY_GALLERYS).slice(
    0,
    typeof limit === "number" ? limit : undefined
  );

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {viewAllHref && (
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={viewAllHref}>Lihat semua →</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => (
          <GalleryCard key={p.slug} {...p} />
        ))}
      </div>

      {viewAllHref && (
        <div className="mt-6 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={viewAllHref}>Lihat semua</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

/* ================= Dummy Data ================= */

const DUMMY_GALLERYS: GalleryCardProps[] = [
  {
    title: "Kamera Mirrorless Alpha X",
    image:
      "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1200&auto=format&fit=crop",
    category: "Elektronik",
    description:
      "Kamera ringkas dengan sensor full-frame dan stabilisasi 5-axis untuk hasil jernih.",
    author: {
      name: "Alya Putri",
      image: null,
      profession: "Content Creator",
    },
    tags: ["kamera", "full-frame", "stabilization"],
    slug: "/products/kamera-mirrorless-alpha-x",
  },
  {
    title: "Sneakers Urban Runner",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    category: "Fashion",
    description:
      "Nyaman untuk aktivitas harian dengan outsole grip kuat dan upper berpori.",
    author: {
      name: "Budi Santoso",
      image: null,
      profession: "Stylist",
    },
    tags: ["sneakers", "lifestyle", "unisex"],
    slug: "/products/sneakers-urban-runner",
  },
  {
    title: "Manual Brew Set",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
    category: "Home",
    description:
      "Set kopi manual untuk pour-over; nikmati aroma dan rasa yang lebih kompleks.",
    author: {
      name: "Rani Pramudita",
      image: null,
      profession: "Barista",
    },
    tags: ["coffee", "pour-over", "v60"],
    slug: "/products/manual-brew-set",
  },
  {
    title: "Smartwatch Active S",
    image:
      "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200&auto=format&fit=crop",
    category: "Gadget",
    description:
      "Tracking kesehatan 24/7, notifikasi pintar, dan baterai hingga 10 hari.",
    author: {
      name: "Dimas Arief",
      image: null,
      profession: "Product Reviewer",
    },
    tags: ["health", "tracking", "wearable"],
    slug: "/products/smartwatch-active-s",
  },
  {
    title: "Desk Lamp Minimal",
    image:
      "https://images.unsplash.com/photo-1519872436884-4a50f4e72cbe?q=80&w=1200&auto=format&fit=crop",
    category: "Dekorasi",
    description:
      "Desain minimalis dengan tingkat kecerahan yang dapat diatur dan suhu warna hangat.",
    author: {
      name: "Nadia A.",
      image: null,
      profession: "Interior Designer",
    },
    tags: ["lighting", "minimal", "workspace"],
    slug: "/products/desk-lamp-minimal",
  },
  {
    title: "Backpack Everyday 20L",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    category: "Lifestyle",
    description:
      "Tas punggung ringan, banyak kompartemen, cocok untuk kerja dan perjalanan.",
    author: {
      name: "Raka Wijaya",
      image: null,
      profession: "Photographer",
    },
    tags: ["backpack", "travel", "organizer"],
    slug: "/products/backpack-everyday-20l",
  },
];
