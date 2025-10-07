"use client";

import * as React from "react";
import { Product, Talent, ProductStatusEnum, Role, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Loader2, Trash2, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";

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
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import { productStatusEnum } from "@/enum/product-status-enum";
import { formatIDDate, formatIDR } from "@/lib/helper";

// ===== Types =====
type ProductWithTalent = Product & { talent: Talent & { user: User } };

interface TableProductProps {
  products: ProductWithTalent[];
  className?: string;
  defaultPageSize?: number;
  onSetStatus: (slug: string, formData: FormData) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
}

// ===== Component =====
export function TableProduct({
  products,
  className,
  defaultPageSize = 10,
  onSetStatus,
  onDelete,
}: TableProductProps) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | ProductStatusEnum>("all");
  const [category, setCategory] = React.useState<"all" | string>("all");

  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === Role.admin ||
    session?.user?.role === Role.superadmin;

  // derive options
  const categories = React.useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  // filtering
  const stripHtml = (s: string) => s.replace(/<[^>]*>/g, " ");
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all" && p.category !== category) return false;

      if (!q) return true;

      const hay = [
        p.title,
        p.slug,
        p.category,
        p.tags.join(" "),
        p.talent.name,
        stripHtml(p.description),
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [products, status, category, query]);

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
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">
            Cari
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari judul, tag, talent…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex-shrink-0">
          <label className="mb-1 block text-xs text-muted-foreground">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ProductStatusEnum)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {Object.values(ProductStatusEnum).map((s) => (
                <SelectItem key={s} value={s}>
                  {productStatusEnum.getLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
      </div>

      {/* Info bar */}
      <div className="text-xs text-muted-foreground">
        Menampilkan {total === 0 ? 0 : start + 1}–
        {Math.min(start + pageSize, total)} dari {total} produk
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead className="min-w-[120px]">Kategori</TableHead>
              <TableHead className="min-w-[160px]">Tag</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              {isAdmin && (
                <TableHead className="min-w-[160px]">Talent</TableHead>
              )}
              <TableHead className="w-[120px] text-right">Harga</TableHead>
              <TableHead className="min-w-[150px]">Dibuat</TableHead>
              <TableHead className="min-w-[150px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                      <Package className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">
                        Tidak ada produk ditemukan
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk menemukan produk yang Anda cari
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((p) => {
              const thumb = p.images?.[0];
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded border bg-muted">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={p.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[10px] text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-medium">
                          {p.title}
                        </div>
                        <div className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
                          {stripHtml(p.description)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {p.category}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex max-w-[260px] flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="rounded-full"
                        >
                          {t}
                        </Badge>
                      ))}
                      {p.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{p.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <ProductStatusBadge status={p.status} />
                  </TableCell>

                  {isAdmin && (
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {p.talent.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {p.talent.profession} • {p.talent.industry}
                      </div>
                    </TableCell>
                  )}

                  <TableCell className="text-right">
                    {typeof p.price === "number" ? formatIDR(p.price) : "-"}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs">{formatIDDate(p.createdAt)}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Update {formatIDDate(p.updatedAt)}
                    </div>
                  </TableCell>

                  <TableCell>
                    <ActionButtons
                      product={p}
                      onSetStatus={onSetStatus}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {start + 1}-{Math.min(start + pageSize, total)} dari {total} produk
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
                let pageNum;
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

/* ================= Helpers ================= */

function ProductStatusBadge({ status }: { status: ProductStatusEnum }) {
  const map: Record<ProductStatusEnum, string> = {
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-amber-100 text-amber-700",
    banned: "bg-rose-100 text-rose-700",
  };
  return (
    <Badge
      className={cn("rounded-full capitalize", map[status])}
      variant="secondary"
    >
      {productStatusEnum.getLabel(status)}
    </Badge>
  );
}

/* ============== Actions column ============== */

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

function ActionButtons({
  product,
  onSetStatus,
  onDelete,
}: {
  product: ProductWithTalent;
  onSetStatus: (slug: string, formData: FormData) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
}) {
  const { data: session } = useSession();

  // agar pengecekan "isOwner" akurat.
  const isAdmin = session?.user?.role && session.user.role !== Role.user;
  const { status } = product;

  const handleSetStatus = async (formData: FormData) => {
    const status = formData.get("status") as ProductStatusEnum;
    const check = Object.values(ProductStatusEnum).includes(status);
    if (!check) {
      toast.error("Status tidak valid");
      return;
    }
    await onSetStatus(product.slug, formData);
    switch (status) {
      case "published":
        toast.success("Produk berhasil dipublikasi");
        break;
      case "draft":
        toast.success("Produk berhasil diset menjadi draft");
        break;
      case "banned":
        toast.success("Produk berhasil ditangguhkan");
        break;
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(product.slug);
    } catch (e) {
      console.error(e);
      toast.error("Produk gagal dihapus");
      return;
    }
    toast.success("Produk berhasil dihapus");
  };

  return (
    <div className="flex flex-row items-center gap-2">

      {!isAdmin && (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/produk/edit-produk/${product.id}`}>Edit</Link>
        </Button>
      )}

      {!isAdmin && (
        <AlertConfirmation onConfirm={handleDelete}>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </AlertConfirmation>
      )}

      {!isAdmin && status === "draft" && (
        <form action={(fd) => handleSetStatus(fd)}>
          <input
            type="hidden"
            name="status"
            value={ProductStatusEnum.published}
          />
          <SubmitBtn label="Publikasi" />
        </form>
      )}

      {!isAdmin && status === "published" && (
        <form action={(fd) => handleSetStatus(fd)}>
          <input type="hidden" name="status" value={ProductStatusEnum.draft} />
          <SubmitBtn label="Simpan Draft" />
        </form>
      )}

      {isAdmin && status !== "banned" && (
        <form action={(fd) => handleSetStatus(fd)}>
          <input type="hidden" name="status" value={ProductStatusEnum.banned} />
          <SubmitBtn label="Tangguhkan" variant="destructive" />
        </form>
      )}

      {isAdmin && status === "banned" && (
        <form action={(fd) => handleSetStatus(fd)}>
          <input type="hidden" name="status" value={ProductStatusEnum.draft} />
          <SubmitBtn label="Aktifkan" variant="outline" />
        </form>
      )}
    </div>
  );
}
