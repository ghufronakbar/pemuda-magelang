import { FormAppData } from "../form-app-data";
import { checkPermission } from "@/actions/user";
import { Role } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getAllHubs } from "@/actions/zhub";
import { DataCategoryHub } from "../../(zhub)/(components)/(category)/table-zhub-category";

const ManajemenPage = async () => {
  await checkPermission([Role.superadmin]);
  const categories = await getAllHubs();
  const mappedCategories: DataCategoryHub[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    updatedAt: item.createdAt,
    active: item.hubs.filter((h) => h.status === "active").length,
    inactive: item.hubs.filter((h) => h.status === "inactive").length,
    soon: item.hubs.filter((h) => h.status === "soon").length,
  }));
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">
                Manajemen Website
              </CardTitle>
              <CardDescription className="text-sm">
                Manajemen website untuk memudahkan pengelolaan website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Website Management Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Website</CardTitle>
          <CardDescription>
            Kelola berbagai aspek website seperti hero section, tentang kami,
            branding, partner, media sosial, dan kategori Zhub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormAppData
            shows={[
              "hero",
              "about",
              "branding",
              "partners",
              "socials",
              "kategori-zhub",
            ]}
            categories={mappedCategories}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManajemenPage;
