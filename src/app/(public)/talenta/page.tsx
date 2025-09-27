import { getAllTalents } from "@/actions/talent";
import { TalentCardProps } from "@/components/talent/talent-card";
import { TalentSection } from "@/components/talent/talent-section";
import { TalentStatusEnum } from "@prisma/client";

const TalentaPage = async () => {
  const talents = await getAllTalents();
  const mappedTalents: TalentCardProps[] = talents
    .filter((talent) => talent.status === TalentStatusEnum.approved)
    .map((talent) => {
      return {
        name: talent.name,
        profileImage: talent.profilePicture,
        bannerImage: talent.bannerPicture,
        slug: talent.slug,
        profession: talent.profession,
        industry: talent.industry,
      };
    });
  return <TalentSection className="py-26" talents={mappedTalents} />;
};

export default TalentaPage;
