import { Role } from "@prisma/client";

import { checkPermission } from "@/actions/user";
import { TableCommunity } from "./(components)/table-community";
import {
  deleteCommunity,
  getAllCommunities,
  setCommunityStatus,
} from "@/actions/community";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const KelolaKomunitasPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const communities = await getAllCommunities();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Kelola Komunitas</CardTitle>
              <CardDescription className="text-sm">
                Komunitas yang terdaftar di platform ini
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Community Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Komunitas</CardTitle>
          <CardDescription>
            Kelola dan monitor komunitas yang terdaftar di platform, serta persetujuan status komunitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableCommunity
            communities={communities}
            onSetStatus={async (id, formData) => {
              "use server";
              await setCommunityStatus(id, formData);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteCommunity(id);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KelolaKomunitasPage;
