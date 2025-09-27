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
import { BookCheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface TotalArticleCardProps {
  data: {
    published: number;
    draft: number;
    banned: number;
  };
  className?: string;
}

export const TotalArticleCard = ({
  data,
  className,
}: TotalArticleCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>{isAdmin ? "Artikel" : "Artikel Saya"}</span>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/${isAdmin ? "gerak" : "detak"}`}>
              <FiExternalLink />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "Jumlah artikel yang terdaftar"
            : "Jumlah artikel yang telah anda tulis"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-4xl font-bold flex flex-row gap-2 items-center">
          <span>{data.published + data.draft + data.banned}</span>
          <BookCheckIcon />
        </div>
        <div className="text-sm text-muted-foreground flex flex-col">
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {data.published} artikel terpublikasi
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            {data.draft} artikel draft
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {data.banned} artikel ditangguhkan
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
