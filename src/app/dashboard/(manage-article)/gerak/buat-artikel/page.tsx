import { FormArticle } from "../../../(components)/form-article";

const BuatArtikelGerakPage = async () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Gerak</h1>
          <p className="text-muted-foreground text-sm">
            Jurnal giat kepemudaan
          </p>
        </div>
      </div>
      <FormArticle type="gerak" />
    </div>
  );
};

export default BuatArtikelGerakPage;
