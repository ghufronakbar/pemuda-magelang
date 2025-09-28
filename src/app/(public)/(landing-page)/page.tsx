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
  HubStatusEnum,
  PartnerTypeEnum,
} from "@prisma/client";
import { getAllHubs } from "@/actions/zhub";
import { getArticles } from "@/actions/article";

const LandingPage = async () => {
  const [articles, hubs, appData] = await Promise.all([
    getArticles(),
    getAllHubs(),
    getAppData(),
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
  return (
    <main>
      <HeroSection
        className="min-h-screen flex flex-col justify-center"
        stats={appData.heroItems}
        title={appData.heroTitle}
        subtitle={appData.heroDescription}
        heroImage={appData.heroImage}
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
