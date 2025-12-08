import type { Session } from "next-auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { DashboardHeader } from "@/components/custom/dashboard-header";

interface DashboardLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export function DashboardLayout({ children, session }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset className="w-2">
        {/* Top bar */}
        <DashboardHeader />

        {/* Page content */}
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
