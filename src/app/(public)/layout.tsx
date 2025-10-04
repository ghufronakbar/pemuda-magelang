import { auth } from "@/auth";
import { FilterProvider } from "@/components/filter/filter-context";
import { LandingLayout } from "@/components/ui/layouts/landing-layout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <FilterProvider>
      <LandingLayout session={session}>{children}</LandingLayout>
    </FilterProvider>
  );
}
