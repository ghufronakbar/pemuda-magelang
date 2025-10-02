import { checkPermission } from "@/actions/user";
import { CommunitySection } from "./(components)/community-section";
import { Role } from "@prisma/client";

const KomunitasPage = async () => {
  await checkPermission([Role.user]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Komunitas</h1>
          <p className="text-muted-foreground text-sm">
            Informasi komunitas anda
          </p>
        </div>
      </div>
      <CommunitySection />
    </div>
  );
};

export default KomunitasPage;
