import { auth } from "@/auth";
import { LandingLayout } from "@/components/ui/layouts/landing-layout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return <LandingLayout session={session}>{children}</LandingLayout>;
}
