"use client";

import * as React from "react";
import { Community, User, CommunityStatusEnum } from "@prisma/client";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pagination } from "@/components/custom/pagination";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
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

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredCommunities.length)} dari {filteredCommunities.length} komunitas
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
