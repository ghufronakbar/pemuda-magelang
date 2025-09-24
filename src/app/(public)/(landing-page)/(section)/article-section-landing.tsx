// components/landing/articles/article-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ArticleCard,
  type ArticleCardProps,
} from "@/components/article/article-card";

export interface ArticleLandingSectionProps {
  title?: string;
  description?: string;
  articles?: ArticleCardProps[]; // assumed unsorted
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function ArticleSectionLanding({
  title = "Artikel Terbaru",
  description = "Wawasan dan cerita terkini dari komunitas Pemuda Magelang.",
  articles,
  limit,
  viewAllHref = "/artikel",
  className,
}: ArticleLandingSectionProps) {
  const source = articles?.length ? articles : DUMMY_ARTICLES;

  // sort by publishedAt desc, lalu batasi
  const data = [...source]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, typeof limit === "number" ? limit : undefined);

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* decorative bg lembut */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 rounded-full">
              Artikel
            </Badge>
            <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={viewAllHref}>Lihat semua →</Link>
            </Button>
          )}
        </div>

        {/* Carousel horizontal (landing-friendly) */}
        <ScrollArea className="-mx-4">
          <div className="flex gap-4 px-4 py-2">
            {data.map((a) => (
              <div key={a.slug} className="w-[300px] sm:w-[360px]">
                <ArticleCard {...a} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* CTA mobile */}
        {viewAllHref && (
          <div className="mt-6 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={viewAllHref}>Lihat semua</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= Dummy Data ================= */
const DUMMY_ARTICLES: ArticleCardProps[] = [
  {
    title: "Kickoff Pemuda Magelang 2025: Arah & Program",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    category: "Community",
    content:
      "<p>Rangkuman kickoff tahun ini, fokus pada kolaborasi lintas-komunitas dan showcase karya bulanan.</p>",
    tags: ["community", "kickoff", "program"],
    author: {
      name: "Dimas Arief",
      image:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop",
      profession: "Product Manager",
    },
    slug: "/artikel/kickoff-2025",
    publishedAt: new Date("2025-03-12"),
  },
  {
    title: "Portofolio Kreator: Cara Tampil Mengesankan",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    category: "Career",
    content:
      "<p>Kiat menyusun portofolio yang rapi, terukur, dan relevan untuk peluang kolaborasi baru.</p>",
    tags: ["portfolio", "tips", "career"],
    author: {
      name: "Alya Putri",
      image: null,
      profession: "Product Designer",
    },
    slug: "/artikel/portofolio-kreator",
    publishedAt: new Date("2025-03-05"),
  },
  {
    title: "Belajar Produksi Audio untuk Video Pendek",
    thumbnail:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    category: "Music",
    content:
      "<p>Dari rekaman hingga mixing ringan: workflow praktis untuk membuat video pendek terdengar profesional.</p>",
    tags: ["audio", "video", "workflow"],
    author: {
      name: "Raka Wijaya",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop",
      profession: "Cinematographer",
    },
    slug: "/artikel/produksi-audio-video-pendek",
    publishedAt: new Date("2025-02-18"),
  },
  {
    title: "Galeri Karya: Kurasi Edisi Februari",
    thumbnail:
      "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1200&auto=format&fit=crop",
    category: "Showcase",
    content:
      "<p>Karya-karya pilihan dari komunitas dengan berbagai medium: foto, ilustrasi, dan musik.</p>",
    tags: ["showcase", "gallery"],
    author: {
      name: "Nadia Anindya",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      profession: "Art Director",
    },
    slug: "/artikel/kurasi-februari",
    publishedAt: new Date("2025-02-10"),
  },
  {
    title: "Menemukan Tim untuk Hackathon Lokal",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    category: "Technology",
    content:
      "<p>Strategi cepat membangun tim lintas keahlian untuk mengikuti hackathon tingkat kota.</p>",
    tags: ["hackathon", "team", "tech"],
    author: {
      name: "Bima Ardiansyah",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      profession: "Software Engineer",
    },
    slug: "/artikel/tim-hackathon-kota",
    publishedAt: new Date("2025-01-28"),
  },
];
