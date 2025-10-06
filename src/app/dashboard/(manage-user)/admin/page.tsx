import { Role } from "@prisma/client";

import {
  DataTableUserTalent,
  TableUserTalent,
} from "../../(components)/table-user-talent";
import { checkPermission, deleteUser, getAllUsers } from "@/actions/user";
import { setStatusTalent } from "@/actions/talent";
import { FormAdmin } from "../../(components)/form-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminPage = async () => {
  await checkPermission([Role.superadmin]);
  const users = await getAllUsers();

  const filteredUsers = users.filter((item) => item.role !== Role.user);

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
      type: "admin",
      role: item.role,
      isTalent: false,
      subdistrict: item.subdistrict ?? "",
      village: item.village ?? "",
      street: item.street ?? "",
      slug: null,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Admin</CardTitle>
              <CardDescription className="text-sm">
                Admin yang terdaftar di platform ini
              </CardDescription>
            </div>
            <FormAdmin />
          </div>
        </CardHeader>
      </Card>

      {/* Admin Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Admin</CardTitle>
          <CardDescription>
            Kelola admin dan super admin yang memiliki akses ke dashboard manajemen
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            type="admin"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
