import { getArticles } from "@/actions/article";
import { ArticleCardProps } from "@/components/article/type";
import { ArticleStatusEnum, ArticleTypeEnum } from "@prisma/client";
import { ArticleGridSection } from "@/components/article/grid/article-grid-section";

const ArtikelDetakPage = async () => {
  const articles = await getArticles();
  const mappedArticles: ArticleCardProps[] = articles
    .filter(
      (article) =>
        article.status === ArticleStatusEnum.published &&
        article.type === ArticleTypeEnum.detak
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
        isCommunity: false,
        isTalent: article.user.talent !== null,
      };
    });
  return (
    <ArticleGridSection
      className="py-26"
      articles={mappedArticles}
      title="Artikel Detak"
      description="Opini dari berbagai berita."
      type="detak"
    />
  );
};

export default ArtikelDetakPage;
