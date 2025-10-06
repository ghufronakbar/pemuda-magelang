import { getCategoryHub } from "@/actions/zhub";
import { HubSection } from "@/components/hub/hub-section";
import { HubCategorySectionProps } from "@/components/hub/hub-cateogry-section";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const hubCategory = await getCategoryHub();
  const cat = await hubCategory(id);
  return {
    title: cat?.name,
    description: cat?.name,
  };
}

const ZhubKategoriPage = async ({ params }: Params) => {
  const { id } = await params;
  const hubCategory = await getCategoryHub();
  const cat = await hubCategory(id);
  if (!cat) return notFound();
  const mappedHubs: HubCategorySectionProps[] = [
    {
      title: cat.name,
      items: cat?.hubs
        .map((h) => ({
          title: h.name,
          description: h.description,
          image: h.image,
          slug: h.slug,
          status: h.status,
        }))
        .sort((a, b) => SORTS[a.status] - SORTS[b.status]),
    },
  ];
  return <HubSection className="py-26" categories={mappedHubs} />;
};

export default ZhubKategoriPage;

const SORTS = {
  active: 0,
  soon: 1,
  inactive: 2,
} as const;
