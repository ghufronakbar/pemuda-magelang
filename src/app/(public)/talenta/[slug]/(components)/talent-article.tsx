import { ArticleCard } from "@/components/article/article-card";
import { Button } from "@/components/ui/button";
import { Article, Talent, User } from "@prisma/client";
import Link from "next/link";

interface TalentArticleProps {
  articles: Article[];
  user: User & {
    talent: Talent | null;
  };
  showShowAllButton: boolean;
}

export const TalentArticle = ({
  articles,
  user,
  showShowAllButton,
}: TalentArticleProps) => {
  const profession =
    user.role === "user" ? user.talent?.profession || "Penulis" : "Admin";
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold sm:text-xl">Artikel Populers</h2>
        {showShowAllButton && (
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={`/talenta/${user.talent?.slug}/artikel`}>
              Lihat semua →
            </Link>
          </Button>
        )}
      </div>

      {articles.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              author={{
                name: user.name,
                image: user.profilePicture,
                profession: profession,
              }}
              title={a.title}
              thumbnail={a.thumbnailImage}
              category={a.category}
              content={a.content}
              tags={a.tags}
              slug={a.slug}
              publishedAt={a.createdAt}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
      )}

      {showShowAllButton && (
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/talenta/${user.talent?.slug}/artikel`}>
              Lihat semua
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};
