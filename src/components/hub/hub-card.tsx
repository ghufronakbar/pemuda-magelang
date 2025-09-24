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
        "overflow-hidden transition-all",
        status === "active" && "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {/* Media */}
      <div className="relative aspect-[16/9] w-full bg-muted">
        {image ? (
          <Image
            src={image}
            alt={`Program ${title}`}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className={cn(
              "object-cover",
              status === "active" &&
                "transition-transform duration-300 group-hover:scale-[1.02]"
            )}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-muted to-muted-foreground/10">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        )}
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
        {status === "active" ? (
          <Button asChild size="sm">
            <Link href={slug} aria-label={`Buka program ${title}`}>
              Lihat Program
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="outline" disabled>
            {status === "soon" ? "Segera Hadir" : "Tidak Aktif"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  // Seluruh card bisa diklik jika status active
  if (status === "active") {
    return (
      <Link
        href={slug}
        aria-label={`Buka program ${title}`}
        className="group block"
      >
        {cardBody}
      </Link>
    );
  }

  return <div className="block">{cardBody}</div>;
}

/* ---------- Helpers ---------- */

function getStatusConfig(status: HubCardProps["status"]) {
  switch (status) {
    case "active":
      return {
        label: "Aktif",
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
        label: "Tidak Aktif",
        badgeClass:
          "border border-muted-foreground/20 bg-background text-muted-foreground",
        icon: PowerOff,
      };
  }
}
