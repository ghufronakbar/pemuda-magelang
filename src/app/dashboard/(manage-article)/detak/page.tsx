import {
  deleteArticle,
  getArticles,
  setArticleStatus,
} from "@/actions/article";
import { ArticleTypeEnum, Role } from "@prisma/client";
import { TableArticle } from "../../(components)/table-article";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DetakPage = async () => {
  const [articles, user] = await Promise.all([getArticles(), auth()]);
  const isAdmin =
    user?.user.role === Role.admin || user?.user.role === Role.superadmin;

  const filteredArticles = articles
    .filter((item) => item.type === ArticleTypeEnum.detak)
    .filter((item) => {
      if (isAdmin) return true;
      else return item.userId === user?.user.id;
    });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Detak</CardTitle>
              <CardDescription className="text-sm">
                Kolom opini berbagai topik
              </CardDescription>
            </div>
            {!isAdmin && (
              <Button asChild>
                <Link href="/dashboard/detak/buat-artikel">
                  <Plus />
                  Buat Artikel
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Articles Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Artikel Detak</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Kelola dan monitor semua artikel detak yang terdaftar di platform" 
              : "Kelola artikel detak yang anda tulis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableArticle
            articles={filteredArticles}
            onSetStatus={async (slug, formData) => {
              "use server";
              await setArticleStatus(slug, formData);
            }}
            onDelete={async (slug) => {
              "use server";
              await deleteArticle(slug);
            }}
            type="detak"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetakPage;
