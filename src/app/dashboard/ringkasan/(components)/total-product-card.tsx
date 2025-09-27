"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Role } from "@prisma/client";
import { PackageCheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";

interface TotalProductCardProps {
  data: {
    published: number;
    draft: number;
    banned: number;
  };
  className?: string;
}

export const TotalProductCard = ({
  data,
  className,
}: TotalProductCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>{isAdmin ? "Produk" : "Produk Saya"}</span>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/${isAdmin ? "gerak" : "detak"}`}>
              <FiExternalLink />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "Jumlah produk yang terdaftar"
            : "Jumlah produk yang telah anda buat"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-4xl font-bold flex flex-row gap-2 items-center">
          <span>{data.published + data.draft + data.banned}</span>
          <PackageCheckIcon />
        </div>
        <div className="text-sm text-muted-foreground flex flex-col">
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {data.published} produk terpublikasi
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            {data.draft} produk draft
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {data.banned} produk ditangguhkan
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
