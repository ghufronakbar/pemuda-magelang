// components/article-detail.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Article, User, Talent, Comment, Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import RichTextStyles from "@/components/editor/rich-text-styles";
import { ActionButtonArticle } from "./action-button-article";
import { likeArticle } from "@/actions/article";
import { toast } from "sonner";
import CommentSection from "./comment-section";
import { formatIDDate, getInitials } from "@/lib/helper";
import { Session } from "next-auth";

export interface CommentWithUser extends Comment {
  user: User;
}
export interface ArticleDetailProps {
  article: Article & {
    comments: CommentWithUser[];
    author: {
      type: "detak" | "gerak" | "dampak";
      name: string;
      image: string | null;
      title: string;
      slug: string;
      isTalent: boolean;
      isAdmin: boolean;
    };
    likedStatus: "yes" | "yet" | "unauthenticated";
    _count: {
      articleUserLikes: number;
      comments: number;
      trackViews: number;
    };
  };
  className?: string;
  session: Session | null;
}

export async function ArticleDetail({
  article,
  className,
  session,
}: ArticleDetailProps) {
  const {
    title,
    thumbnailImage,
    category,
    tags,
    content, // HTML yang sudah DISANITASI di server sebelum disimpan
    createdAt,
    _count,
    author,
  } = article;

  const authorName = author.name;
  const authorAvatar = author.image ?? "";
  const authorInitials = getInitials(authorName);
  const authorRoleOrProfession = author.title;
  const publishedDate = formatIDDate(createdAt);
  const reading = readingTimeFromHtml(content);

  const handleLikeArticle = async (formData: FormData) => {
    "use server";
    formData.append("slug", article.slug);
    const result = await likeArticle(formData);
    if (result.result) {
      switch (result.result) {
        case "like":
          toast?.success?.("Artikel berhasil disukai");
          break;
        case "unlike":
          toast?.success?.("Artikel berhasil tidak disukai");
          break;
      }
    } else if (result.error) {
      console.log(result.error);
      // toast.error("Terjadi kesalahan");
    }
  };

  const LinkOrNot = !author.isTalent || author.isAdmin ? "div" : Link;

  return (
    <section
      className={cn("mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* Header */}
      <section className="mb-6 w-full flex flex-row">
        <div className="flex items-center gap-3 w-full">
          <div className="flex flex-row justify-between flex-wrap w-full">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {category}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                {title}
              </h1>

              <LinkOrNot
                className="mt-4 flex items-center gap-3"
                href={`/${
                  author.type === "dampak"
                    ? "komunitas"
                    : author.type === "detak"
                    ? "talenta"
                    : "EXPECTED_ERROR"
                }/${encodeURIComponent(author.slug ?? "")}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {authorName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {authorRoleOrProfession} • {publishedDate} • {reading} •{" "}
                    {_count.trackViews}x dibaca
                  </div>
                </div>
              </LinkOrNot>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <ActionButtonArticle
                article={article}
                onLikeArticle={handleLikeArticle}
                session={session}
              />
            </div>
          </div>
        </div>
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
      <CommentSection article={article} className="mt-6" session={session} />
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
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
