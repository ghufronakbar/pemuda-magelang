import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Star, BadgeCheck } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { formatIDDate } from "@/lib/helper";
import { ArticleCardProps } from "../type";
import { FiHeart } from "react-icons/fi";
import { FaComment } from "react-icons/fa";
import { CdnImage, cdnUrl } from "@/components/custom/cdn-image";

export function ArticleListCard({
  title,
  thumbnail,
  content,
  author,
  slug,
  publishedAt,
  likesCount,
  commentsCount,
  className,
  category,
  isTalent,
}: ArticleCardProps) {
  const initials = getInitials(author.name);

  const subtitle = firstSentenceOrExcerpt(content, 140);

  return (
    <div className={cn("relative", className)}>
      {/* baris item */}
      <Link
        className={cn(
          "flex flex-col md:flex-row gap-4 p-4 justify-between",
          "border-b"
        )}
        href={`/artikel/${slug}`}
        aria-label={`Baca artikel: ${title}`}
      >
        <div className="w-full md:w-1/2 lg:w-2/3">
          {/* Kiri: teks */}
          <div className="block min-w-0">
            {/* Penulis */}
            <div className="mb-2 flex items-center gap-2 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={cdnUrl(author.image ?? "")}
                  alt={author.name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{author.name}</span>

              {isTalent && (
                <Badge
                  variant="outline"
                  className="ml-0.5 flex items-center gap-1 rounded-full px-1.5 py-0 text-[10px]"
                >
                  <BadgeCheck className="h-3 w-3 text-sky-500" />
                </Badge>
              )}
            </div>

            {/* Judul */}
            <h3
              className={cn(
                "text-2xl font-extrabold leading-tight tracking-tight",
                "sm:text-3xl"
              )}
            >
              {title}
            </h3>
            <span className="text-sm text-muted-foreground">
              <Badge className="rounded-full px-1.5 py-0 text-[10px]">
                {category}
              </Badge>
            </span>

            {/* Subjudul / teaser */}

            <p className="mt-2 text-base text-muted-foreground line-clamp-2">
              {subtitle}
            </p>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                {formatIDDate(publishedAt)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FiHeart className="h-4 w-4 fill-current text-red-500" />
                {formatCompact(likesCount)}
              </span>

              {typeof commentsCount === "number" && (
                <span className="inline-flex items-center gap-1.5">
                  <FaComment className="h-4 w-4 text-sky-500" />
                  {formatCompact(commentsCount)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 h-full !aspect-video object-cover bg-gray-100 overflow-hidden rounded-lg">
          <CdnImage
            uniqueKey={thumbnail || PLACEHOLDER_IMAGE}
            alt={title}
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
      </Link>
    </div>
  );
}

/* ========== Helpers ========== */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (a + b).toUpperCase();
}

function firstSentenceOrExcerpt(html: string, max = 140) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  // ambil kalimat pertama bila pendek
  const period = text.indexOf(".");
  if (period > 0 && period < max) return text.slice(0, period + 1);
  // fallback: potong rapi
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trim()}…`;
}

function formatCompact(n: number) {
  // 14400 -> 14.4K
  try {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return String(n);
  }
}
