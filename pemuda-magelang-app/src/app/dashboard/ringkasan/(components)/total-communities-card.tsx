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
import { Users2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface TotalCommunitiesCardProps {
  data: {
    total: number;
    active: number;
    inactive: number;
  };
  className?: string;
}

export const TotalCommunitiesCard = ({
  data,
  className,
}: TotalCommunitiesCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;

  if (!isAdmin) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>Komunitas</span>
          <Button variant="outline" size="icon" asChild>
            <Link
              href={
                isAdmin
                  ? "/dashboard/manajemen-pengguna?tab=komunitas"
                  : "/dashboard/komunitas"
              }
            >
              <FiExternalLink />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "Jumlah komunitas yang terdaftar"
            : "Komunitas yang anda ikuti"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-4xl font-bold flex flex-row gap-2 items-center">
          <span>{data.total}</span>
          <Users2 />
        </div>
        <div className="text-sm text-muted-foreground flex flex-col">
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {data.active} komunitas aktif
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            {data.inactive} komunitas tidak aktif
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
