import { Role } from "@prisma/client";

import {
  DataTableUserTalent,
  TableUserTalent,
} from "../../(components)/table-user-talent";
import { checkPermission, deleteUser, getAllUsers } from "@/actions/user";
import { setStatusTalent } from "@/actions/talent";

const TalentaPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const users = await getAllUsers();

  const filteredUsers = users.filter(
    (item) => item.role === Role.user && item.talent
  );

  const mappedUsers: DataTableUserTalent[] = filteredUsers.map((item) => {
    return {
      id: item.id,
      image: item.profilePicture,
      email: item.email,
      industry: null,
      profession: null,
      publishedArticle: item._count.articles ?? 0,
      publishedProduct: item.talent?._count.products ?? 0,
      name: item.name,
      status: item.talent?.status || null,
      createdAt: item.createdAt,
      type: "talenta",
      role: item.role,
      isTalent: !!item.talent,
      subdistrict: item.subdistrict ?? "",
      village: item.village ?? "",
      street: item.street ?? "",
      slug: item.talent?.slug ?? null,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Talenta</h1>
          <p className="text-muted-foreground text-sm">
            Talenta yang terdaftar di platform ini
          </p>
        </div>
      </div>
      <TableUserTalent
        users={mappedUsers}
        onSetTalent={async (id, formData) => {
          "use server";
          await setStatusTalent(id, formData);
        }}
        onDelete={async (id) => {
          "use server";
          await deleteUser(id);
        }}
        type="talenta"
      />
    </div>
  );
};

export default TalentaPage;
