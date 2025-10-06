// removed HubSection
// import { HubCardProps, HubSection } from "./(section)/hub-section";
import { AboutSection } from "./(section)/about-section";
import { HeroSection } from "./(section)/hero-section";
// removed ArticleSectionLanding
// import { ArticleSectionLanding } from "./(section)/article-section-landing";
import { PartnerSection } from "./(section)/partner-section";
import { MenuSection } from "./(section)/menu-section";
import { BrandingSection } from "./(section)/branding-section";
import { getAppData } from "@/actions/app-data";
import { getAllTalents } from "@/actions/talent";
import { getAllCommunities } from "@/actions/community";

const LandingPage = async () => {
  const [appData, talents, communities] = await Promise.all([
    getAppData(),
    getAllTalents(),
    getAllCommunities(),
  ]);

  type PartnerLite = { type?: string };
  type HasStatus = { status?: string };

  const supported = appData.partners.filter(
    (partner: PartnerLite) => partner?.type === "supported"
  );
  const collabs = appData.partners.filter(
    (partner: PartnerLite) => partner?.type === "collaborator"
  );
  const medias = appData.partners.filter(
    (partner: PartnerLite) => partner?.type === "media"
  );
  const countTalent = talents.filter(
    (talent: HasStatus) => talent?.status === "approved"
  ).length;
  const countCommunity = communities.filter(
    (community: HasStatus) => community?.status === "approved"
  ).length;
  const countZhub = 0;

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
      {/** Zhub and Article sections removed from homepage as requested */}
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
