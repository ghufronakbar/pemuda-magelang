import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CdnImage, cdnUrl } from "../custom/cdn-image";

export interface GalleryCardProps {
  title: string;
  image: string;
  category: string;
  description: string;
  author: {
    name: string;
    image: string | null;
    profession: string;
  };
  tags: string[];
  slug: string; // pass full path, e.g. "/gallerys/awesome-gallery"
  className?: string;
}

export function GalleryCard({
  title,
  image,
  category,
  description,
  author,
  // tags removed from visual card
  slug,
  className,
}: GalleryCardProps) {
  const initials = getInitials(author.name);
  // tags hidden on card per request

  return (
    <Link
      href={"/galeri/" + slug}
      aria-label={`Buka produk ${title}`}
      className="group block"
    >
      <Card
        className={cn(
          "overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 h-full flex flex-col",
          className
        )}
      >
        {/* Media */}
        <div className="relative aspect-[16/9] w-full bg-muted">
          <CdnImage
            uniqueKey={image}
            alt={title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            priority={false}
          />
          <div className="absolute left-3 top-3">
            <Badge
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ring-1 ring-black/5",
                getCategoryColorClasses(category)
              )}
            >
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="space-y-2 flex-1 min-h-[96px] sm:min-h-[110px]">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground/90">
            {description}
          </p>
        </CardHeader>

        {/* Footer: Author */}
        <CardFooter className="flex items-center justify-between pt-0 mt-auto">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9 ring-1 ring-border">
              <AvatarImage src={cdnUrl(author.image ?? "")} alt={author.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium tracking-tight">
                {author.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {author.profession}
              </div>
            </div>
          </div>

          {/* Subtle CTA chevron */}
          <span
            aria-hidden
            className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

/* ——— Helpers ——— */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

// Deterministic color per category using a small predefined palette
function getCategoryColorClasses(category: string) {
  const palette = [
    "bg-emerald-500 text-white",
    "bg-sky-500 text-white",
    "bg-amber-500 text-white",
    "bg-violet-500 text-white",
    "bg-rose-500 text-white",
    "bg-lime-600 text-white",
    "bg-cyan-600 text-white",
    "bg-fuchsia-600 text-white",
  ];
  const index = hashString(category) % palette.length;
  return palette[index];
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // force 32-bit
  }
  return Math.abs(hash);
}
