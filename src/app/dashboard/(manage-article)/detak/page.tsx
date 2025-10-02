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
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Detak</h1>
          <p className="text-muted-foreground text-sm">
            Kolom opini berbagai topik
          </p>
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
    </div>
  );
};

export default DetakPage;
