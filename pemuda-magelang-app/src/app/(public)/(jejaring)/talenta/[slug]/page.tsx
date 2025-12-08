import { getDetailTalent } from "@/actions/talent";
import { notFound } from "next/navigation";
import { TalentDetail } from "./(components)/talent-detail";
import { ArticleStatusEnum, TalentStatusEnum } from "@prisma/client";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const talent = await getDetailTalent(slug)();
  return {
    title: talent?.name,
    description: talent?.description,
    openGraph: {
      title: talent?.name,
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

const TalentDetailPage = async ({ params }: Params) => {
  const { slug } = await params;
  const talent = await getDetailTalent(slug)();

  if (!talent || talent.status !== TalentStatusEnum.approved) {
    return notFound();
  }
  talent.user.articles = talent.user.articles.filter(
    (article) => article.status === ArticleStatusEnum.published
  );

  return <TalentDetail talent={talent} className="py-26" />;
};

export default TalentDetailPage;
