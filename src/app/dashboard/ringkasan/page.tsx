import { revalidatePath, revalidateTag } from "next/cache";
import { RefreshButton } from "./(components)/refresh-button";
import { TotalArticleCard } from "./(components)/total-article-card";
import {
  getTags,
  getTopArticle,
  getTotalArticle,
  getTotalProduct,
  getTotalTalent,
  getTotalUsers,
  getTotalCommunities,
  getTotalZhubPrograms,
} from "./(components)/action";
import { auth } from "@/auth";
import { TotalProductCard } from "./(components)/total-product-card";
import { TalentCard } from "./(components)/talent-card";
import { TopArticleCard } from "./(components)/top-article";
import { TotalTalentCard } from "./(components)/total-talent-card";
import { TotalUsersCard } from "./(components)/total-users-card";
import { TotalCommunitiesCard } from "./(components)/total-communities-card";
import { TotalZhubProgramsCard } from "./(components)/total-zhub-programs-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const RingkasanPage = async () => {
  const session = await auth();
  const [
    totalArticle,
    totalProduct,
    topArticle,
    totalTalent,
    totalUsers,
    totalCommunities,
    totalZhubPrograms,
    tags,
  ] = await Promise.all([
    getTotalArticle(session)(),
    getTotalProduct(session)(),
    getTopArticle(session)(),
    getTotalTalent(session)(),
    getTotalUsers(session)(),
    getTotalCommunities(session)(),
    getTotalZhubPrograms(session)(),
    getTags(session),
  ]);
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Ringkasan</CardTitle>
              <CardDescription className="text-sm">
                Lihat ringkasan data anda
              </CardDescription>
            </div>
            <form
              action={async () => {
                "use server";
                revalidatePath(`/dashboard/ringkasan`);
                for (const tag of tags) {
                  revalidateTag(tag);
                }
                revalidateTag(`detail-user:${session?.user.id}`);
              }}
            >
              <RefreshButton />
            </form>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Platform</CardTitle>
          <CardDescription>Ringkasan data keseluruhan platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TotalZhubProgramsCard
              className="col-span-1"
              data={totalZhubPrograms}
            />
            <TotalUsersCard className="col-span-1" data={totalUsers} />
            <TalentCard className="col-span-1" />
            <TotalTalentCard className="col-span-1" data={totalTalent} />
            <TotalCommunitiesCard
              className="col-span-1"
              data={totalCommunities}
            />
            <TotalProductCard className="col-span-1" data={totalProduct} />
            <TotalArticleCard className="col-span-1" data={totalArticle} />
          </div>
        </CardContent>
      </Card>

      {/* Top Articles Card */}
      <TopArticleCard className="w-full" data={topArticle} />
    </div>
  );
};

export default RingkasanPage;
