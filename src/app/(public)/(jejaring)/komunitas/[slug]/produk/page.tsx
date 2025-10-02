import { getDetailTalent } from "@/actions/talent";
import { notFound } from "next/navigation";
import { TalentDetailProduct } from "./(components)/talent-product";
import { TalentStatusEnum } from "@prisma/client";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const talent = await getDetailTalent(slug)();
  return {
    title: "Produk " + talent?.name,
    description: talent?.description,
    openGraph: {
      title: "Produk " + talent?.name,
      description: talent?.description,
      images: talent?.profilePicture || talent?.bannerPicture,
    },
    twitter: {
      title: talent?.name,
      description: talent?.description,
      images: [talent?.profilePicture, talent?.bannerPicture],
    },
  };
}

const TalentProductPage = async ({ params }: Params) => {
  const { slug } = await params;
  const talent = await getDetailTalent(slug)();

  if (!talent || talent.status !== TalentStatusEnum.approved) {
    return notFound();
  }

  return <TalentDetailProduct talent={talent} className="py-26" />;
};

export default TalentProductPage;
