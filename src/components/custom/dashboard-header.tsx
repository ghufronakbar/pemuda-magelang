"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Optional: map label yang lebih rapih untuk segmen tertentu */
const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  ringkasan: "Ringkasan",
  manajemen: "Manajemen Website",
  pengguna: "Manajemen Pengguna",
  talenta: "Manajemen Talent",
  admin: "Manajemen Admin",
  detak: "Detak",
  gerak: "Gerak",
  produk: "Produk",
  akun: "Pengaturan Akun",
  zhub: "Zhub",
};

function toTitle(s: string) {
  const clean = decodeURIComponent(s).replace(/[-_]/g, " ").trim();
  if (LABEL_MAP[s]) return LABEL_MAP[s];
  return clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function DashboardHeader() {
  const pathname = usePathname() || "/";
  const params = useParams();
  const id = params.id;
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => seg !== id);

  // Bangun crumbs: [{label, href}]
  let acc = "";
  const crumbs = segments.map((seg) => {
    acc += `/${seg}`;
    return { label: toTitle(seg), href: acc };
  });

  // Konfigurasi ellipsis: tampilkan Home + segmen pertama + "..." + halaman terakhir
  const shouldEllipsize = crumbs.length > 3;
  const first = crumbs[0];
  const last = crumbs[crumbs.length - 1];
  const hidden = shouldEllipsize ? crumbs.slice(1, -1) : [];

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-6" />

      <Breadcrumb>
        <BreadcrumbList>
          {/* Home */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {crumbs.length > 0 && <BreadcrumbSeparator />}

          {/* Jika path pendek, render semua segmen */}
          {!shouldEllipsize &&
            crumbs.map((c, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <FragmentWithSep key={c.href} showSep={!isLast}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{c.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={c.href}>{c.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </FragmentWithSep>
              );
            })}

          {/* Jika path panjang: Home / First / … / Last */}
          {shouldEllipsize && (
            <>
              {/* First */}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={first.href}>{first.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              {/* Ellipsis (dropdown untuk segmen tersembunyi) */}
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {hidden.map((h) => (
                      <DropdownMenuItem key={h.href} asChild>
                        <Link href={h.href}>{h.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              {/* Last (current page) */}
              <BreadcrumbItem>
                <BreadcrumbPage>{last.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

/* ========= Helper kecil untuk separator otomatis ========= */
function FragmentWithSep({
  children,
  showSep,
}: {
  children: React.ReactNode;
  showSep?: boolean;
}) {
  return (
    <>
      {children}
      {showSep && <BreadcrumbSeparator />}
    </>
  );
}
