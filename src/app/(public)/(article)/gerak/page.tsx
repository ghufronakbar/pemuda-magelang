import { getArticles } from "@/actions/article";
import { ArticleCardProps } from "@/components/article/type";
import { ArticleGridSection } from "@/components/article/grid/article-grid-section";
import { ArticleTypeEnum, Role } from "@prisma/client";
import { ArticleStatusEnum } from "@prisma/client";

const ArtikelPage = async () => {
  const articles = await getArticles();
  const mappedArticles: ArticleCardProps[] = articles
    .filter(
      (article) =>
        article.status === ArticleStatusEnum.published &&
        (article.user.role === Role.admin ||
          article.user.role === Role.superadmin) &&
        article.type === ArticleTypeEnum.gerak
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
        likesCount: article._count.articleUserLikes,
        commentsCount: article._count.comments,
        isCommunity: false,
        isTalent: true,
      };
    });
  return (
    <ArticleGridSection
      className="py-26"
      articles={mappedArticles}
      title="Artikel Gerak"
      description="Jurnal giat kepemudaan"
    />
  );
};

export default ArtikelPage;
