import { FormProfile } from "@/app/dashboard/(components)/profile/form-profile";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AkunPage = async () => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Pengaturan Akun</CardTitle>
              <CardDescription className="text-sm">
                Kelola informasi akun dan profil anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Form */}
      <FormProfile />
    </div>
  );
};

export default AkunPage;
