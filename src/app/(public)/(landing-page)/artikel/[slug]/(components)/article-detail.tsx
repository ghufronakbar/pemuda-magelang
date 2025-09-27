// components/article-detail.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Article, User, Talent } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import RichTextStyles from "@/components/editor/rich-text-styles";

export interface ArticleDetailProps {
  article: Article & {
    user: User & {
      talent: Talent | null;
    };
  };
  className?: string;
}

export function ArticleDetail({ article, className }: ArticleDetailProps) {
  const {
    title,
    thumbnailImage,
    category,
    tags,
    content, // HTML yang sudah DISANITASI di server sebelum disimpan
    createdAt,
    views,
    user,
  } = article;

  const authorName = user.name;
  const authorAvatar = user.profilePicture ?? "";
  const authorInitials = getInitials(authorName);
  const authorRoleOrProfession =
    user.talent?.profession ?? capitalize(user.role);
  const publishedDate = formatDate(createdAt);
  const reading = readingTimeFromHtml(content);

  return (
    <section
      className={cn("mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* Header */}
      <section className="mb-6">
        {user.talent ? (
          <Link href={`/talenta/${user.talent?.slug}`}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {category}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              {title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{authorName}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {authorRoleOrProfession} • {publishedDate} • {reading} •{" "}
                  {views}x dibaca
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {category}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              {title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{authorName}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {authorRoleOrProfession} • {publishedDate} • {reading} •{" "}
                  {views}x dibaca
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Thumbnail */}
      {thumbnailImage ? (
        <div className="mb-6 overflow-hidden rounded-2xl border bg-muted">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={thumbnailImage}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, 768px"
              className="object-cover"
              priority={false}
            />
          </div>
        </div>
      ) : null}

      <RichTextStyles
        content={content}
        className="!prose !prose-neutral !max-w-none !!w-full"
      />

      {/* Tags */}
      {tags?.length ? (
        <>
          <Separator className="my-6" />
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="rounded-full px-2.5 py-0.5 text-xs"
              >
                #{t}
              </Badge>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

/* ========== Helpers ========== */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (a + b).toUpperCase();
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(d: Date | string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(d));
  } catch {
    return "";
  }
}

// Estimasi waktu baca (200 wpm)
function readingTimeFromHtml(html: string, wpm = 200) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(words / wpm));
  return `${minutes} menit baca`;
}
