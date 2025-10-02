import { auth } from "@/auth";
import { ArticleFilterProvider } from "@/components/article/filter/article-filter-context";
import { LandingLayout } from "@/components/ui/layouts/landing-layout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <ArticleFilterProvider>
      <LandingLayout session={session}>{children}</LandingLayout>
    </ArticleFilterProvider>
  );
}
