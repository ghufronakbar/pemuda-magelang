"use client";

import * as React from "react";
import { Article, User, ArticleStatusEnum, Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { articleStatusEnum } from "@/enum/article-status-enum";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import {
  Loader2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  PenTool,
  TrendingUp,
} from "lucide-react";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import { formatIDDate } from "@/lib/helper";
import { CdnImage } from "@/components/custom/cdn-image";

interface ArticleWithUser extends Article {
  user: User;
  _count: { trackViews: number };
}

interface TableArticleProps {
  articles: ArticleWithUser[];
  className?: string;
  defaultPageSize?: number;
  onSetStatus: (slug: string, formData: FormData) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
  type: "gerak" | "detak" | "dampak";
}

export function TableArticle({
  articles,
  className,
  defaultPageSize = 10,
  onSetStatus,
  onDelete,
  type,
}: TableArticleProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | ArticleStatusEnum>("all");
  const [category, setCategory] = React.useState<"all" | string>("all");

  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  // derive options
  const categories = React.useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))).sort(),
    [articles]
  );

  // filtering
  const stripHtml = (s: string) => s.replace(/<[^>]*>/g, " ");
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (category !== "all" && a.category !== category) return false;

      if (!q) return true;

      const hay = [
        a.title,
        a.slug,
        a.category,
        a.tags.join(" "),
        a.user.name,
        stripHtml(a.content),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [articles, status, category, query]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [query, status, category, pageSize]);

  return (
    <section className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-row gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-muted-foreground">
            Cari
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari judul, tag, penulis…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex flex-row gap-3 items-end flex-wrap">
          <div className="flex-shrink-0">
            <label className="mb-1 block text-xs text-muted-foreground">
              Kategori
            </label>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-shrink-0">
            <label className="mb-1 block text-xs text-muted-foreground">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ArticleStatusEnum)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {Object.values(ArticleStatusEnum).map((status) => (
                  <SelectItem key={status} value={status}>
                    {articleStatusEnum.getLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="text-xs text-muted-foreground">
        Menampilkan {total === 0 ? 0 : start + 1}–
        {Math.min(start + pageSize, total)} dari {total} artikel
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Judul</TableHead>
              <TableHead className="min-w-[120px]">Kategori</TableHead>
              <TableHead className="min-w-[160px]">Tag</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              {isAdmin && (
                <TableHead className="min-w-[160px]">Penulis</TableHead>
              )}
              <TableHead className="w-[90px] text-right">Views</TableHead>
              <TableHead className="min-w-[150px]">Dibuat</TableHead>
              <TableHead className="min-w-[150px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                      {type === "gerak" && (
                        <FileText className="w-8 h-8 text-muted-foreground/60" />
                      )}
                      {type === "detak" && (
                        <PenTool className="w-8 h-8 text-muted-foreground/60" />
                      )}
                      {type === "dampak" && (
                        <TrendingUp className="w-8 h-8 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">
                        {type === "gerak" &&
                          "Tidak ada artikel gerak ditemukan"}
                        {type === "detak" &&
                          "Tidak ada artikel detak ditemukan"}
                        {type === "dampak" &&
                          "Tidak ada artikel dampak ditemukan"}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk
                        menemukan artikel yang Anda cari
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <CdnImage
                    uniqueKey={a.thumbnailImage}
                    alt={a.title}
                    width={100}
                    height={100}
                    className="rounded-md object-cover min-h-10 min-w-10 w-10 h-10"
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-[380px]">
                    <div className="line-clamp-2 font-medium">{a.title}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground truncate">
                      {stripHtml(a.content)}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="rounded-full">
                    {a.category}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex max-w-[260px] flex-wrap gap-1">
                    {a.tags.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="rounded-full">
                        {t}
                      </Badge>
                    ))}
                    {a.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{a.tags.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={a.status} />
                </TableCell>

                {isAdmin && (
                  <TableCell>
                    <div className="max-w-[200px] truncate">{a.user.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {a.user.email}
                    </div>
                  </TableCell>
                )}

                <TableCell className="text-right">
                  {a._count.trackViews}
                </TableCell>

                <TableCell>
                  <div className="text-xs">{formatIDDate(a.createdAt)}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Update {formatIDDate(a.updatedAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <ActionButtons
                    article={a}
                    onSetStatus={onSetStatus}
                    onDelete={onDelete}
                    type={type}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-row flex-wrap items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {start + 1}-{Math.min(start + pageSize, total)} dari{" "}
            {total} artikel
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ===== Helpers ===== */

function StatusBadge({ status }: { status: ArticleStatusEnum }) {
  const map: Record<ArticleStatusEnum, string> = {
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-amber-100 text-amber-700",
    banned: "bg-rose-100 text-rose-700",
  };
  return (
    <Badge
      className={cn("rounded-full capitalize", map[status])}
      variant="secondary"
    >
      {articleStatusEnum.getLabel(status)}
    </Badge>
  );
}

interface ActionButtonsProps {
  article: ArticleWithUser;
  onSetStatus: (slug: string, formData: FormData) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
  type: "gerak" | "detak" | "dampak";
}

function SubmitBtn({
  label,
  variant,
  className,
}: {
  label: string;
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant={variant}
      className={className}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses…
        </>
      ) : (
        label
      )}
    </Button>
  );
}

const ActionButtons = ({
  type,
  article,
  onSetStatus,
  onDelete,
}: ActionButtonsProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isOwner = userId === article.userId;
  const isAdmin = session?.user?.role !== Role.user;
  const { status } = article;

  const handleSetStatus = async (formData: FormData) => {
    const status = formData.get("status") as ArticleStatusEnum;
    const check = Object.values(ArticleStatusEnum).includes(status);
    if (!check) {
      toast.error("Status tidak valid");
      return;
    }
    await onSetStatus(article.slug, formData);
    switch (status) {
      case ArticleStatusEnum.published:
        toast.success("Artikel berhasil dipublikasi");
        break;
      case ArticleStatusEnum.draft:
        toast.success("Artikel berhasil disimpan draft");
        break;
      case ArticleStatusEnum.banned:
        toast.success("Artikel berhasil ditangguhkan");
        break;
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(article.slug);
      toast.success("Artikel berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Artikel gagal dihapus");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isOwner && (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/${type}/edit-artikel/${article.id}`}>
            Edit
          </Link>
        </Button>
      )}
      {(isOwner || isAdmin) && (
        <AlertConfirmation onConfirm={handleDelete}>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </AlertConfirmation>
      )}
      {isOwner && status === ArticleStatusEnum.draft && (
        <form action={(formData) => handleSetStatus(formData)}>
          <input
            type="hidden"
            name="status"
            value={ArticleStatusEnum.published}
          />
          <SubmitBtn label="Publikasi" variant="default" />
        </form>
      )}
      {isOwner && status === ArticleStatusEnum.published && (
        <form action={(formData) => handleSetStatus(formData)}>
          <input type="hidden" name="status" value={ArticleStatusEnum.draft} />
          <SubmitBtn label="Simpan Draft" variant="default" />
        </form>
      )}
      {isAdmin && status !== ArticleStatusEnum.banned && type !== "gerak" && (
        <form action={(formData) => handleSetStatus(formData)}>
          <input type="hidden" name="status" value={ArticleStatusEnum.banned} />
          <SubmitBtn label="Tangguhkan" variant="destructive" />
        </form>
      )}
      {isAdmin && status === ArticleStatusEnum.banned && (
        <form action={(formData) => handleSetStatus(formData)}>
          <input type="hidden" name="status" value={ArticleStatusEnum.draft} />
          <SubmitBtn label="Aktifkan" variant="outline" />
        </form>
      )}
    </div>
  );
};
