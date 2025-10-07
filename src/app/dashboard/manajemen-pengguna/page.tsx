import { Role } from "@prisma/client";
import { checkPermission } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ManajemenPenggunaContent } from "./(components)/manajemen-pengguna-content";

const ManajemenPenggunaPage = async () => {
  await checkPermission([Role.superadmin, Role.admin]);
  
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Manajemen Pengguna</CardTitle>
              <CardDescription className="text-sm">
                Kelola pengguna, talent, admin, komunitas, dan produk dalam satu tempat
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Management Content Card */}
      <Card>
        
        <CardContent>
          <ManajemenPenggunaContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManajemenPenggunaPage;

