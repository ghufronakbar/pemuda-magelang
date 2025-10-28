import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CdnImage, cdnUrl } from "../custom/cdn-image";

export interface TalentCardProps {
  name: string;
  profileImage: string | null;
  bannerImage: string | null;
  slug: string;
  profession: string;
  industry: string;
  className?: string;
}

export function TalentCard({
  name,
  profileImage,
  bannerImage,
  slug,
  profession,
  industry,
  className,
}: TalentCardProps) {
  const initials = getInitials(name);
  const headerLine = `${name} • ${profession}`;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {/* Banner */}
      <div className="relative h-24 w-full bg-muted sm:h-28">
        {bannerImage ? (
          <CdnImage
            uniqueKey={bannerImage}
            alt={`Banner ${name}`}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <CardContent className="pt-4">
        {/* Header row: Avatar overlap + single-line text */}
        <div className="-mt-8 flex items-center gap-3">
          <Avatar className="h-16 w-16 shrink-0 ring-2 ring-background shadow-sm">
            <AvatarImage
              src={cdnUrl(profileImage ?? "")}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {/* Single line: name • profession */}
          <h3
            className="min-w-0 flex-1 truncate text-base flex flex-col"
            title={headerLine}
            aria-label={headerLine}
          >
            <span className="font-semibold">{name}</span>
            <span className="font-normal text-muted-foreground">
              {profession}
            </span>
          </h3>
        </div>

        {/* Badge di bawah */}
        <div className="mt-3">
          <Badge variant="secondary" className="shrink-0">
            {industry}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="hidden text-xs text-muted-foreground sm:block" />
        <Button asChild size="sm" className="ml-auto">
          <Link href={"/talenta/" + encodeURIComponent(slug)} aria-label={`Lihat profil ${name}`}>
            Lihat Profil
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/* Helpers */
function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}
