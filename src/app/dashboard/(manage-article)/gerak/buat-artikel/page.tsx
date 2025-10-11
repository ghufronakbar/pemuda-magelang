import { TitleCard } from "../../(components)/title-card";
import { FormArticle } from "../../../(components)/form-article";

const BuatArtikelGerakPage = async () => {
  return (
    <div className="space-y-4">
      <TitleCard title="Gerak" description="Jurnal giat kepemudaan" />
      <FormArticle type="gerak" />
    </div>
  );
};

export default BuatArtikelGerakPage;
