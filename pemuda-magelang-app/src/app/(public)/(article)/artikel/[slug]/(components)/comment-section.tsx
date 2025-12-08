"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { commentArticle, deleteCommentArticle } from "@/actions/article";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleDetailProps, CommentWithUser } from "./article-detail";
import { formatIDDate, getInitials } from "@/lib/helper";
import { Session } from "next-auth";
import { cdnUrl } from "@/components/custom/cdn-image";

export default function CommentSection({
  article,
  className,
  session,
}: ArticleDetailProps) {
  const pathname = usePathname();
  const isAuthed = !!session;

  return (
    <section
      id={`comment-section-${article.slug}`}
      className={cn("w-full space-y-4", className)}
    >
      <div className="flex items-end justify-between gap-2">
        <h2 className="text-lg font-semibold sm:text-xl">
          Komentar ({article._count?.comments ?? article.comments.length})
        </h2>
      </div>

      {isAuthed ? (
        <CommentComposer slug={article.slug} />
      ) : (
        <div className="rounded-md border p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground">
              Masuk untuk menulis komentar.
            </p>
            <Button asChild size="sm">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(
                  pathname ?? "/"
                )}`}
              >
                Masuk
              </Link>
            </Button>
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        {article.comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          article.comments.map((c) => (
            <CommentItem key={c.id} comment={c} session={session} />
          ))
        )}
      </div>
    </section>
  );
}

/* =============================
   Composer: form tulis komentar
   ============================= */

function CommentComposer({ slug }: { slug: string }) {
  const [content, setContent] = React.useState("");

  return (
    <form
      action={
        commentArticle as unknown as (formData: FormData) => Promise<void>
      }
      className="space-y-2"
    >
      <input type="hidden" name="slug" value={slug} />
      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis komentar yang sopan dan relevan…"
        rows={4}
        required
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {content.trim().length}/5000
        </p>
        <SubmitCommentButton
          disabled={content.trim().length === 0}
          onDone={() => setContent("")}
        />
      </div>
    </form>
  );
}

function SubmitCommentButton({
  disabled,
  onDone,
}: {
  disabled?: boolean;
  onDone?: () => void;
}) {
  const { pending } = useFormStatus();
  const wasPending = React.useRef(false);

  React.useEffect(() => {
    if (wasPending.current && !pending) onDone?.();
    wasPending.current = pending;
  }, [pending, onDone]);

  return (
    <Button type="submit" size="sm" disabled={disabled || pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengirim…
        </>
      ) : (
        "Kirim"
      )}
    </Button>
  );
}

/* =============================
   Item komentar + Delete
   ============================= */

function CommentItem({
  comment,
  session,
}: {
  comment: CommentWithUser;
  session: Session | null;
}) {
  const isOwner = comment.userId === session?.user?.id;
  const isAdminOrSuper = session?.user?.role && session.user.role !== "user";
  const isAbleToDelete = isOwner || isAdminOrSuper;

  const name = comment.user.name ?? "Pengguna";
  const avatar = comment.user.profilePicture ?? "";
  const initials = getInitials(name);
  const date = formatIDDate(comment.createdAt);

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={cdnUrl(avatar)} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium leading-none">{name}</div>
          <div className="text-xs text-muted-foreground">• {date}</div>

          {isAbleToDelete && (
            <div className="ml-auto">
              <form
                action={
                  deleteCommentArticle as unknown as (
                    formData: FormData
                  ) => Promise<void>
                }
                onSubmit={(e) => {
                  const ok = confirm("Hapus komentar ini?");
                  if (!ok) e.preventDefault();
                }}
              >
                <input type="hidden" name="commentId" value={comment.id} />
                <DeleteCommentButton />
              </form>
            </div>
          )}
        </div>

        <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
          {comment.content}
        </div>
      </div>
    </div>
  );
}

function DeleteCommentButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      variant="ghost"
      className="text-destructive hover:text-destructive"
      disabled={pending}
      title="Hapus komentar"
      aria-label="Hapus komentar"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
