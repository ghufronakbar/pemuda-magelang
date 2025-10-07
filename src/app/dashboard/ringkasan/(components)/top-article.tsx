"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableCell, TableHead, TableRow, TableHeader, TableBody } from "@/components/ui/table";
import { articleStatusEnum } from "@/enum/article-status-enum";
import { cn } from "@/lib/utils";
import { ArticleStatusEnum, Role } from "@prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

export interface TopArticleCardProps {
  data: {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
    category: string;
    views: number;
    likes: number;
    comments: number;
    status: ArticleStatusEnum;
    publishedAt: Date;
    type: "detak" | "gerak";
  }[];
  className?: string;
}

export const TopArticleCard = ({ data, className }: TopArticleCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{"Artikel Terpopuler"}</CardTitle>
        <CardDescription>
          {isAdmin
            ? "Artikel terpopuler yang terdaftar"
            : "Artikel terpopuler yang anda tulis"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Dibaca</TableHead>
              <TableHead>Dikomentari</TableHead>
              <TableHead>Disukai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="max-w-40 truncate">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.views}</TableCell>
                <TableCell>{item.comments}</TableCell>
                <TableCell>{item.likes}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      articleStatusEnum.getColor(item.status),
                      "text-xs"
                    )}
                  >
                    {articleStatusEnum.getLabel(item.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/artikel/${item.slug}`}
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {data.length === 0 && (
          <div className="flex flex-col gap-4 items-center justify-center min-h-40">
            <p className="text-sm text-muted-foreground">Belum ada artikel.</p>
            <Button asChild variant="outline">
              <Link
                href={`/dashboard/${isAdmin ? "gerak" : "detak"}/buat-artikel`}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tulis artikel
                </div>
              </Link>
            </Button>
          </div>
        )}

        {data.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, data.length)} dari {data.length} artikel
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
