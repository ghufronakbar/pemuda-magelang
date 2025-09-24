// components/article-card.tsx
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

export interface ArticleCardProps {
  title: string;
  thumbnail: string | null;
  category: string;
  content: string; // HTML string
  tags: string[];
  author: {
    name: string;
    image: string | null;
    profession: string;
  };
  slug: string;
  publishedAt: Date;
  className?: string;
}

export function ArticleCard({
  title,
  thumbnail,
  category,
  content,
  tags,
  author,
  slug,
  publishedAt,
  className,
}: ArticleCardProps) {
  const initials = getInitials(author.name);
  const { visible, restCount } = splitTags(tags, 3);
  const excerpt = excerptFromHtml(content, 150);
  const dateStr = formatDate(publishedAt);

  return (
    <Link
      href={slug}
      aria-label={`Baca artikel: ${title}`}
      className="group block"
    >
      <Card
        className={cn(
          "overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg",
          className
        )}
      >
        {/* Media */}
        <div className="relative aspect-[16/9] w-full bg-muted">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardHeader className="space-y-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-snug">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {excerpt}
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
            >
              +{restCount}
            </Badge>
          )}
        </CardContent>

        {/* Footer / Byline */}
        <CardFooter className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={author.image ?? ""}
                alt={author.name}
                className="object-cover"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{author.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {author.profession} • {dateStr}
              </div>
            </div>
          </div>
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

/* ===== Helpers ===== */

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

function excerptFromHtml(html: string, max = 140) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
}

function formatDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(d));
  } catch {
    return "";
  }
}
