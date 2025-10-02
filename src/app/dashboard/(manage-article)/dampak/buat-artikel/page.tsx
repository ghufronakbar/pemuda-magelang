import { checkPermission } from "@/actions/user";
import { FormArticle } from "../../../(components)/form-article";
import { CommunityStatusEnum, Role } from "@prisma/client";
import { getDetailCommunityByUserId } from "@/actions/community";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const BuatArtikelDampakPage = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, user] = await Promise.all([checkPermission([Role.user]), auth()]);
  const comm = await getDetailCommunityByUserId(user?.user.id ?? "")();
  const isApproved = comm?.status === CommunityStatusEnum.approved;
  if (!isApproved) {
    redirect("/dashboard/dampak");
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Dampak</h1>
          <p className="text-muted-foreground text-sm">Dampak kepemudaan</p>
        </div>
      </div>
      <FormArticle type="dampak" />
    </div>
  );
};

export default BuatArtikelDampakPage;
