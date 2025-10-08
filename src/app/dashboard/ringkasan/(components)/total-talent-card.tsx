"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface TotalTalentCardProps {
  data: {
    pending: number;
    approved: number;
    rejected: number;
    banned: number;
  };
  className?: string;
}

export const TotalTalentCard = ({ data, className }: TotalTalentCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;

  if (!isAdmin) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>Talenta</span>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/manajemen-pengguna?tab=talenta">
              <FiExternalLink />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>Talenta yang terdaftar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-4xl font-bold flex flex-row gap-2 items-center">
          <span>
            {data.pending + data.approved + data.rejected + data.banned}
          </span>
          <Sparkles />
        </div>
        <div className="text-sm text-muted-foreground flex flex-col">
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {data.approved} talenta terverifikasi
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            {data.pending} talenta pending (menunggu verifikasi)
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {data.rejected} talenta ditolak
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            {data.banned} talenta ditangguhkan
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
