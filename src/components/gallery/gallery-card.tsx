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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  tags,
  slug,
  className,
}: GalleryCardProps) {
  const initials = getInitials(author.name);
  const { visible, restCount } = splitTags(tags, 3);

  return (
    <Link
      href={"/galeri/" + slug}
      aria-label={`Buka produk ${title}`}
      className="group block"
    >
      <Card
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5",
          className
        )}
      >
        {/* Media */}
        <div className="relative aspect-[16/9] w-full bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="space-y-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          {visible.map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="rounded-full border-dashed px-2.5 py-0.5 text-xs"
            >
              #{t}
            </Badge>
          ))}
          {restCount > 0 && (
            <Badge
              variant="outline"
              className="rounded-full px-2.5 py-0.5 text-xs"
              aria-label={`Dan ${restCount} tag lainnya`}
            >
              +{restCount}
            </Badge>
          )}
        </CardContent>

        {/* Footer: Author */}
        <CardFooter className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={author.image ?? ""} alt={author.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{author.name}</div>
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

function splitTags(all: string[], take: number) {
  const visible = all.slice(0, take);
  const restCount = Math.max(0, all.length - visible.length);
  return { visible, restCount };
}
