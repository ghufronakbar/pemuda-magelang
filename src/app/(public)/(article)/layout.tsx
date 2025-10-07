import { FormProvider } from "@/providers/form-provider";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormProvider>{children}</FormProvider>;
}
