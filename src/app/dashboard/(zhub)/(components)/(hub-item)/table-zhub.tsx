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
import { Pagination } from "@/components/custom/pagination";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import { Loader2, Trash2, Search } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { formatIDDate } from "@/lib/helper";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { hubStatusEnum } from "@/enum/hub-status-enum";
import { useFormHub } from "@/context/form-hub-context";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full flex flex-row gap-4 flex-wrap">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Cari
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama kategori…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9"
              />
            </div>
          </div>
          <div>
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
          <div>
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

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Tampil</label>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-[84px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
              setStatus("all");
            }}
          >
            Reset
          </Button>
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
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data yang cocok.
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="">
                  <Image
                    src={item.image || PLACEHOLDER_IMAGE}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
      />
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
        <SubmitBtn label="Hapus" variant="destructive" icon={<Trash2 className="h-4 w-4" />} />
      </AlertConfirmation>
    </div>
  );
}
