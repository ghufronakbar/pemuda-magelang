import { notFound } from "next/navigation";
import { getDetailProduct } from "@/actions/product";
import { GaleriDetail } from "./(components)/gallery-detail";
import { TalentStatusEnum } from "@prisma/client";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const article = await getDetailProduct(slug)();
  return {
    title: article?.title,
    description: article?.description,
    openGraph: {
      title: article?.title,
      description: article?.description,
      images: article?.images,
    },
    twitter: {
      title: article?.title,
      description: article?.description,
      images: article?.images,
    },
  };
}

const GaleriDetailPage = async ({ params }: Params) => {
  const { slug } = await params;
  const product = await getDetailProduct(slug)();

  if (!product || product.talent.status !== TalentStatusEnum.approved) {
    return notFound();
  }

  return <GaleriDetail product={product} className="py-26" />;
};

export default GaleriDetailPage;
