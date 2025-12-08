import { FormArticle } from "@/app/dashboard/(components)/form-article";
import { TitleCard } from "../../../(components)/title-card";

const BuatArtikelGerakPage = () => {
  return (
    <div className="space-y-4">
      <TitleCard title="Gerak" description="Jurnal giat kepemudaan" />
      <FormArticle type="gerak" />
    </div>
  );
};

export default BuatArtikelGerakPage;
