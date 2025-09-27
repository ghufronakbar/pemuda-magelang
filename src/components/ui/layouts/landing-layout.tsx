import { getAllHubs } from "@/actions/hub";
import { Footer } from "@/components/custom/footer";
import { Navbar } from "@/components/custom/navbar";
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
  const hubs = await getAllHubs();
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
  return (
    <div className="w-full min-h-screen bg-gray-50 text-foreground">
      <Navbar session={session} />
      <div className="flex-1">{children}</div>
      <Footer zhubLinks={mappedHubsLink} />
    </div>
  );
};
