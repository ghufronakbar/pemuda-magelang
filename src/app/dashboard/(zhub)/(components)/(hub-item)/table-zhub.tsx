"use client";

import * as React from "react";
import Link from "next/link";
import { Hub, HubCategory, HubStatusEnum } from "@prisma/client";
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
import {
  Loader2,
  Trash2,
  Search,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { formatIDDate } from "@/lib/helper";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { hubStatusEnum } from "@/enum/hub-status-enum";
import { useFormHub } from "@/context/form-hub-context";
import { CdnImage } from "@/components/custom/cdn-image";

/* ================== Types ================== */

export interface DataHub extends Hub {
  hubCategory: HubCategory;
}

interface TableZHubProps {
  data: DataHub[];
  className?: string;
  defaultPageSize?: number;
  onDelete: (id: string) => Promise<void>;
}

/* ================== Component ================== */

export function TableZHub({
  data,
  className,
  defaultPageSize = 10,
  onDelete,
}: TableZHubProps) {
  const [query, setQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);
  const [category, setCategory] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const categories = React.useMemo(
    () => Array.from(new Set(data.map((u) => u.hubCategory.name))).sort(),
    [data]
  );

  // filtering
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((u) => {
      if (category !== "all" && u.hubCategory.name !== category) return false;
      if (status !== "all" && u.status !== status) return false;
      if (!q) return true;
      const hay = [u.name, u.hubCategory.name, u.status]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [data, query, category, status]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // reset page saat filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [query, pageSize, category, status]);

  return (
    <section className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-row flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-muted-foreground">
            Cari
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama program, kategori…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-3">
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
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {Object.values(HubStatusEnum).map((s) => (
                  <SelectItem key={s} value={s}>
                    {hubStatusEnum.getIcon(s)}
                    <span>{hubStatusEnum.getLabel(s)}</span>
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
        {Math.min(start + pageSize, total)} dari {total} data
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[150px]">Dibuat</TableHead>
              <TableHead className="min-w-[180px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                      <Building className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">
                        Tidak ada program zhub ditemukan
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk
                        menemukan program yang Anda cari
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="">
                  <CdnImage
                    uniqueKey={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover w-10 h-10 min-w-10 min-h-10"
                  />
                </TableCell>
                <TableCell className="flex flex-col gap-1">
                  <div>{item.name}</div>
                  <div className="line-clamp-1 max-w-[380px] truncate text-muted-foreground text-xs">
                    {item.description}
                  </div>
                </TableCell>
                <TableCell>{item.hubCategory.name}</TableCell>
                <TableCell className="flex justify-center">
                  <Badge
                    className={cn(hubStatusEnum.getBadgeClass(item.status))}
                  >
                    {hubStatusEnum.getLabel(item.status)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-xs">{formatIDDate(item.createdAt)}</div>
                </TableCell>

                <TableCell>
                  <ActionButtons item={item} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {total === 0 ? 0 : start + 1}–
            {Math.min(start + pageSize, total)} dari {total} program
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

function SubmitBtn({
  label,
  variant,
  className,
  icon,
}: {
  label: string;
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  className?: string;
  icon?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant={variant}
      className={className}
      size="sm"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses…
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </>
      )}
    </Button>
  );
}

function ActionButtons({
  item,

  onDelete,
}: {
  item: DataHub;
  onDelete: (id: string) => Promise<void>;
}) {
  const { onOpenEdit } = useFormHub();
  const handleDelete = async () => {
    try {
      console.log("handleDelete", item.id);
      await onDelete(item.id);
      toast.success("Data berhasil dihapus");
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="secondary" size="sm">
        <Link href={`/zhub/${item.slug}`} target="_blank">
          Lihat
        </Link>
      </Button>
      <Button variant="outline" size="sm" onClick={() => onOpenEdit(item)}>
        Edit
      </Button>
      <AlertConfirmation
        onConfirm={handleDelete}
        description="Apakah anda yakin ingin menghapus data ini? Data yang akan dihapus tidak dapat dibatalkan. Data yang akan dihapus adalah data program ini dan semua data yang terkait dengan program ini."
      >
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
          Hapus
        </Button>
      </AlertConfirmation>
    </div>
  );
}
