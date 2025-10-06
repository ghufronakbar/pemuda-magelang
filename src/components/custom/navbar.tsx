"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { APP_NAME, LOGO } from "@/constants";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import { Session } from "next-auth";

interface LinkItem {
  title: string;
  href: string | null;
  items: { title: string; href: string; description: string | null }[];
}

interface NavbarProps {
  session: Session | null;
  categoriesHubs: { label: string; href: string }[];
}

export function Navbar({ session, categoriesHubs }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardHref = "/dashboard";

  const LINK_ITEMS: LinkItem[] = [
    { title: "Beranda", href: "/", items: [] },
    { title: "Galeri", href: "/galeri", items: [] },
    {
      title: "Jejaring",
      href: null,
      items: [
        {
          title: "Talenta",
          href: "/talenta",
          description: "Talenta muda",
        },
        {
          title: "Komunitas",
          href: "/komunitas",
          description: "Komunitas kepemudaan",
        },
      ],
    },
    {
      title: "Townhall",
      href: null,
      items: [
        {
          title: "Detak",
          href: "/detak",
          description: "Kolom opini berbagai topik",
        },
        {
          title: "Gerak",
          href: "/gerak",
          description: "Jurnal giat kepemudaan",
        },
        {
          title: "Dampak",
          href: "/dampak",
          description: "Dampak kepemudaan",
        },
      ],
    },
    {
      title: "Zhub",
      href: null,
      items: categoriesHubs.map((item) => ({
        title: item.label,
        href: item.href,
        description: null,
      })),
    },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white",
        // smooth transition + subtle border/shadow
        "transition-all duration-300 border-b shadow-sm"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" aria-label="Beranda" className="flex items-center gap-2">
          <Image
            src={LOGO}
            alt="Logo"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="text-base font-semibold">{APP_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-4">
              {LINK_ITEMS.map((item, idx) => (
                <NavigationMenuItem key={idx}>
                  {/* Simple link (no children) */}
                  {item.href && item.items.length === 0 && (
                    <NavigationMenuLink
                      asChild
                      className={cn(
                      navigationMenuTriggerStyle(),
                      // modern minimal hover/active
                      "relative rounded-md bg-transparent text-foreground hover:text-primary hover:bg-primary/5",
                      "focus-visible:ring-2 focus-visible:ring-primary/20",
                      pathname === item.href && "text-primary bg-primary/5"
                      )}
                    >
                    <Link href={item.href} className="inline-block">
                      <span className="relative after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
                        {item.title}
                      </span>
                    </Link>
                    </NavigationMenuLink>
                  )}

                  {/* With children */}
                  {!item.href && item.items.length > 0 && (
                    <>
                    <NavigationMenuTrigger className="relative rounded-md bg-transparent text-foreground hover:text-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:text-primary data-[state=open]:bg-primary/5">
                      <span className="relative after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 data-[state=open]:after:w-full">
                        {item.title}
                      </span>
                      </NavigationMenuTrigger>
                    <NavigationMenuContent className="data-[motion=from-start]:animate-in data-[motion=from-start]:fade-in-0 data-[motion=from-start]:zoom-in-95 data-[motion=from-end]:animate-in data-[motion=from-end]:fade-in-0 data-[motion=from-end]:zoom-in-95">
                        <ul className="grid w-[260px] gap-2 p-3 md:w-[320px]">
                          {item.items.map((child, i) => (
                            <ListItem
                              key={`${child.title}-${i}`}
                              title={child.title}
                              href={child.href}
                            >
                              {child.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right: User area (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <UserMenuDesktop
              name={session.user.name ?? ""}
              email={session.user.email ?? ""}
              image={session.user.image ?? ""}
              dashboardHref={dashboardHref}
              pathname={pathname}
            />
          ) : (
            <Button variant="outline">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname ?? "")}`}
              >
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden">
          <MobileMenu
            open={open}
            setOpen={setOpen}
            pathname={pathname}
            dashboardHref={dashboardHref}
            session={session}
            itemLinks={LINK_ITEMS}
          />
        </div>
      </div>
    </header>
  );
}

/* ================= Desktop: User Menu ================= */

function UserMenuDesktop({
  name,
  email,
  image,
  dashboardHref,
  pathname,
}: {
  name: string;
  email: string;
  image: string;
  dashboardHref: string;
  pathname: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const initials = (name || email || "U").slice(0, 1).toUpperCase();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        className="group flex items-center gap-2 rounded-full p-1 outline-none transition"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Buka menu pengguna"
      >
        <p className="hidden text-sm font-medium sm:block">{name || email}</p>
        <Avatar className="h-9 w-9 ring-1 ring-border transition group-hover:ring-primary/40">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {name || "Pengguna"}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {email}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href={dashboardHref}
            className="flex w-full items-center gap-2"
            target="_blank"
          >
            <LayoutDashboard className="h-4 w-4" />

            <span className="!text-black">Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: pathname ?? "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ================= Mobile: Sheet ================= */

function MobileMenu({
  open,
  setOpen,
  pathname,
  dashboardHref,
  session,
  itemLinks,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  pathname: string | null;
  dashboardHref: string;
  session: Session | null;
  itemLinks: LinkItem[];
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Buka menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md outline-none transition-all duration-300 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85%] p-0">
        <SheetHeader className="items-start border-b px-4 pb-3 pt-4">
          <SheetTitle className="flex items-center gap-2">
            <Image
              src={LOGO}
              alt="Logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="text-base font-semibold">Menu</span>
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto p-2">
          <ul className="space-y-1">
            {itemLinks.map((item, idx) => {
              // Simple link
              if (item.href && item.items.length === 0) {
                const active = pathname === item.href;
                return (
                  <li key={`m-${idx}`}>
                  <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-4 py-3 text-sm hover:text-primary hover:bg-primary/5",
                        active && "text-primary"
                      )}
                    >
                      <span className="relative after:absolute after:left-4 after:bottom-[6px] after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-[calc(100%-2rem)]">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              }

              // With children -> Accordion
              return (
                <li key={`m-${idx}`}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${idx}`} className="border-b-0">
                      <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="pb-2 space-y-1">
                          {item.items.map((child, i) => {
                            const active = pathname === child.href;
                            return (
                              <li key={`m-${idx}-${i}`}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    "block rounded-md px-8 py-2.5 text-sm group hover:text-primary hover:bg-primary/5",
                                    active && "text-primary"
                                  )}
                                >
                                  <div className="font-medium relative after:absolute after:left-8 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-[calc(100%-2rem)]">
                                    {child.title}
                                  </div>
                                  {child.description && (
                                    <p
                                      className={cn(
                                        "text-xs text-muted-foreground group-hover:text-primary",
                                        active && "text-primary"
                                      )}
                                    >
                                      {child.description}
                                    </p>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </li>
              );
            })}

            {/* Mobile user area */}
            <li className="mt-2 border-t px-4 pt-3">
              {session?.user ? (
                <div className="flex items-center gap-3 pb-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image ?? ""} alt="User" />
                    <AvatarFallback>
                      {(session.user.name ?? "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {session.user.name}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(
                      pathname ?? ""
                    )}`}
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                </Button>
              )}
            </li>

            {/* Mobile actions */}
            {session?.user && (
              <li className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="secondary">
                    <Link
                      href={dashboardHref}
                      onClick={() => setOpen(false)}
                      target="_blank"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      signOut({
                        callbackUrl:
                          encodeURIComponent(pathname ?? "") ?? "/login",
                      })
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ============ Shared: List item untuk menu dropdown ============ */

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block rounded-md p-3 text-foreground transition-colors
                     hover:text-white
                     hover:[&>div]:text-white
                     hover:[&>p]:text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
