// components/hub-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  HubCategorySection,
  type HubCategorySectionProps,
} from "@/components/hub/hub-cateogry-section";

export interface HubSectionProps {
  title?: string;
  description?: string;
  /** Array kategori berisi item HubCardProps[] */
  categories?: HubCategorySectionProps[];
  /** Batasi jumlah item per kategori (opsional) */
  limitPerCategory?: number;
  /** Tautan "Lihat semua" (opsional) */
  viewAllHref?: string;
  className?: string;
}

export function HubSection({
  title = "Zhub Program",
  description = "Kumpulan program dukungan dan inisiatif untuk ekosistem kebudayaan.",
  categories,
  limitPerCategory,
  viewAllHref,
  className,
}: HubSectionProps) {
  const data = categories?.length ? categories : DUMMY_HUB_CATEGORIES;

  return (
    <section className={cn("space-y-6", className)}>
      {/* Header konsisten dengan section lain */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
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
      </div>

      {/* Daftar kategori (tiap kategori punya container sendiri dari HubCategorySection) */}
      <div className="space-y-10">
        {data.map((cat) => {
          const sliced: HubCategorySectionProps = {
            title: cat.title,
            items:
              typeof limitPerCategory === "number"
                ? cat.items.slice(0, limitPerCategory)
                : cat.items,
          };
          return <HubCategorySection key={cat.title} {...sliced} />;
        })}
      </div>

      {/* CTA mobile untuk lihat semua */}
      {viewAllHref && (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={viewAllHref}>Lihat semua</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================= Dummy Data ================= */

const DUMMY_HUB_CATEGORIES: HubCategorySectionProps[] = [
  {
    title: "Dukungan Institusional",
    items: [
      {
        title: "Dukungan Institusional Organisasi Kebudayaan",
        description:
          "Penguatan kapasitas & pendanaan untuk organisasi kebudayaan di berbagai daerah.",
        image:
          "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop",
        slug: "/zhub/dukungan-institusional",
        status: "active",
      },
      {
        title: "Program Manajemen Organisasi Seni",
        description:
          "Pelatihan manajemen program, fundraising, hingga tata kelola berkelanjutan.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
        slug: "/zhub/manajemen-organisasi-seni",
        status: "soon",
      },
    ],
  },
  {
    title: "Residensi & Kolaborasi",
    items: [
      {
        title: "Residensi Seniman Nusantara",
        description:
          "Fasilitasi residensi lintas daerah untuk kolaborasi & pertukaran pengetahuan.",
        image:
          "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=1200&auto=format&fit=crop",
        slug: "/zhub/residensi-seniman",
        status: "soon",
      },
      {
        title: "Kolaborasi Komunitas Lokal",
        description:
          "Pengembangan proyek seni berbasis komunitas dengan pendampingan mentor.",
        image:
          "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
        slug: "/zhub/kolaborasi-komunitas",
        status: "active",
      },
    ],
  },
  {
    title: "Arsip & Pelestarian",
    items: [
      {
        title: "Arsip Digital Warisan Budaya",
        description:
          "Digitalisasi arsip budaya untuk pelestarian dan akses publik yang lebih luas.",
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
        slug: "/zhub/arsip-digital",
        status: "inactive",
      },
      {
        title: "Pemetaan Cagar Budaya",
        description:
          "Inisiatif pemetaan lokasi cagar budaya sebagai bahan kebijakan pelestarian.",
        image: null,
        slug: "/zhub/pemetaan-cagar-budaya",
        status: "active",
      },
    ],
  },
];
