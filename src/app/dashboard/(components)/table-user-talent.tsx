"use client";

import * as React from "react";
import Link from "next/link";
import { Role, TalentStatusEnum } from "@prisma/client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import { Loader2, Search, Trash2, CheckCircle, XCircle, Ban, Eye, ChevronLeft, ChevronRight, Users, UserCheck, Shield } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { roleEnum } from "@/enum/role-enum";
import { KOTA_MAGELANG_ADDRESS_DATA } from "@/data/address";

/* ================== Types ================== */

export type DataType = "talenta" | "admin" | "pengguna";

export interface DataTableUserTalent {
  id: string;
  image: string | null;
  name: string;
  email: string;
  publishedArticle: number; // tampilkan untuk semua
  publishedProduct: number; // tampilkan untuk talent
  profession: string | null; // tampilkan hanya untuk talent
  industry: string | null; // tampilkan hanya untuk talent
  status: TalentStatusEnum | null; // tampilkan hanya untuk talent
  role: Role;
  createdAt: Date;
  type: DataType;
  isTalent: boolean;
  subdistrict: string;
  village: string;
  street: string;
  slug: string | null;
}

interface TableUserTalentProps {
  users: DataTableUserTalent[];
  className?: string;
  defaultPageSize?: number;
  onSetTalent: (id: string, formData: FormData) => Promise<void>; // hanya dipakai saat type === "talenta"
  onDelete: (id: string) => Promise<void>;
  type: DataType;
  actionButton?: React.ReactNode; // Optional action button to display next to search
}

/* ================== Component ================== */

export function TableUserTalent({
  users,
  className,
  defaultPageSize = 10,
  onSetTalent,
  onDelete,
  type,
  actionButton,
}: TableUserTalentProps) {
  const [query, setQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  const [subdistrict, setSubdistrict] = React.useState<"all" | string>("all");
  const [village, setVillage] = React.useState<"all" | string>("all");

  // filter khusus talenta
  const [talentStatus, setTalentStatus] = React.useState<
    "all" | TalentStatusEnum
  >("all");
  const [industry, setIndustry] = React.useState<"all" | string>("all");

  // derive options (industries)
  const industryOptions = React.useMemo(() => {
    if (type !== "talenta") return [];
    const set = new Set(
      users
        .filter((u) => u.type === "talenta" && u.industry)
        .map((u) => u.industry as string)
    );
    return Array.from(set).sort();
  }, [users, type]);

  // filtering
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (type !== u.type) return false;

      if (type === "talenta") {
        if (talentStatus !== "all" && u.status !== talentStatus) return false;
        if (industry !== "all" && u.industry !== industry) return false;
      }

      if (subdistrict !== "all" && u.subdistrict !== subdistrict) return false;
      if (village !== "all" && u.village !== village) return false;

      if (!q) return true;
      const hay = [
        u.name,
        u.email,
        u.profession ?? "",
        u.industry ?? "",
        String(u.publishedArticle),
        type === "talenta" ? String(u.publishedProduct ?? 0) : "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [users, query, type, talentStatus, industry, subdistrict, village]);

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // reset page saat filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [query, pageSize, talentStatus, industry]);

  const villageOptions = React.useMemo(() => {
    if (subdistrict === "all")
      return KOTA_MAGELANG_ADDRESS_DATA.flatMap((item) => item.villages);
    return (
      KOTA_MAGELANG_ADDRESS_DATA.find(
        (item) => item.subdistrict === subdistrict
      )?.villages ?? KOTA_MAGELANG_ADDRESS_DATA.flatMap((item) => item.villages)
    );
  }, [subdistrict]);

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
                placeholder={
                  type === "talenta"
                    ? "Cari nama, email, profesi, industri…"
                    : "Cari nama, email…"
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9"
              />
            </div>
          </div>

          {actionButton && (
            <div className="flex-shrink-0">
              {actionButton}
            </div>
          )}

          {type === "talenta" && (
            <>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Status Talenta
                </label>
                <Select
                  value={talentStatus}
                  onValueChange={(v) => setTalentStatus(v as TalentStatusEnum)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {Object.values(TalentStatusEnum).map((st) => (
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
                <Select value={industry} onValueChange={(v) => setIndustry(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua industri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {industryOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {type === "pengguna" && (
            <>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Kecamatan
                </label>
                <Select
                  value={subdistrict}
                  onValueChange={(v) => {
                    setSubdistrict(v);
                    setVillage("all");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {KOTA_MAGELANG_ADDRESS_DATA.map((item) => (
                      <SelectItem
                        key={item.subdistrict}
                        value={item.subdistrict}
                      >
                        {item.subdistrict}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Kelurahan/Desa
                </label>
                <Select
                  value={village}
                  onValueChange={(v) => {
                    setVillage(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kelurahan/desa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {villageOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
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
              <TableHead>Pengguna</TableHead>
              {type === "pengguna" && <TableHead>Alamat</TableHead>}
              <TableHead className="w-[140px] text-right">
                Artikel Publish
              </TableHead>
              {type === "talenta" && (
                <>
                  <TableHead className="min-w-[140px]">Profesi</TableHead>
                  <TableHead className="min-w-[140px]">Industri</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="w-[140px] text-right">
                    Produk Publish
                  </TableHead>
                </>
              )}
              {type === "admin" && (
                <TableHead className="min-w-[140px]">Peran</TableHead>
              )}
              {type === "pengguna" && (
                <TableHead className="min-w-[140px]">Talenta</TableHead>
              )}
              <TableHead className="min-w-[150px]">Dibuat</TableHead>
              <TableHead className="min-w-[180px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={type === "talenta" ? 9 : type === "pengguna" ? 6 : 6}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                      {type === "pengguna" && <Users className="w-8 h-8 text-muted-foreground/60" />}
                      {type === "talenta" && <UserCheck className="w-8 h-8 text-muted-foreground/60" />}
                      {type === "admin" && <Shield className="w-8 h-8 text-muted-foreground/60" />}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">
                        {type === "pengguna" && "Tidak ada pengguna ditemukan"}
                        {type === "talenta" && "Tidak ada talenta ditemukan"}
                        {type === "admin" && "Tidak ada admin ditemukan"}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk menemukan data yang Anda cari
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.image ?? ""} alt={u.name} />
                      <AvatarFallback>
                        {getInitials(u.name || u.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{u.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {type === "pengguna" && (
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium">
                        {u.subdistrict}
                        {u.village ? "," : ""} {u.village}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {u.street}
                      </div>
                    </div>
                  </TableCell>
                )}

                <TableCell className="text-right">
                  {u.publishedArticle}
                </TableCell>

                {type === "talenta" && u.status && (
                  <>
                    <TableCell>{u.profession ?? "-"}</TableCell>
                    <TableCell>{u.industry ?? "-"}</TableCell>
                    <TableCell>
                      <TalentStatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {u.publishedProduct}
                    </TableCell>
                  </>
                )}
                {type === "admin" && (
                  <TableCell>{roleEnum.getLabel(u.role)}</TableCell>
                )}
                {type === "pengguna" && (
                  <TableCell>
                    {u.isTalent ? (
                      <Badge variant="secondary">Talenta</Badge>
                    ) : (
                      <Badge variant="destructive">Tidak</Badge>
                    )}
                  </TableCell>
                )}

                <TableCell>
                  <div className="text-xs">{formatIDDate(u.createdAt)}</div>
                </TableCell>

                <TableCell>
                  <ActionButtons
                    item={u}
                    type={type}
                    onSetTalent={onSetTalent}
                    onDelete={onDelete}
                  />
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
            Menampilkan {start + 1}-{Math.min(start + pageSize, total)} dari {total} data
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

/* ================== Subcomponents ================== */

function TalentStatusBadge({ status }: { status: TalentStatusEnum }) {
  const map: Record<TalentStatusEnum, string> = {
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

function statusLabel(s: TalentStatusEnum) {
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
  type,
  onSetTalent,
  onDelete,
}: {
  item: DataTableUserTalent;
  type: DataType;
  onSetTalent: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const handleSet = async (formData: FormData) => {
    try {
      const status = formData.get("status") as TalentStatusEnum;
      if (!Object.values(TalentStatusEnum).includes(status)) {
        toast.error("Status tidak valid");
        return;
      }
      await onSetTalent(item.id, formData);
      switch (status) {
        case "approved":
          toast.success("Talenta disetujui");
          break;
        case "rejected":
          toast.success("Talenta ditolak");
          break;
        case "banned":
          toast.success("Talenta diblokir");
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
      {item.type === "talenta" && item.status === "approved" && (
        <Button asChild variant="outline">
          <Link href={`/talenta/${item.slug}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Lihat
          </Link>
        </Button>
      )}

      {/* Delete */}
      {item.role !== Role.superadmin && type !== "talenta" && (
        <AlertConfirmation
          onConfirm={handleDelete}
          description="Apakah anda yakin ingin menghapus data ini? Data yang akan dihapus tidak dapat dibatalkan. Data yang akan dihapus adalah data pengguna dan semua data yang terkait dengan pengguna tersebut."
        >
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </AlertConfirmation>
      )}

      {/* Talent status controls */}
      {type === "talenta" && (
        <div className="flex items-center gap-2">
          {item.status === "pending" && (
            <>
              <form action={handleSet}>
                <input type="hidden" name="status" value="approved" />
                <SubmitBtn label="Setujui" icon={<CheckCircle className="h-4 w-4" />} />
              </form>

              <form action={handleSet}>
                <input type="hidden" name="status" value="rejected" />
                <SubmitBtn label="Tolak" variant="outline" icon={<XCircle className="h-4 w-4" />} />
              </form>
            </>
          )}
          {item.status === "approved" && (
            <form action={handleSet}>
              <input type="hidden" name="status" value="banned" />
              <SubmitBtn label="Blokir" variant="destructive" icon={<Ban className="h-4 w-4" />} />
            </form>
          )}
          {item.status === "banned" && (
            <form action={handleSet}>
              <input type="hidden" name="status" value="approved" />
              <SubmitBtn label="Aktifkan" icon={<CheckCircle className="h-4 w-4" />} />
            </form>
          )}
        </div>
      )}
    </div>
  );
}
