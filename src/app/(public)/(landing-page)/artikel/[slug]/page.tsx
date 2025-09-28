import { getDetailArticle } from "@/actions/article";
import { notFound } from "next/navigation";
import {
  ArticleDetail,
  ArticleDetailProps,
} from "./(components)/article-detail";
import { ArticleStatusEnum } from "@prisma/client";
import { auth } from "@/auth";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const user = await auth();
  const { data: article } = await getDetailArticle(slug, null)();
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
  const user = await auth();
  const { data: article, likedStatus } = await getDetailArticle(slug, user)();

  if (!article || article.status !== ArticleStatusEnum.published) {
    console.log("Article not found");
    console.log(article);
    return notFound();
  }

  const mappedArticle: ArticleDetailProps["article"] = {
    ...article,
    likedStatus: likedStatus,
    comments: article.comments,
    user: {
      ...article.user,
      talent: article.user.talent ?? null,
    },
  };

  // return <div className="py-40">{article.content}</div>;

  return (
    <ArticleDetail article={mappedArticle} className="py-26" session={user} />
  );
};

export default DetailArtikelPage;
