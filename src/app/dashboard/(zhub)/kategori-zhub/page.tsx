import { Role } from "@prisma/client";
import { checkPermission } from "@/actions/user";
import {
  DataCategoryHub,
  TableZHubCategory,
} from "../(components)/(category)/table-zhub-category";
import { deleteCategoryHub, getAllHubs } from "@/actions/zhub";

const KategoriZhubPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const categories = await getAllHubs();
  const mappedCategories: DataCategoryHub[] = categories.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
      active: item.hubs.filter((h) => h.status === "active").length,
      inactive: item.hubs.filter((h) => h.status === "inactive").length,
      soon: item.hubs.filter((h) => h.status === "soon").length,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Kategori Zhub</h1>
        <p className="text-muted-foreground text-sm">
          Kategori Zhub yang terdaftar di platform ini
        </p>
      </div>
      <TableZHubCategory
        data={mappedCategories}
        onDelete={async (id) => {
          "use server";
          await deleteCategoryHub(id);
        }}
      />
    </div>
  );
};

export default KategoriZhubPage;
