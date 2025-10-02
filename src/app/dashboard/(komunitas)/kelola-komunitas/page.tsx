import { Role } from "@prisma/client";

import { checkPermission } from "@/actions/user";
import { TableCommunity } from "./(components)/table-community";
import {
  deleteCommunity,
  getAllCommunities,
  setCommunityStatus,
} from "@/actions/community";

const KelolaKomunitasPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const communities = await getAllCommunities();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Kelola Komunitas</h1>
          <p className="text-muted-foreground text-sm">
            Komunitas yang terdaftar di platform ini
          </p>
        </div>
      </div>
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
    </div>
  );
};

export default KelolaKomunitasPage;
