import { Metadata } from "next";
import { APP_NAME } from "@/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/ui/layouts/dashboard-layout";
import { FormProvider } from "@/providers/form-provider";

export const metadata: Metadata = {
  title: `${APP_NAME} - Dashboard`,
  description: "Dashboard",
};

const DashboardBaseLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <DashboardLayout session={session}>
      <FormProvider>{children}</FormProvider>
    </DashboardLayout>
  );
};

export default DashboardBaseLayout;
