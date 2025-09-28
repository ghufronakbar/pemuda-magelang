import { getAllHubs } from "@/actions/zhub";
import { HubSection } from "@/components/hub/hub-section";
import { HubCategorySectionProps } from "@/components/hub/hub-cateogry-section";

const ZhubPage = async () => {
  const hubs = await getAllHubs();
  const mappedHubs: HubCategorySectionProps[] = hubs.map((h) => ({
    title: h.name,
    items: h.hubs.map((hub) => ({
      title: hub.name,
      description: hub.description,
      image: hub.image,
      slug: hub.slug,
      status: hub.status,
    })),
  }));
  return <HubSection className="py-26" categories={mappedHubs} />;
};

export default ZhubPage;
