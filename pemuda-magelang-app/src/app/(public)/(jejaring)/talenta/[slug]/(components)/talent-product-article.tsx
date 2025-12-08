"use client";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { Button } from "@/components/ui/button";
import { Article, Product, Talent, User } from "@prisma/client";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleGridCard } from "@/components/article/grid/article-grid-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

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
  const [productQuery, setProductQuery] = useState("");
  const [articleQuery, setArticleQuery] = useState("");

  const normalized = (v: string | null | undefined) => (v ?? "").toLowerCase();

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const haystack = [
        normalized(p.title),
        normalized(p.description),
        normalized(p.category),
        normalized((p.tags || []).join(" ")),
      ].join(" ");
      return haystack.includes(q);
    });
  }, [products, productQuery]);

  const filteredArticles = useMemo(() => {
    const q = articleQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) => {
      const haystack = [
        normalized(a.title),
        normalized(a.content),
        normalized(a.category),
        normalized((a.tags || []).join(" ")),
      ].join(" ");
      return haystack.includes(q);
    });
  }, [articles, articleQuery]);

  const showShowAllButtonProducts = filteredProducts.length > LIMIT;
  const showShowAllButtonArticles = filteredArticles.length > LIMIT;
  const slicedProducts = filteredProducts.slice(0, LIMIT);
  const slicedArticles = filteredArticles.slice(0, LIMIT);
  return (
    <section className="">
      <Card>
        <CardHeader>
          <Reveal>
            <CardTitle className="text-xl">Karya Talenta</CardTitle>
          </Reveal>
          <Reveal delayMs={60}>
            <CardDescription>
              Jelajahi produk dan artikel dari {talent.name}. Gunakan pencarian untuk
              menemukan konten yang relevan.
            </CardDescription>
          </Reveal>
        </CardHeader>
        <CardContent>
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
              <Reveal>
              <div className="mb-4 relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Cari produk berdasarkan judul, kategori, atau tag..."
                  aria-label="Cari produk"
                  className="pl-9"
                />
              </div>
              </Reveal>
              {slicedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {slicedProducts.map((p, i) => (
                    <Reveal key={p.id} delayMs={i * 80}>
                      <GalleryCard
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
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {productQuery ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada produk."}
                </p>
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
              <Reveal>
              <div className="mb-4 relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={articleQuery}
                  onChange={(e) => setArticleQuery(e.target.value)}
                  placeholder="Cari artikel berdasarkan judul, kategori, atau tag..."
                  aria-label="Cari artikel"
                  className="pl-9"
                />
              </div>
              </Reveal>
              {slicedArticles.length ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {slicedArticles.map((a, i) => (
                    <Reveal key={a.id} delayMs={i * 80}>
                      <ArticleGridCard
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
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {articleQuery ? "Tidak ada artikel yang cocok dengan pencarian." : "Belum ada artikel."}
                </p>
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
        </CardContent>
      </Card>
    </section>
  );
};
