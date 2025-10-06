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
import { Package } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface TotalZhubProgramsCardProps {
  data: {
    total: number;
    active: number;
    inactive: number;
    soon: number;
  };
  className?: string;
}

export const TotalZhubProgramsCard = ({
  data,
  className,
}: TotalZhubProgramsCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;

  if (!isAdmin) {
    return null; // Don't show for regular users
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>Program Zhub</span>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/program-zhub">
              <FiExternalLink />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          Jumlah program Zhub yang tersedia
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-4xl font-bold flex flex-row gap-2 items-center">
          <span>{data.total}</span>
          <Package />
        </div>
        <div className="text-sm text-muted-foreground flex flex-col">
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {data.active} program aktif
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            {data.soon} program segera
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            {data.inactive} program tidak aktif
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
