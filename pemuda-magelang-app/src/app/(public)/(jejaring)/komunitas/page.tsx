import { getAllCommunities } from "@/actions/community";
import { CommunityCardProps } from "@/components/komunitas/community-card";
import { CommunitySection } from "@/components/komunitas/community-section";
import { CommunityStatusEnum } from "@prisma/client";

const KomunitasPage = async () => {
  const communities = await getAllCommunities();
  const mappedCommunities: CommunityCardProps[] = communities
    .filter((com) => com.status === CommunityStatusEnum.approved)
    .map((com) => {
      return {
        name: com.name,
        profileImage: com.profilePicture,
        bannerImage: com.bannerPicture,
        slug: com.slug,
        category: com.category,
        description: com.description || "",
      };
    });
  return <CommunitySection className="py-26" communities={mappedCommunities} />;
};

export default KomunitasPage;
