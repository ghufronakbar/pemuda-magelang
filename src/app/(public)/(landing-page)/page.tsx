import { HubCardProps, HubSection } from "./(section)/hub-section";
import { AboutSection } from "./(section)/about-section";
import { HeroSection } from "./(section)/hero-section";
import { ArticleSectionLanding } from "./(section)/article-section-landing";
import { PartnerSection } from "./(section)/partner-section";
import { MenuSection } from "./(section)/menu-section";
import { BrandingSection } from "./(section)/branding-section";
import { ArticleCardProps } from "@/components/article/article-card";
import { getAppData } from "@/actions/app-data";
import {
  ArticleStatusEnum,
  CommunityStatusEnum,
  HubStatusEnum,
  PartnerTypeEnum,
  TalentStatusEnum,
} from "@prisma/client";
import { getAllHubs } from "@/actions/zhub";
import { getArticles } from "@/actions/article";
import { getAllTalents } from "@/actions/talent";
import { getAllCommunities } from "@/actions/community";

const LandingPage = async () => {
  const [articles, appData, talents, communities, hubs] = await Promise.all([
    getArticles(),
    getAppData(),
    getAllTalents(),
    getAllCommunities(),
    getAllHubs(),
  ]);
  const mappedArticles: ArticleCardProps[] = articles
    .filter((article) => article.status === ArticleStatusEnum.published)
    .map((article) => {
      return {
        category: article.category,
        author: {
          image: article.user.profilePicture,
          name: article.user.name,
          profession:
            article.user.role === "user"
              ? article.user.talent?.profession ?? "Penulis"
              : "Admin",
        },
        content: article.content,
        publishedAt: article.createdAt,
        slug: article.slug,
        title: article.title,
        thumbnail: article.thumbnailImage,
        tags: article.tags,
      };
    });
  const mappedHubs: HubCardProps[] = hubs
    .flatMap((h) => h.hubs)
    .filter((hub) => hub.status === HubStatusEnum.active)
    .map((hub) => {
      return {
        title: hub.name,
        description: hub.description,
        image: hub.image,
        slug: hub.slug,
        status: hub.status,
      };
    });

  const supported = appData.partners.filter(
    (partner) => partner.type === PartnerTypeEnum.supported
  );
  const collabs = appData.partners.filter(
    (partner) => partner.type === PartnerTypeEnum.collaborator
  );
  const medias = appData.partners.filter(
    (partner) => partner.type === PartnerTypeEnum.media
  );
  const countTalent = talents.filter(
    (talent) => talent.status === TalentStatusEnum.approved
  ).length;
  const countCommunity = communities.filter(
    (community) => community.status === CommunityStatusEnum.approved
  ).length;
  const countZhub = hubs
    .flatMap((h) => h.hubs)
    .filter((hub) => hub.status === HubStatusEnum.active).length;
  return (
    <main>
      <HeroSection
        className="min-h-screen flex flex-col justify-center"
        title={appData.heroTitle}
        subtitle={appData.heroDescription}
        heroImage={appData.heroImage}
        countTalent={countTalent}
        countCommunity={countCommunity}
        countZhub={countZhub}
      />
      <AboutSection
        className="py-26 min-h-screen"
        title={appData.aboutTitle}
        description={appData.aboutDescription}
        image={appData.aboutImage}
        highlights={appData.aboutItems}
      />
      <BrandingSection
        title={appData.brandingTitle}
        url={appData.brandingVideo}
        description={appData.brandingDescription}
        className="py-26"
      />
      <MenuSection className="min-h-[calc(100vh-200px)] flex flex-col justify-center" />
      <HubSection viewAllHref="/zhub" className="py-10" hubs={mappedHubs} />
      <ArticleSectionLanding
        viewAllHref="/detak"
        className="py-10"
        articles={mappedArticles}
      />
      <PartnerSection
        supportedPartners={supported}
        collaborators={collabs}
        mediaPartners={medias}
        speedSeconds={{ supported: 28, collaborators: 34, media: 30 }}
        className="py-26"
      />
    </main>
  );
};

export default LandingPage;
