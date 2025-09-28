import { Role } from "@prisma/client";
import { checkPermission } from "@/actions/user";
import { deleteHub, getAllHubs } from "@/actions/zhub";
import { DataHub, TableZHub } from "../(components)/(hub-item)/table-zhub";
import { FormHub } from "../(components)/(hub-item)/form-zhub";

const ProgramZhubPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  const hubs = await getAllHubs();
  const programs = hubs.flatMap((h) => h.hubs);
  const mappedPrograms: DataHub[] = programs.map((item) => {
    const hubCategory = hubs.find((h) => h.id === item.hubCategoryId);
    if (hubCategory) {
      return {
        ...item,
        hubCategory: hubCategory,
      };
    } else {
      return {
        ...item,
        hubCategory: {
          id: "",
          name: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          hubs: [],
        },
      };
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Program Zhub</h1>
          <p className="text-muted-foreground text-sm">
            Program Zhub yang terdaftar di platform ini
          </p>
        </div>
        <FormHub categories={hubs} />
      </div>
      <TableZHub
        data={mappedPrograms}
        onDelete={async (id) => {
          "use server";
          await deleteHub(id);
        }}
      />
    </div>
  );
};

export default ProgramZhubPage;
