import { GalleryCard } from "@/components/gallery/gallery-card";
import { Button } from "@/components/ui/button";
import { Article, Product, Talent, User } from "@prisma/client";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleGridCard } from "@/components/article/grid/article-grid-card";

interface Props {
  products: Product[];
  talent: Talent;
  articles: DetailArticle[];
  user: User & {
    talent: Talent | null;
  };
}

interface DetailArticle extends Article {
  _count: {
    articleUserLikes: number;
    comments: number;
  };
}

export const TalentProductArticle = ({
  articles,
  products,
  talent,
  user,
}: Props) => {
  const LIMIT = 6;
  const showShowAllButtonProducts = products.length > LIMIT;
  const showShowAllButtonArticles = articles.length > LIMIT;
  const slicedProducts = products.slice(0, LIMIT);
  const slicedArticles = articles.slice(0, LIMIT);
  return (
    <section className="">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="products" className="p-4">
            Produk
          </TabsTrigger>
          <TabsTrigger value="articles" className="p-4">
            Artikel
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          {slicedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {slicedProducts.map((p) => (
                <GalleryCard
                  key={p.id}
                  author={{
                    image: talent.profilePicture,
                    name: talent.name,
                    profession: talent.profession,
                  }}
                  category={p.category}
                  description={p.description}
                  title={p.title}
                  image={p.images[0]}
                  tags={p.tags}
                  slug={p.slug}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada produk.</p>
          )}

          {showShowAllButtonProducts && (
            <div className="mt-6 w-fit mx-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/talenta/${talent.slug}/produk`}>Lihat semua</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="articles">
          {slicedArticles.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {slicedArticles.map((a) => (
                <ArticleGridCard
                  key={a.id}
                  author={{
                    name: user.name,
                    image: user.profilePicture,
                    profession: talent.profession,
                  }}
                  title={a.title}
                  thumbnail={a.thumbnailImage}
                  category={a.category}
                  content={a.content}
                  tags={a.tags}
                  slug={a.slug}
                  publishedAt={a.createdAt}
                  likesCount={a._count.articleUserLikes}
                  commentsCount={a._count.comments}
                  isTalent={true}
                  isCommunity={false}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
          )}

          {showShowAllButtonArticles && (
            <div className="mt-6 w-fit mx-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/talenta/${talent.slug}/artikel`}>
                  Lihat semua
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};
