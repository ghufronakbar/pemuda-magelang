// components/article-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArticleCard, type ArticleCardProps } from "@/components/article/article-card";

export interface ArticleSectionProps {
  title?: string;
  description?: string;
  articles?: ArticleCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function ArticleSection({
  title = "Artikel",
  description = "Wawasan dan cerita terbaru pilihan untukmu.",
  articles,
  limit,
  viewAllHref,
  className,
}: ArticleSectionProps) {
  const data = (articles?.length ? articles : DUMMY_ARTICLES).slice(
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
        {data.map((a) => (
          <ArticleCard key={a.slug} {...a} />
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

const DUMMY_ARTICLES: ArticleCardProps[] = [
  {
    title: "Mendesain Sistem Design Tokens di Skala Besar",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    category: "Design",
    content:
      "<p>Mengelola design tokens untuk multi brand dan platform membutuhkan strategi matang. Artikel ini membahas arsitektur token, penskalaan, dan automasi.</p>",
    tags: ["design-system", "tokens", "scale"],
    author: {
      name: "Alya Putri",
      image: null,
      profession: "Product Designer",
    },
    slug: "/artikel/mendesain-design-tokens",
    publishedAt: new Date("2025-03-02"),
  },
  {
    title: "Membangun API yang Tahan Skala",
    thumbnail:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    category: "Technology",
    content:
      "<p>Dari pagination hingga idempotency: praktik terbaik untuk API yang stabil, aman, dan siap tumbuh.</p>",
    tags: ["api", "scalability", "best-practices"],
    author: {
      name: "Bima Ardiansyah",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      profession: "Software Engineer",
    },
    slug: "/artikel/membangun-api-tahan-skala",
    publishedAt: new Date("2025-02-12"),
  },
  {
    title: "Strategi Monetisasi untuk Kreator",
    thumbnail:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
    category: "Business",
    content:
      "<p>Langganan, kursus, sponsor, dan merchandise—mana yang paling cocok untukmu? Kita bedah pro-kontra dan metriknya.</p>",
    tags: ["monetization", "creator-economy"],
    author: {
      name: "Rani Pramudita",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
      profession: "Content Strategist",
    },
    slug: "/artikel/strategi-monetisasi-kreator",
    publishedAt: new Date("2025-01-28"),
  },
  {
    title: "Menyusun Roadmap Produk yang Realistis",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    category: "Product",
    content:
      "<p>Roadmap bukan daftar harapan. Pelajari bagaimana menghubungkan outcome, prioritas, dan kapasitas tim.</p>",
    tags: ["roadmap", "prioritization", "product"],
    author: {
      name: "Dimas Arief",
      image:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=600&auto=format&fit=crop",
      profession: "Product Manager",
    },
    slug: "/artikel/menyusun-roadmap-produk",
    publishedAt: new Date("2024-12-09"),
  },
  {
    title: "Fundamental Tipografi untuk Web",
    thumbnail:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
    category: "Design",
    content:
      "<p>Dari skala tipografi, line-height, hingga variable fonts—fondasi penting agar teks nyaman dibaca di semua device.</p>",
    tags: ["typography", "frontend", "ux"],
    author: {
      name: "Nadia Anindya",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
      profession: "Art Director",
    },
    slug: "/artikel/fundamental-tipografi-web",
    publishedAt: new Date("2025-03-10"),
  },
  {
    title: "Produksi Audio untuk Film Pendek",
    thumbnail:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    category: "Film",
    content:
      "<p>Sound design adalah separuh pengalaman sinema. Kita bahas workflow rekaman, foley, dan mixing.</p>",
    tags: ["audio", "film", "post-production"],
    author: {
      name: "Raka Wijaya",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop",
      profession: "Cinematographer",
    },
    slug: "/artikel/produksi-audio-film-pendek",
    publishedAt: new Date("2025-02-05"),
  },
];
