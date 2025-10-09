import * as React from "react";
import { ArticleTypeEnum, CommunityStatusEnum, Role } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import {
  deleteArticle,
  getArticles,
  setArticleStatus,
} from "@/actions/article";
import { TableArticle } from "../../(components)/table-article";
import { getDetailCommunityByUserId } from "@/actions/community";
import { CommunitySection } from "../../(komunitas)/komunitas/(components)/community-section";
import { deleteHub, getAllHubs } from "@/actions/zhub";
import {
  DataHub,
  TableZHub,
} from "../../(zhub)/(components)/(hub-item)/table-zhub";
import { FormHub } from "../../(zhub)/(components)/(hub-item)/form-zhub";

export async function ManajemenArtikelContent({ tab }: { tab: string }) {
  const [articles, user, hubs] = await Promise.all([
    getArticles(),
    auth(),
    getAllHubs(),
  ]);

  const isAdmin =
    user?.user.role === Role.admin || user?.user.role === Role.superadmin;
  const comm = await getDetailCommunityByUserId(user?.user.id ?? "")();
  const isApproved = comm?.status === CommunityStatusEnum.approved;

  // Filter articles by type
  const detakArticles = articles.filter(
    (item) => item.type === ArticleTypeEnum.detak
  );
  const gerakArticles = articles
    .filter((item) => item.type === ArticleTypeEnum.gerak)
    .filter((item) => {
      if (isAdmin) return true;
      else return item.userId === user?.user.id;
    });

  const dampakArticles = articles
    .filter((item) => item.type === ArticleTypeEnum.dampak)
    .filter((item) => {
      if (isAdmin) return true;
      else return item.communityId === comm?.id;
    });

  // Map Zhub programs
  const programs = hubs.flatMap((h) => h.hubs);
  const mappedPrograms: DataHub[] = programs.map((item) => {
    const hubCategory = hubs.find((h) => h.id === item.hubCategoryId);
    if (hubCategory) {
      return {
        ...item,
        hubCategory: hubCategory,
      };
    } else {
      return {
        ...item,
        hubCategory: {
          id: "",
          name: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          hubs: [],
        },
      };
    }
  });

  // Determine which tabs to show based on role
  const showDetak = isAdmin; // Cuma admin (artikel admin)
  const showGerak = true; // Semua (artikel user)
  const showDampak = true; // Semua (artikel komunitas)
  const showZhub = isAdmin; // Only admin

  return (
    <Tabs defaultValue={tab || "gerak"} className="w-full">
      <TabsList
        className={`grid w-full ${isAdmin ? "grid-cols-4" : "grid-cols-2"}`}
      >
        {showGerak && <TabsTrigger value="gerak">Gerak</TabsTrigger>}
        {showDetak && <TabsTrigger value="detak">Detak</TabsTrigger>}
        {showDampak && <TabsTrigger value="dampak">Dampak</TabsTrigger>}
        {showZhub && <TabsTrigger value="zhub">Program Zhub</TabsTrigger>}
      </TabsList>

      {/* Gerak Tab */}
      {showGerak && (
        <TabsContent value="gerak" className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Daftar Artikel Gerak</h4>
                {!isAdmin && (
                  <Button asChild>
                    <Link href="/dashboard/gerak/buat-artikel">
                      <Plus />
                      Buat Artikel
                    </Link>
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {isAdmin
                  ? "Kelola dan monitor semua artikel detak yang terdaftar di platform"
                  : "Kelola artikel detak yang anda tulis"}
              </p>
              <TableArticle
                articles={gerakArticles}
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
          </div>
        </TabsContent>
      )}

      {/* Detak Tab */}
      {showDetak && (
        <TabsContent value="detak" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {isAdmin && (
                <Button asChild>
                  <Link href="/dashboard/detak/buat-artikel">
                    <Plus />
                    Buat Artikel
                  </Link>
                </Button>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Daftar Artikel Detak</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Kelola dan monitor jurnal giat kepemudaan yang dibuat oleh admin
              </p>
              <TableArticle
                articles={detakArticles}
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
          </div>
        </TabsContent>
      )}

      {/* Dampak Tab */}
      {showDampak && (
        <TabsContent value="dampak" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {!isAdmin && isApproved && (
                <Button asChild>
                  <Link href="/dashboard/dampak/buat-artikel">
                    <Plus />
                    Buat Artikel
                  </Link>
                </Button>
              )}
            </div>
            <div>
              {isApproved || isAdmin ? (
                <>
                  <h4 className="text-sm font-medium mb-2">
                    Daftar Artikel Dampak
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    {isAdmin
                      ? "Kelola dan monitor semua artikel dampak dari komunitas"
                      : "Kelola artikel dampak komunitas anda"}
                  </p>
                  <TableArticle
                    articles={dampakArticles}
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
                </>
              ) : (
                <CommunitySection />
              )}
            </div>
          </div>
        </TabsContent>
      )}

      {/* Program Zhub Tab */}
      {showZhub && (
        <TabsContent value="zhub" className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Daftar Program Zhub</h4>
                <FormHub categories={hubs} />
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Kelola dan monitor program-program Zhub yang tersedia untuk
                pengguna
              </p>
              <TableZHub
                data={mappedPrograms}
                onDelete={async (id) => {
                  "use server";
                  await deleteHub(id);
                }}
              />
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
