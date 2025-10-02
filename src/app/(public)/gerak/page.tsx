import { getArticles } from "@/actions/article";
import { ArticleCardProps } from "@/components/article/article-card";
import { ArticleSection } from "@/components/article/article-section";
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
      };
    });
  return <ArticleSection className="py-26" articles={mappedArticles} />;
};

export default ArtikelPage;
