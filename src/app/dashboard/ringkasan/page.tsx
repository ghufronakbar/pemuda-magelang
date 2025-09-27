import { revalidatePath, revalidateTag } from "next/cache";
import { RefreshButton } from "./(components)/refresh-button";
import { TotalArticleCard } from "./(components)/total-article-card";
import {
  getTags,
  getTopArticle,
  getTotalArticle,
  getTotalProduct,
  getTotalTalent,
} from "./(components)/action";
import { auth } from "@/auth";
import { TotalProductCard } from "./(components)/total-product-card";
import { TalentCard } from "./(components)/talent-card";
import { TopArticleCard } from "./(components)/top-article";
import { TotalTalentCard } from "./(components)/total-talent-card";

const RingkasanPage = async () => {
  const session = await auth();
  const [totalArticle, totalProduct, topArticle, totalTalent, tags] =
    await Promise.all([
      getTotalArticle(session)(),
      getTotalProduct(session)(),
      getTopArticle(session)(),
      getTotalTalent(session)(),
      getTags(session),
    ]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Ringkasan</h1>
          <p className="text-muted-foreground text-sm">
            Lihat ringkasan data anda
          </p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TotalArticleCard className="col-span-1" data={totalArticle} />
        <TotalProductCard className="col-span-1" data={totalProduct} />
        <TalentCard className="col-span-1" />
        <TotalTalentCard className="col-span-1" data={totalTalent} />
        <TopArticleCard className="col-span-2" data={topArticle} />
      </div>
    </div>
  );
};

export default RingkasanPage;
