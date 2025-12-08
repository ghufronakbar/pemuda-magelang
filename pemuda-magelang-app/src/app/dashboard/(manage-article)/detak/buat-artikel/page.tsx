import { FormArticle } from "../../../(components)/form-article";
import { TitleCard } from "../../(components)/title-card";

const BuatArtikelDetakPage = () => {
  return (
    <div className="space-y-4">
      <TitleCard title="Detak" description="Kolom opini berbagai topik" />
      <FormArticle type="detak" />
    </div>
  );
};

export default BuatArtikelDetakPage;
