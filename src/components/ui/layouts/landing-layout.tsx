import { getAllHubs } from "@/actions/zhub";
import { Footer } from "@/components/custom/footer";
import { Navbar } from "@/components/custom/navbar";
import { getAppData } from "@/actions/app-data";
import { HubStatusEnum } from "@prisma/client";
import { Session } from "next-auth";

interface LandingLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export const LandingLayout = async ({
  children,
  session,
}: LandingLayoutProps) => {
  const [hubs, appData] = await Promise.all([getAllHubs(), getAppData()]);
  const mappedHubsLink: { label: string; href: string }[] = hubs
    .flatMap((item) =>
      item.hubs.map((item) => ({
        href: "/zhub/" + item.slug,
        label: item.name,
        status: item.status,
      }))
    )
    .filter((item) => item.status === HubStatusEnum.active)
    .slice(0, 3);

  const categoriesHubs = hubs.map((item) => ({
    label: item.name,
    href: "/zhub/kategori/" + item.id,
  }));
  return (
    <div className="w-full min-h-screen bg-gray-50 text-foreground">
      <Navbar session={session} categoriesHubs={categoriesHubs} />
      <div className="flex-1">{children}</div>
      <Footer
        zhubLinks={mappedHubsLink}
        socials={appData.appSocialMedias}
        bottomLinks={[
          { label: "Privasi", href: "/privacy" },
          { label: "Ketentuan", href: "/terms" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
    </div>
  );
};
