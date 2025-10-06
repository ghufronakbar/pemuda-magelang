import { ArticleListMap } from "@/components/article/list/article-list-map";
import { ArticleCardProps } from "@/components/article/type";
// import { Button } from "@/components/ui/button";
import { Talent, User } from "@prisma/client";
// import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

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
      <Card>
        <CardHeader className="pb-0">
          <Reveal>
            <CardTitle className="text-lg sm:text-xl">Artikel Populers</CardTitle>
          </Reveal>
        </CardHeader>
        <CardContent className="pt-4">
          {articles.length ? (
            <Reveal>
              <ArticleListMap data={articles} />
            </Reveal>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
          )}
        </CardContent>
      </Card>

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
