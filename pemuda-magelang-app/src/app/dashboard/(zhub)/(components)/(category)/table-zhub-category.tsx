"use client";

import * as React from "react";
import Link from "next/link";
import { HubCategory } from "@prisma/client";
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
import { useFormCategoryHub } from "@/context/form-category-hub-context";
import { FormCategoryHub, FormCategoryHubButton } from "./form-category-zhub";

/* ================== Types ================== */

export interface DataCategoryHub extends HubCategory {
  active: number;
  inactive: number;
  soon: number;
}

interface TableZHubCategoryProps {
  data: DataCategoryHub[];
  className?: string;
  defaultPageSize?: number;
  onDelete: (id: string) => Promise<void>;
}

/* ================== Component ================== */

export function TableZHubCategory({
  data,
  className,
  defaultPageSize = 10,
  onDelete,
}: TableZHubCategoryProps) {
  const [query, setQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  // filtering
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((u) => !q || u.name.toLowerCase().includes(q));
  }, [data, query]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // reset page saat filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  return (
    <section className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full flex flex-row gap-4 flex-wrap items-end">
          <div className="flex-1">
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
          <div className="flex items-end">
            <FormCategoryHubButton />
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
              <TableHead>Kategori</TableHead>
              <TableHead className="w-[140px]">Program Aktif</TableHead>
              <TableHead className="w-[140px]">Program Inaktif</TableHead>
              <TableHead className="w-[140px]">
                Program Yang Akan Datang
              </TableHead>
              <TableHead className="min-w-[150px]">Dibuat</TableHead>
              <TableHead className="min-w-[180px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data yang cocok.
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="">{item.name}</TableCell>
                <TableCell>{item.active}</TableCell>
                <TableCell>{item.inactive}</TableCell>
                <TableCell>{item.soon}</TableCell>

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

      {/* Dialog */}
      <FormCategoryHub />
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
  item: DataCategoryHub;
  onDelete: (id: string) => Promise<void>;
}) {
  const { onOpenEdit } = useFormCategoryHub();
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
        <Link href={`/zhub/kategori/${item.id}`} target="_blank">
          Lihat
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpenEdit(item.id, item.name)}
      >
        Edit
      </Button>
      <AlertConfirmation
        onConfirm={handleDelete}
        description="Apakah anda yakin ingin menghapus data ini? Data yang akan dihapus tidak dapat dibatalkan. Data yang akan dihapus adalah data kategori ini dan semua data yang terkait dengan kategori ini."
      >
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4" />
          Hapus
        </Button>
      </AlertConfirmation>
    </div>
  );
}
