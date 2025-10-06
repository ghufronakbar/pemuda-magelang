import { Role } from "@prisma/client";
import { checkPermission } from "@/actions/user";
import { deleteHub, getAllHubs } from "@/actions/zhub";
import { DataHub, TableZHub } from "../(components)/(hub-item)/table-zhub";
import { FormHub } from "../(components)/(hub-item)/form-zhub";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Program Zhub</CardTitle>
              <CardDescription className="text-sm">
                Program Zhub yang terdaftar di platform ini
              </CardDescription>
            </div>
            <FormHub categories={hubs} />
          </div>
        </CardHeader>
      </Card>

      {/* Programs Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Program Zhub</CardTitle>
          <CardDescription>
            Kelola dan monitor program-program Zhub yang tersedia untuk pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableZHub
            data={mappedPrograms}
            onDelete={async (id) => {
              "use server";
              await deleteHub(id);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramZhubPage;
