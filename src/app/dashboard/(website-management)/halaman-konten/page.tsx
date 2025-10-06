import { FormAppData } from "../form-app-data";
import { checkPermission } from "@/actions/user";
import { Role } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ManajemenLayananPage = async () => {
  await checkPermission([Role.superadmin]);
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Manajemen Layanan</CardTitle>
              <CardDescription className="text-sm">
                Kelola halaman privasi, ketentuan, dan FAQ website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Service Management Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Halaman Layanan</CardTitle>
          <CardDescription>
            Kelola konten halaman penting website seperti kebijakan privasi, syarat dan ketentuan, serta FAQ untuk pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormAppData shows={["privacy", "terms", "faq"]} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManajemenLayananPage;
