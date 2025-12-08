import { getDetailArticle } from "@/actions/article";
import { notFound } from "next/navigation";
import {
  ArticleDetail,
  ArticleDetailProps,
} from "./(components)/article-detail";
import { ArticleStatusEnum } from "@prisma/client";
import { auth } from "@/auth";
import { getIp } from "@/actions/helper";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const { data: article } = await getDetailArticle(slug, null, "")();
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
  const [user, ip] = await Promise.all([auth(), getIp()]);
  console.log("ip address", ip);
  const { data: article, likedStatus } = await getDetailArticle(
    slug,
    user,
    ip
  )();

  if (!article || article.status !== ArticleStatusEnum.published) {
    return notFound();
  }

  const mappedArticle: ArticleDetailProps["article"] = {
    ...article,
    likedStatus: likedStatus,
    comments: article.comments,
    author: {
      type: article.type,
      name: article.community?.name || article.user.name,
      image: article.community?.profilePicture || article.user.profilePicture,
      title:
        (article.type === "gerak"
          ? "Admin"
          : article.type === "dampak"
          ? article.community?.category
          : article.user.talent?.profession) || "Pengguna",
      slug:
        (article.type === "dampak"
          ? article.community?.slug
          : article.user.talent?.slug) || "",
      isTalent: article.user.talent !== null,
      isAdmin: article.user.role !== "user",
    },
  };

  return (
    <ArticleDetail article={mappedArticle} className="py-26" session={user} />
  );
};

export default DetailArtikelPage;
