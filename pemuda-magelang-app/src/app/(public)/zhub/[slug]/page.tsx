// app/zhub/[slug]/page.tsx
import { getDetailHub } from "@/actions/zhub";
import { ZHubDetail } from "./(components)/z-hub-detail";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const hub = await getDetailHub(slug);
  return {
    title: hub ? `Program ${hub.name}` : "Program",
    description: hub?.description,
    openGraph: {
      title: hub ? `Program ${hub.name}` : "Program",
      description: hub?.description,
      images: hub?.image ? [hub.image] : undefined,
    },
    twitter: {
      title: hub?.name,
      description: hub?.description,
      images: hub?.image ? [hub.image] : undefined,
    },
  };
}

export default async function ZHubDetailPage({ params }: Params) {
  const { slug } = await params;
  const hub = await getDetailHub(slug);

  if (!hub) return notFound();
  return <ZHubDetail hub={hub} className="py-26" />;
}
