import { ArticleListMap } from "@/components/article/list/article-list-map";
import { ArticleCardProps } from "@/components/article/type";
// import { Button } from "@/components/ui/button";
import { Talent, User } from "@prisma/client";
// import Link from "next/link";

interface CommunityArticleProps {
  articles: ArticleCardProps[];
  user: User & {
    talent: Talent | null;
  };
  showShowAllButton: boolean;
}

export const CommunityArticle = ({
  articles,
  // user,
  // showShowAllButton,
}: CommunityArticleProps) => {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold sm:text-xl">Artikel Populers</h2>
        {/* {showShowAllButton && (
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={`/talenta/${user.talent?.slug}/artikel`}>
              Lihat semua →
            </Link>
          </Button>
        )} */}
      </div>

      {articles.length ? (
        <ArticleListMap data={articles} />
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
      )}

      {/* {showShowAllButton && (
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/talenta/${user.talent?.slug}/artikel`}>
              Lihat semua
            </Link>
          </Button>
        </div>
      )} */}
    </section>
  );
};
