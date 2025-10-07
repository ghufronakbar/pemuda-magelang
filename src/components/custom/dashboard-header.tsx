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
  "halaman-konten": "Manajemen Layanan",
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
    <header className="sticky top-0 z-50 flex h-16 md:h-14 items-center gap-3 md:gap-4 bg-background/95 backdrop-blur-md border-b px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="-ml-1 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md" />
      <Separator orientation="vertical" className="h-6 md:h-7 bg-border/60" />

      <Breadcrumb className="flex-1 overflow-hidden">
        <BreadcrumbList className="flex-nowrap">
          {/* Home */}
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {crumbs.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}

          {/* Jika path pendek, render semua segmen */}
          {!shouldEllipsize &&
            crumbs.map((c, idx) => {
              const isLast = idx === crumbs.length - 1;
              const isFirst = idx === 0;
              return (
                <FragmentWithSep key={c.href} showSep={!isLast}>
                  <BreadcrumbItem className={isFirst ? "block" : "hidden sm:block"}>
                    {isLast ? (
                      <BreadcrumbPage className="text-sm font-semibold text-foreground line-clamp-1">
                        {c.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={c.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors line-clamp-1">
                          {c.label}
                        </Link>
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
              <BreadcrumbItem className="block">
                <BreadcrumbLink asChild>
                  <Link href={first.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors line-clamp-1">
                    {first.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden sm:block" />

              {/* Ellipsis (dropdown untuk segmen tersembunyi) */}
              <BreadcrumbItem className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md p-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[200px]">
                    {hidden.map((h) => (
                      <DropdownMenuItem key={h.href} asChild>
                        <Link href={h.href} className="text-sm font-medium cursor-pointer">
                          {h.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden sm:block" />

              {/* Last (current page) */}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-semibold text-foreground line-clamp-1">
                  {last.label}
                </BreadcrumbPage>
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
      {showSep && <BreadcrumbSeparator className="hidden sm:block" />}
    </>
  );
}
