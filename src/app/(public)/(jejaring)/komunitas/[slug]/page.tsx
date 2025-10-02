import { notFound } from "next/navigation";
import {
  CommunityDetail,
  CommunityDetailProps,
} from "./(components)/community-detail";
import { getDetailCommunityBySlug } from "@/actions/community";
import { CommunityStatusEnum } from "@prisma/client";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const community = await getDetailCommunityBySlug(slug)();
  return {
    title: community?.name,
    description: community?.description,
    openGraph: {
      title: community?.name,
      description: community?.description,
      images: community?.profilePicture || community?.bannerPicture,
    },
    twitter: {
      title: community?.name,
      description: community?.description,
      images: [community?.profilePicture, community?.bannerPicture],
    },
  };
}

const TalentDetailPage = async ({ params }: Params) => {
  const { slug } = await params;
  const community = await getDetailCommunityBySlug(slug)();

  if (!community || community.status !== CommunityStatusEnum.approved) {
    return notFound();
  }
  const mappedData: CommunityDetailProps = {
    data: {
      ...community,
      articles: community.articles.map((article) => ({
        category: article.category,
        title: article.title,
        content: article.content,
        tags: article.tags,
        slug: article.slug,
        author: {
          name: community.name,
          image: community.profilePicture,
          profession: community.category,
        },
        thumbnail: article.thumbnailImage,
        publishedAt: article.createdAt,
        likesCount: article._count.articleUserLikes,
        commentsCount: article._count.comments,
        image: article.thumbnailImage,
        isTalent: true,
        isCommunity: false,
      })),
    },
  };

  return <CommunityDetail data={mappedData.data} className="py-26" />;
};

export default TalentDetailPage;
