import { checkPermission } from "@/actions/user";
import { FormArticle } from "../../../(components)/form-article";
import { CommunityStatusEnum, Role } from "@prisma/client";
import { getDetailCommunityByUserId } from "@/actions/community";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TitleCard } from "../../(components)/title-card";

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
      <TitleCard title="Dampak" description="Dampak kepemudaan" />
      <FormArticle type="dampak" />
    </div>
  );
};

export default BuatArtikelDampakPage;
