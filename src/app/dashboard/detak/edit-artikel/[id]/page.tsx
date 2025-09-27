import { FormArticle } from "@/app/dashboard/(components)/form-article";

const BuatArtikelDetakPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Detak</h1>
          <p className="text-muted-foreground text-sm">
            Kolom opini berbagai topik
          </p>
        </div>
      </div>
      <FormArticle type="detak" />
    </div>
  );
};

export default BuatArtikelDetakPage;
