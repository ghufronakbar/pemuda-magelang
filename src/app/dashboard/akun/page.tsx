import { FormProfile } from "@/app/dashboard/(components)/profile/form-profile";

const AkunPage = async () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Akun</h1>
          <p className="text-muted-foreground text-sm">Informasi akun anda</p>
        </div>
      </div>
      <FormProfile />
    </div>
  );
};

export default AkunPage;
