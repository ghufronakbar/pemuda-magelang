import { Role } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ManajemenArtikelContent } from "./(components)/manajemen-artikel-content";

const ManajemenArtikelPage = async () => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Manajemen Artikel</CardTitle>
              <CardDescription className="text-sm">
                Kelola artikel Detak, Gerak, Dampak, dan Program Zhub dalam satu tempat
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Article Management Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Konten Artikel</CardTitle>
          <CardDescription>
            Kelola berbagai jenis artikel dan program yang tersedia di platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ManajemenArtikelContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManajemenArtikelPage;

