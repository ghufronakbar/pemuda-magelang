"use client";

import * as React from "react";
import { Community, User, CommunityStatusEnum } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2, ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import { formatIDDate } from "@/lib/helper";
import Image from "next/image";

interface CommunityWithUser extends Community {
  user: User;
  _count: { articles: number };
}

interface TableCommunityProps {
  communities: CommunityWithUser[];
  className?: string;
  defaultPageSize?: number;
  onSetStatus: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const communityStatusMap: Record<CommunityStatusEnum, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-yellow-500" },
  approved: { label: "Disetujui", color: "bg-green-500" },
  rejected: { label: "Ditolak", color: "bg-red-500" },
  banned: { label: "Diblokir", color: "bg-gray-500" },
};

export function TableCommunity({
  communities,
  className,
  defaultPageSize = 10,
  onSetStatus,
  onDelete,
}: TableCommunityProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  // Get unique categories
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(communities.map((c) => c.category))
    );
    return uniqueCategories.sort();
  }, [communities]);

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || community.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || community.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCommunities.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCommunities = filteredCommunities.slice(startIndex, endIndex);

  const handleStatusChange = async (id: string, status: CommunityStatusEnum) => {
    const formData = new FormData();
    formData.append("status", status);
    await onSetStatus(id, formData);
    toast.success("Status komunitas berhasil diubah");
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    toast.success("Komunitas berhasil dihapus");
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Controls */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">
            Cari
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama komunitas, pemilik, kategori…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex-shrink-0">
          <label className="mb-1 block text-xs text-muted-foreground">
            Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {Object.entries(communityStatusMap).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-shrink-0">
          <label className="mb-1 block text-xs text-muted-foreground">
            Kategori
          </label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama Komunitas</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Artikel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCommunities.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                      <Users className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">
                        Tidak ada komunitas ditemukan
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Coba ubah kata kunci pencarian atau filter untuk menemukan komunitas yang Anda cari
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {currentCommunities.map((community) => (
              <TableRow key={community.id}>
                <TableCell>
                  <Image
                    src={community.profilePicture || "/placeholder.svg"}
                    alt={community.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </TableCell>
                <TableCell className="font-medium">{community.name}</TableCell>
                <TableCell>{community.user.name}</TableCell>
                <TableCell>{community.category}</TableCell>
                <TableCell>{community._count.articles}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      communityStatusMap[community.status].color,
                      "text-white"
                    )}
                  >
                    {communityStatusMap[community.status].label}
                  </Badge>
                </TableCell>
                <TableCell>{formatIDDate(community.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={community.status}
                      onValueChange={(value) => handleStatusChange(community.id, value as CommunityStatusEnum)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(communityStatusMap).map(([status, config]) => (
                          <SelectItem key={status} value={status}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AlertConfirmation
                      title="Hapus Komunitas"
                      description={`Apakah Anda yakin ingin menghapus komunitas "${community.name}"?`}
                      onConfirm={() => handleDelete(community.id)}
                    >
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                    </AlertConfirmation>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredCommunities.length)} dari {filteredCommunities.length} komunitas
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
