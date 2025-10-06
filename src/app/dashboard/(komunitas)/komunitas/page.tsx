import { checkPermission } from "@/actions/user";
import { KomunitasContent } from "./(components)/komunitas-content";
import { Role } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const KomunitasPage = async () => {
  await checkPermission([Role.user]);
  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Kelola Akun</CardTitle>
              <CardDescription className="text-sm">
                Kelola informasi komunitas dan data talenta anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Content */}
      <KomunitasContent />
    </div>
  );
};

export default KomunitasPage;
