import { GalleryCard } from "@/components/gallery/gallery-card";
import { Button } from "@/components/ui/button";
import { Product, Talent } from "@prisma/client";
import Link from "next/link";

interface TalentProductProps {
  products: Product[];
  talent: Talent;
  showShowAllButton: boolean;
}

export const TalentProduct = ({
  products,
  talent,
  showShowAllButton,
}: TalentProductProps) => {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold sm:text-xl">
          Produk oleh {talent.name}
        </h2>
        {showShowAllButton && (
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={`/talenta/${talent.slug}/produk`}>Lihat semua →</Link>
          </Button>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <GalleryCard
              key={p.id}
              author={{
                image: talent.profilePicture,
                name: talent.name,
                profession: talent.profession,
              }}
              category={p.category}
              description={p.description}
              title={p.title}
              image={p.images[0]}
              tags={p.tags}
              slug={p.slug}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada produk.</p>
      )}

      {showShowAllButton && (
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/talenta/${talent.slug}/produk`}>Lihat semua</Link>
          </Button>
        </div>
      )}
    </section>
  );
};
