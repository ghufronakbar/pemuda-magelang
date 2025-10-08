// components/landing/zhub/hub-section.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Clock, PowerOff } from "lucide-react";
import { $Enums, HubStatusEnum } from "@prisma/client";
import { CdnImage } from "@/components/custom/cdn-image";

export interface HubSectionProps {
  title?: string;
  description?: string;
  hubs: HubCardProps[];
  limit?: number;
  viewAllHref?: string;
  className?: string;
}

export function HubSection({
  title = "Program Zhub",
  description = "Inisiatif dan dukungan untuk ekosistem kreatif Pemuda Magelang.",
  hubs,
  limit,
  viewAllHref,
  className,
}: HubSectionProps) {
  const data = hubs.slice(0, typeof limit === "number" ? limit : undefined);

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* decorative landing bg */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 rounded-full">
              Zhub
            </Badge>
            <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={viewAllHref}>Lihat semua →</Link>
            </Button>
          )}
        </div>

        {/* Horizontal carousel (mobile-first) */}
        <ScrollArea className="-mx-4">
          <div className="flex gap-4 px-4 py-2">
            {data.map((h) => (
              <div key={h.slug} className="w-[260px] sm:w-[300px]">
                <HubCard {...h} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Mobile CTA */}
        {viewAllHref && (
          <div className="mt-6 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={viewAllHref}>Lihat semua</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export interface HubCardProps {
  title: string;
  description: string;
  image: string | null;
  slug: string;
  status: $Enums.HubStatusEnum;
  className?: string;
}

export function HubCard({
  title,
  description,
  image,
  slug,
  status,
  className,
}: HubCardProps) {
  const s = STATUS[status];

  const content = (
    <Card
      className={cn(
        "group h-full overflow-hidden border-muted/60 bg-card/70 backdrop-blur transition-all hover:shadow-lg",
        className
      )}
    >
      {/* media */}
      <div className="relative aspect-[16/9] w-full">
        {image ? (
          <CdnImage
            uniqueKey={image}
            alt={`Program ${title}`}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-muted text-xs text-muted-foreground">
            No Image
          </div>
        )}

        {/* overlay + status */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-background/0 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge className={cn("gap-1 rounded-full px-2.5 py-0.5", s.badge)}>
            <s.icon className="h-3.5 w-3.5" />
            <span className="text-xs">{s.label}</span>
          </Badge>
        </div>
      </div>

      {/* body */}
      <CardHeader className="space-y-2">
        <h3 className="line-clamp-1 text-base font-semibold leading-snug">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>

      <CardContent />

      <CardFooter className="justify-end">
        <Button
          size="sm"
          variant={status === HubStatusEnum.active ? "default" : "outline"}
          disabled={status !== HubStatusEnum.active}
        >
          {status === HubStatusEnum.active
            ? "Lihat Program"
            : status === HubStatusEnum.soon
            ? "Segera Hadir"
            : "Tidak Aktif"}
        </Button>
      </CardFooter>
    </Card>
  );

  return status === HubStatusEnum.active ? (
    <Link href={"/zhub/" + slug} className="block">
      {content}
    </Link>
  ) : (
    <div className="block">{content}</div>
  );
}

const STATUS = {
  active: {
    label: "Aktif",
    icon: CheckCircle2,
    badge: "bg-emerald-600 text-emerald-50",
  },
  soon: {
    label: "Segera Hadir",
    icon: Clock,
    badge: "bg-amber-500 text-amber-50",
  },
  inactive: {
    label: "Tidak Aktif",
    icon: PowerOff,
    badge:
      "border border-muted-foreground/20 bg-background text-muted-foreground",
  },
} as const;
