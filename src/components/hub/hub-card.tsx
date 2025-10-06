// components/hub-card.tsx
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, PowerOff } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/constants";

export interface HubCardProps {
  title: string;
  description: string;
  image: string | null;
  slug: string;
  status: "active" | "inactive" | "soon";
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
  const statusCfg = getStatusConfig(status);

  const cardBody = (
    <Card
      className={cn(
        "overflow-hidden transition-all h-full flex flex-col",
        "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {/* Media */}
      <div className="relative aspect-[16/9] w-full bg-muted">
        <Image
          src={image || PLACEHOLDER_IMAGE}
          alt={`Program ${title}`}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className={cn(
            "object-cover",
            "transition-transform duration-300 group-hover:scale-[1.02]"
          )}
          priority={false}
        />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <Badge
            variant="secondary"
            className={cn(
              "gap-1 rounded-full px-2.5 py-0.5",
              statusCfg.badgeClass
            )}
            title={statusCfg.label}
          >
            <statusCfg.icon className="h-3.5 w-3.5" />
            <span className="text-xs">{statusCfg.label}</span>
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="space-y-2 flex-1 min-h-[96px] sm:min-h-[110px]">
        <h3 className="line-clamp-1 text-base font-semibold leading-snug">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>

      <CardContent />

      <CardFooter className="justify-end mt-auto">
        <Button asChild size="sm">
          <Link href={"/zhub/" + slug} aria-label={`Buka program ${title}`}>
            Lihat Program
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Link
      href={"/zhub/" + slug}
      aria-label={`Buka program ${title}`}
      className="group block"
    >
      {cardBody}
    </Link>
  );
}

/* ---------- Helpers ---------- */

function getStatusConfig(status: HubCardProps["status"]) {
  switch (status) {
    case "active":
      return {
        label: "Sedang Berlangsung",
        badgeClass:
          "border-transparent bg-emerald-600 text-emerald-50 hover:bg-emerald-600",
        icon: CheckCircle2,
      };
    case "soon":
      return {
        label: "Segera Hadir",
        badgeClass:
          "border-transparent bg-amber-500 text-amber-50 hover:bg-amber-500",
        icon: Clock,
      };
    default:
      return {
        label: "Telah Berakhir",
        badgeClass:
          "border border-muted-foreground/20 bg-background text-muted-foreground",
        icon: PowerOff,
      };
  }
}
