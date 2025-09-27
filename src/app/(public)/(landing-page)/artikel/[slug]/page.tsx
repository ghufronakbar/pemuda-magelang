import { getDetailArticle } from "@/actions/article";
import { notFound } from "next/navigation";
import { ArticleDetail } from "./(components)/article-detail";
import { ArticleStatusEnum } from "@prisma/client";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const article = await getDetailArticle(slug)();
  return {
    title: article?.title,
    description: article?.content,
    openGraph: {
      title: article?.title,
      description: article?.content,
      images: article?.thumbnailImage,
    },
    twitter: {
      title: article?.title,
      description: article?.content,
      images: article?.thumbnailImage,
    },
  };
}

const DetailArtikelPage = async ({ params }: Params) => {
  const { slug } = await params;
  const article = await getDetailArticle(slug)();

  if (!article || article.status !== ArticleStatusEnum.published) {
    return notFound();
  }

  return <ArticleDetail article={article} className="py-26" />;
};

export default DetailArtikelPage;
