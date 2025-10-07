import { getArticles } from "@/actions/article";
import { ArticleCardProps } from "@/components/article/type";
import { ArticleListSection } from "@/components/article/list/article-list-section";
import {
  ArticleStatusEnum,
  ArticleTypeEnum,
  CommunityStatusEnum,
} from "@prisma/client";

const DampakPage = async () => {
  const articles = await getArticles();
  const mappedArticles: ArticleCardProps[] = articles
    .filter(
      (article) =>
        article.status === ArticleStatusEnum.published &&
        article.type === ArticleTypeEnum.dampak &&
        article.community?.status === CommunityStatusEnum.approved
    )
    .map((article) => {
      return {
        category: article.category,
        author: {
          image: article.user.profilePicture,
          name: article.user.name,
          profession:
            article.user.role === "user"
              ? article.user.talent?.profession ?? "Penulis"
              : "Admin",
        },
        content: article.content,
        publishedAt: article.createdAt,
        slug: article.slug,
        title: article.title,
        thumbnail: article.thumbnailImage,
        tags: article.tags,
        commentsCount: article._count.comments,
        likesCount: article._count.articleUserLikes,
        isCommunity: true,
        isTalent: false,
      };
    });
  return (
    <ArticleListSection
      className="py-26"
      articles={mappedArticles}
      title="Artikel Dampak"
      description="Dampak kepemudaan dari berbagai komunitas."
      type="dampak"
    />
  );
};

export default DampakPage;
