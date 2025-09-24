import { HubSection } from "./(section)/hub-section";
import { AboutSection } from "./(section)/about-section";
import { HeroSection } from "./(section)/hero-section";
import { ArticleSectionLanding } from "./(section)/article-section-landing";
import { PartnerSection, type PartnerItem } from "./(section)/partner-section";
import { LOGO } from "@/constants";
import { MenuSection } from "./(section)/menu-section";
import { BrandingSection } from "./(section)/branding-section";

const supported: PartnerItem[] = [
  {
    name: "Pemkot Magelang",
    href: "https://magelangkota.go.id/",
    image: LOGO,
  },
  {
    name: "Disbudpar",
    href: "#",
    image: "https://pngimg.com/uploads/mcdonalds/mcdonalds_PNG17.png",
  },
  {
    name: "Bank Jateng",
    href: "#",
    image:
      "https://upload.wikimedia.org/wikipedia/id/thumb/c/c4/Bank_Jateng_logo.svg/1200px-Bank_Jateng_logo.svg.png",
  },
];

const collabs: PartnerItem[] = [
  {
    name: "Komunitas Fotografi",
    href: "#",
    image:
      "https://komunitassemutfoto.com/wp-content/uploads/2025/03/LOGO-2D.gif",
  },
  {
    name: "Studio Desain",
    href: "#",
    image:
      "https://png.pngtree.com/png-vector/20230523/ourmid/pngtree-photo-studio---a-photography-logo-design-vector-png-image_7107703.png",
  },
  {
    name: "Haystudio",
    href: "#",
    image:
      "https://media.licdn.com/dms/image/v2/D5616AQGNyQRHMZcxXg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1724563314006?e=1761782400&v=beta&t=K8ff5PXRyxhuchPbCt1uEpYY2FUiOs8-mIldn2DMbZY",
  },
  {
    name: "Postmatic",
    href: "#",
    image: "https://postmatic.id/logo-bg-blue-ico.ico",
  },
];

const medias: PartnerItem[] = [
  {
    name: "Garuda FM",
    href: "#",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_Radio_Garuda_FM.png",
  },
  {
    name: "Magelang News",
    href: "#",
    image:
      "https://scontent.fsub3-2.fna.fbcdn.net/v/t39.30808-6/240395137_2620141134958192_4692591651212229701_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=fUQYgQx--cQQ7kNvwH8jLBV&_nc_oc=AdmGnNgHtKNH4-SLeKH4FAli6__DLpZfwI2RW4E_MACfDHdqSs5HTN8mikmoD-kF-28&_nc_zt=23&_nc_ht=scontent.fsub3-2.fna&_nc_gid=kPJ2dYRqF2fn1uuBp-G3fw&oh=00_AfaZstiNOIyRdXk2xaw1ZSGooeLRYiO3l0bRhXg4pVSlkQ&oe=68DA24D3",
  },
  {
    name: "Lestari",
    href: "#",
    image: "https://lestarikehati.com/logo.png",
  },
];
const LandingPage = () => {
  return (
    <main>
      <HeroSection className="min-h-screen flex flex-col justify-center" />
      <AboutSection className="py-26 min-h-screen" />
      <BrandingSection
        title="Peresmian Pemuda Magelang"
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=43s"
        className="py-26"
      />
      <MenuSection className="min-h-[calc(100vh-200px)] flex flex-col justify-center" />
      <HubSection viewAllHref="/zhub" className="py-10" />
      <ArticleSectionLanding viewAllHref="/artikel" className="py-10" />
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
