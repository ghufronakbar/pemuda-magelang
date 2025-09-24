"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Menu } from "lucide-react";
import { APP_NAME, LOGO } from "@/constants";
import { cn } from "@/lib/utils";

interface LinkItem {
  title: string;
  href: string | null;
  items: {
    title: string;
    href: string;
    description: string | null;
  }[];
}

const LINK_ITEMS: LinkItem[] = [
  {
    title: "Beranda",
    href: "/",
    items: [],
  },
  {
    title: "Galeri",
    href: "/galeri",
    items: [],
  },
  {
    title: "Talenta",
    href: "/talenta",
    items: [],
  },
  {
    title: "Townhall",
    href: null,
    items: [
      {
        title: "Forum Diskusi",
        href: "/diskusi",
        description: "Forum diskusi untuk membahas berbagai topik.",
      },
      {
        title: "Artikel",
        href: "/artikel",
        description: "Artikel untuk membahas berbagai topik.",
      },
    ],
  },
  {
    title: "Zhub",
    href: "/zhub",
    items: [],
  },
  // {
  //   title: "Zhub",
  //   href: null,
  //   items: [
  //     {
  //       title: "Program Layanan Produksi Kegiatan Kebudayaan",
  //       href: "/program-abc-todo-nanti-ini-dinamis",
  //       description: null,
  //     },
  //     {
  //       title: "Program Layanan Produksi Kegiatan Kebudayaan",
  //       href: "/program-abc-todo-nanti-ini-dinamis",
  //       description: null,
  //     },
  //     {
  //       title: "Program Layanan Produksi Kegiatan Kebudayaan",
  //       href: "/program-abc-todo-nanti-ini-dinamis",
  //       description: null,
  //     },
  //   ],
  // },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                        "bg-transparent hover:bg-accent/50",
                        pathname === item.href && "text-primary"
                      )}
                    >
                      <Link href={item.href}>{item.title}</Link>
                    </NavigationMenuLink>
                  )}

                  {/* With children */}
                  {!item.href && item.items.length > 0 && (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
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

        {/* Right: User avatar */}
        <div className="hidden md:flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Buka menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
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
                  {LINK_ITEMS.map((item, idx) => {
                    // Simple link
                    if (item.href && item.items.length === 0) {
                      const active = pathname === item.href;
                      return (
                        <li key={`m-${idx}`}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-md px-4 py-3 text-sm hover:bg-accent",
                              active && "bg-accent text-primary"
                            )}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    }

                    // With children -> Accordion
                    return (
                      <li key={`m-${idx}`}>
                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value={`item-${idx}`}
                            className="border-b-0"
                          >
                            <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="pb-2">
                                {item.items.map((child, i) => {
                                  const active = pathname === child.href;
                                  return (
                                    <li key={`m-${idx}-${i}`}>
                                      <Link
                                        href={child.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                          "block px-8 py-2.5 text-sm hover:bg-accent",
                                          active && "bg-accent text-primary"
                                        )}
                                      >
                                        <div className="font-medium">
                                          {child.title}
                                        </div>
                                        {child.description && (
                                          <p className="text-muted-foreground text-xs">
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

                  {/* Mobile avatar row */}
                  <li className="mt-2 border-t px-4 pt-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="User"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">John Doe</div>
                        <div className="text-muted-foreground">
                          john@example.com
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

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
          className="block rounded-md p-3 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug mt-1">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
