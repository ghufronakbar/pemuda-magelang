import {
  deleteArticle,
  getArticles,
  setArticleStatus,
} from "@/actions/article";
import { ArticleTypeEnum, CommunityStatusEnum, Role } from "@prisma/client";
import { TableArticle } from "../../(components)/table-article";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDetailCommunityByUserId } from "@/actions/community";
import { CommunitySection } from "../../(komunitas)/komunitas/(components)/community-section";

const DampakPage = async () => {
  const [articles, user] = await Promise.all([getArticles(), auth()]);
  const isAdmin =
    user?.user.role === Role.admin || user?.user.role === Role.superadmin;
  const comm = await getDetailCommunityByUserId(user?.user.id ?? "")();
  const filteredArticles = articles
    .filter((item) => item.type === ArticleTypeEnum.dampak)
    .filter((item) => {
      if (isAdmin) return true;
      else return item.communityId === comm?.id;
    });

  const isApproved = comm?.status === CommunityStatusEnum.approved;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Dampak</h1>
          <p className="text-muted-foreground text-sm">Dampak kepemudaan</p>
        </div>
        {!isAdmin && isApproved && (
          <Button asChild>
            <Link href="/dashboard/dampak/buat-artikel">
              <Plus />
              Buat Artikel
            </Link>
          </Button>
        )}
      </div>
      {isApproved ? (
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
          type="dampak"
        />
      ) : (
        <CommunitySection showForm={false} />
      )}
    </div>
  );
};

export default DampakPage;
