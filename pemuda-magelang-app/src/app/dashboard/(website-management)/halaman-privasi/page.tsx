import { FormAppData } from "../form-app-data";
import { checkPermission } from "@/actions/user";
import { Role } from "@prisma/client";

const HalamanPrivasiPage = async () => {
  await checkPermission([Role.superadmin]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Halaman Privasi</h1>
          <p className="text-muted-foreground text-sm">
            Halaman privasi yang akan ditampilkan di website
          </p>
        </div>
      </div>
      <FormAppData shows={["privacy"]} zhubCategories={[]} />
    </div>
  );
};

export default HalamanPrivasiPage;
