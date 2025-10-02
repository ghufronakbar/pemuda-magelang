"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import type { ArticleDetailProps } from "./article-detail";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

function LikeSubmitButton({
  liked,
  article,
  session,
}: {
  liked: "yes" | "yet" | "unauthenticated";
  article: ArticleDetailProps["article"];
  session: Session | null;
}) {
  const { pending } = useFormStatus();

  const pathname = usePathname();
  if (!session) {
    return (
      <Button variant="outline" size="icon" type="button" asChild>
        <Link href={`/login?redirect=${pathname}`}>
          <FaRegHeart className="h-4 w-4" />
        </Link>
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      size="icon"
      type="submit"
      disabled={pending || article.likedStatus === "unauthenticated"}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : liked === "yes" ? (
        <FaHeart className="h-4 w-4" />
      ) : (
        <FaRegHeart className="h-4 w-4" />
      )}
    </Button>
  );
}

export function ActionButtonArticle({
  article,
  onLikeArticle,
  session,
}: ArticleDetailProps & {
  onLikeArticle: (formData: FormData) => Promise<void>;
}) {
  const onClickComment = () => {
    const findSection = document.getElementById(
      `comment-section-${article.slug}`
    );
    if (findSection) {
      findSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex flex-row items-center gap-2">
      <form action={onLikeArticle}>
        <input type="hidden" name="slug" value={article.slug} />
        <LikeSubmitButton
          liked={article.likedStatus}
          article={article}
          session={session}
        />
      </form>
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={onClickComment}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
