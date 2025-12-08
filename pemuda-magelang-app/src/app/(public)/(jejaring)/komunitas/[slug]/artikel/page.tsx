import { getDetailTalent } from "@/actions/talent";
import { notFound } from "next/navigation";
import { ArticleStatusEnum } from "@prisma/client";
import { TalentDetailArticle } from "./(components)/talent-article";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const talent = await getDetailTalent(slug)();
  return {
    title: talent?.name ? `Artikel ${talent?.name}` : "Tidak Ditemukan",
    description: talent?.description,
    openGraph: {
      title: talent?.name ? `Artikel ${talent?.name}` : "Tidak Ditemukan",
      description: talent?.description,
      images: talent?.profilePicture || talent?.bannerPicture,
    },
    twitter: {
      title: talent?.name ? `Artikel ${talent?.name}` : "Tidak Ditemukan",
      description: talent?.description,
      images: [talent?.profilePicture, talent?.bannerPicture],
    },
  };
}

const TalentArticlePage = async ({ params }: Params) => {
  const { slug } = await params;
  const talent = await getDetailTalent(slug)();

  if (!talent) {
    return notFound();
  }
  talent.user.articles = talent.user.articles.filter(
    (article) => article.status === ArticleStatusEnum.published
  );

  return <TalentDetailArticle talent={talent} className="py-26" />;
};

export default TalentArticlePage;
