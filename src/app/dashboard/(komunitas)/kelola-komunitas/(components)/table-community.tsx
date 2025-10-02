"use client";

import * as React from "react";
import { CommunityStatusEnum, Community, User } from "@prisma/client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { COMMUNITY_CATEGORIES } from "@/data/community";

/* ================== Types ================== */

export interface DataCommunity extends Community {
  user: User;
  _count: {
    articles: number;
  };
}

interface TableCommunityProps {
  communities: DataCommunity[];
  className?: string;
  defaultPageSize?: number;
  onSetStatus: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/* ================== Component ================== */

export function TableCommunity({
  communities,
  className,
  defaultPageSize = 10,
  onSetStatus,
  onDelete,
}: TableCommunityProps) {
  const [query, setQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  // filter khusus komunitas
  const [commStatus, setCommStatus] = React.useState<
    "all" | CommunityStatusEnum
  >("all");
  const [category, setCategory] = React.useState<"all" | string>("all");

  // filtering
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return communities.filter((com) => {
      if (category !== "all" && com.category !== category) return false;
      if (commStatus !== "all" && com.status !== commStatus) return false;
      if (!q) return true;
      const hay = [com.name, com.user.name, com.user.email]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [communities, query, commStatus, category]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // reset page saat filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [query, pageSize, commStatus, category]);

  return (
    <section className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full flex flex-row gap-4 flex-wrap">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Cari
            </label>
            <Input
              placeholder="Cari nama, pemilik, email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Status Komunitas
            </label>
            <Select
              value={commStatus}
              onValueChange={(v) => setCommStatus(v as CommunityStatusEnum)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {Object.values(CommunityStatusEnum).map((st) => (
                  <SelectItem key={st} value={st}>
                    {statusLabel(st)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Industri
            </label>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua industri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {COMMUNITY_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
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
              setCommStatus("all");
              setCategory("all");
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
              <TableHead className="w-[140px]">Komunitas</TableHead>
              <TableHead className="w-[140px]">Pemilik</TableHead>
              <TableHead className="min-w-[140px]">Kategori</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="">Artikel Publish</TableHead>
              <TableHead className="min-w-[150px]">Dibuat</TableHead>
              <TableHead className="min-w-[180px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Tidak ada data yang cocok.
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((com) => (
              <TableRow key={com.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={com.profilePicture ?? ""}
                      alt={com.name}
                    />
                    <AvatarFallback>{getInitials(com.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{com.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {com.user.email}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{com.user.name ?? "-"}</TableCell>
                <TableCell>{com.category ?? "-"}</TableCell>
                <TableCell>
                  <CommunityStatusBadge status={com.status} />
                </TableCell>
                <TableCell>{com._count.articles ?? 0}</TableCell>

                <TableCell>
                  <div className="text-xs">{formatIDDate(com.createdAt)}</div>
                </TableCell>

                <TableCell>
                  <ActionButtons
                    item={com}
                    onSetStatus={onSetStatus}
                    onDelete={onDelete}
                  />
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

/* ================== Subcomponents ================== */

function CommunityStatusBadge({ status }: { status: CommunityStatusEnum }) {
  const map: Record<CommunityStatusEnum, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    banned: "bg-rose-100 text-rose-700",
  };
  return (
    <Badge
      className={cn("rounded-full capitalize", map[status])}
      variant="secondary"
    >
      {statusLabel(status)}
    </Badge>
  );
}

function statusLabel(s: CommunityStatusEnum) {
  switch (s) {
    case "pending":
      return "Menunggu";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "banned":
      return "Diblokir";
  }
}

function formatIDDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  try {
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d);
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (a + b).toUpperCase();
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
      size="sm"
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
  item,
  onSetStatus,
  onDelete,
}: {
  item: DataCommunity;
  onSetStatus: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const handleSet = async (formData: FormData) => {
    try {
      const status = formData.get("status") as CommunityStatusEnum;
      if (!Object.values(CommunityStatusEnum).includes(status)) {
        toast.error("Status tidak valid");
        return;
      }
      await onSetStatus(item.id, formData);
      switch (status) {
        case "approved":
          toast.success("Komunitas disetujui");
          break;
        case "rejected":
          toast.success("Komunitas ditolak");
          break;
        case "banned":
          toast.success("Komunitas diblokir");
          break;
        case "pending":
          toast.success("Status diubah ke menunggu");
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah status");
    }
  };

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
      {/* View */}
      {/* <Button asChild variant="outline">
        <Link href={`/dashboard/${item.type}/${item.id}`}>Lihat</Link>
      </Button> */}

      {/* Delete */}

      <AlertConfirmation
        onConfirm={handleDelete}
        description="Apakah anda yakin ingin menghapus data ini? Data yang akan dihapus tidak dapat dibatalkan. Data yang akan dihapus adalah data komunitas dan semua data yang terkait dengan komunitas tersebut."
      >
        <Button variant="destructive" size="sm">
          Hapus
        </Button>
      </AlertConfirmation>

      <div className="flex items-center gap-2">
        {item.status === "pending" && (
          <>
            <form action={handleSet}>
              <input type="hidden" name="status" value="approved" />
              <SubmitBtn label="Setujui" />
            </form>

            <form action={handleSet}>
              <input type="hidden" name="status" value="rejected" />
              <SubmitBtn label="Tolak" variant="outline" />
            </form>
          </>
        )}
        {item.status === "approved" && (
          <form action={handleSet}>
            <input type="hidden" name="status" value="banned" />
            <SubmitBtn label="Blokir" variant="destructive" />
          </form>
        )}
        {item.status === "banned" && (
          <form action={handleSet}>
            <input type="hidden" name="status" value="approved" />
            <SubmitBtn label="Aktifkan" />
          </form>
        )}
      </div>
    </div>
  );
}
