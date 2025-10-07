// components/dashboard/app-sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { signOut as signOutClient } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  PanelsTopLeft,
  Users,
  FileText,
  Package,
  UserCog,
  LogOut,
  ArrowLeft,
  RocketIcon,
} from "lucide-react";
import { getInitials } from "@/lib/helper";
import { roleEnum } from "@/enum/role-enum";
import { Badge } from "../ui/badge";
import { Role } from "@prisma/client";

interface NavTree {
  section: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    roles: Role[];
  }[];
}

export function AppSidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const role = session?.user?.role;

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const NAV_TREES: NavTree[] = [
    {
      section: "Dashboard",
      items: [
        {
          label: "Ringkasan",
          href: "/dashboard/ringkasan",
          icon: LayoutDashboard,
          roles: [Role.superadmin, Role.admin, Role.user],
        },
        {
          label: "Manajemen Website",
          href: "/dashboard/manajemen",
          icon: PanelsTopLeft,
          roles: [Role.superadmin],
        },
        {
          label: "Manajemen Layanan",
          href: "/dashboard/halaman-konten",
          icon: FileText,
          roles: [Role.superadmin],
        },
      ],
    },
    {
      section: "Manajemen Pengguna",
      items: [
        {
          label: "Manajemen Pengguna",
          href: "/dashboard/manajemen-pengguna",
          icon: Users,
          roles: [Role.superadmin, Role.admin],
        },
        {
          label: "Produk",
          href: "/dashboard/produk",
          icon: Package,
          roles: [Role.user],
        },
      ],
    },
    {
      section: "Kelola Akun",
      items: [
        {
          label: "Kelola Akun",
          href: "/dashboard/komunitas",
          icon: RocketIcon,
          roles: [Role.user],
        },
      ],
    },
    {
      section: "Artikel",
      items: [
        {
          label: "Artikel",
          href: "/dashboard/manajemen-artikel",
          icon: FileText,
          roles: [Role.superadmin, Role.admin, Role.user],
        },
      ],
    },
    {
      section: "Lainnya",
      items: [
        {
          label: "Pengaturan Akun",
          href: "/dashboard/akun",
          icon: UserCog,
          roles: [Role.superadmin, Role.admin, Role.user],
        },
      ],
    },
  ];

  // const navTree = NAV_TREES;
  const navTree = NAV_TREES.map((tree) => {
    return {
      section: tree.section,
      items: tree.items.filter((item) =>
        item.roles.includes(role ?? Role.user)
      ),
    };
  }).filter((tree) => tree.items.length > 0);

  return (
    <Sidebar className="z-50" collapsible="icon">
      <SidebarHeader>
        {session?.user ? (
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user.image ?? ""}
                alt={session.user.name ?? ""}
              />
              <AvatarFallback>
                {getInitials(session.user.name ?? session.user.email ?? "U")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">
                {session.user.name ?? "Pengguna"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </div>
              <Badge className="text-2xs px-1 py-[0.5px]">
                {roleEnum.getLabel(session.user.role)}
              </Badge>
            </div>
          </div>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 p-2 text-sm hover:underline"
            title="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        {/* ===== Primary ===== */}
        {navTree.map((section) => (
          <SidebarGroup key={section.section}>
            <SidebarGroupLabel>{section.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <Item
                    key={item.href}
                    {...item}
                    active={isActive(item.href)}
                  />
                ))}
                {/* Add Logout to Lainnya section */}
                {section.section === "Lainnya" && (
                  <LogoutItem />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

/* ====== Logout Item helper ====== */
function LogoutItem() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => signOutClient({ callbackUrl: "/" })}
        tooltip={isCollapsed ? "Logout" : undefined}
        className="text-destructive hover:text-destructive data-[active=true]:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/* ====== Item helper ====== */
function Item({
  label,
  href,
  icon: Icon,
  active,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
}) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <SidebarMenuItem data-active={active}>
      <SidebarMenuButton
        asChild
        tooltip={isCollapsed ? label : undefined}
        className={cn(active && "bg-primary text-primary-foreground")}
      >
        <Link href={href}>
          <Icon className="mr-2 h-4 w-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
