// components/hub-category-section.tsx
import { HubCard, type HubCardProps } from "@/components/hub/hub-card";

export interface HubCategorySectionProps {
  title: string;
  items: HubCardProps[];
}

export function HubCategorySection({ title, items }: HubCategorySectionProps) {
  const data = items?.length ? items : [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((hub, index) => (
            <HubCard key={hub.slug + index} {...hub} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Belum ada program dalam kategori ini.
        </p>
      )}
    </section>
  );
}
