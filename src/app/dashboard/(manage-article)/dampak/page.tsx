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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Dampak</CardTitle>
              <CardDescription className="text-sm">Dampak kepemudaan</CardDescription>
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
        </CardHeader>
      </Card>

      {/* Content Card */}
      {isApproved ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Artikel Dampak</CardTitle>
            <CardDescription>
              {isAdmin 
                ? "Kelola dan monitor semua artikel dampak dari komunitas" 
                : "Kelola artikel dampak komunitas anda"}
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
              type="dampak"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <CommunitySection showForm={false} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DampakPage;
