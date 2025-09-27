import { Role } from "@prisma/client";

import {
  DataTableUserTalent,
  TableUserTalent,
} from "../(components)/table-user-talent";
import { checkPermission, deleteUser, getAllUsers } from "@/actions/user";
import { setStatusTalent } from "@/actions/talent";

const PenggunaPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const users = await getAllUsers();

  const filteredUsers = users.filter((item) => item.role === Role.user);

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
      type: "pengguna",
      role: item.role,
      isTalent: !!item.talent,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Pengguna</h1>
          <p className="text-muted-foreground text-sm">
            Pengguna yang terdaftar di platform ini
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
        type="pengguna"
      />
    </div>
  );
};

export default PenggunaPage;
