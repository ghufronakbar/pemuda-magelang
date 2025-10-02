import {
  deleteArticle,
  getArticles,
  setArticleStatus,
} from "@/actions/article";
import { Role } from "@prisma/client";
import { TableArticle } from "../../(components)/table-article";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { checkPermission } from "@/actions/user";

const GerakPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const [articles, user] = await Promise.all([getArticles(), auth()]);
  const isAdmin =
    user?.user.role === Role.admin || user?.user.role === Role.superadmin;
  const filteredArticles = articles.filter(
    (item) => item.user.role !== Role.user
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Gerak</h1>
          <p className="text-muted-foreground text-sm">
            Jurnal giat kepemudaan
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/gerak/buat-artikel">
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
        type="gerak"
      />
    </div>
  );
};

export default GerakPage;
