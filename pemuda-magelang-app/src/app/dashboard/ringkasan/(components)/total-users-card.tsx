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
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface TotalUsersCardProps {
  data: {
    total: number;
    users: number;
    admins: number;
    superadmins: number;
  };
  className?: string;
}

export const TotalUsersCard = ({
  data,
  className,
}: TotalUsersCardProps) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role !== Role.user;

  if (!isAdmin) {
    return null; 
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between">
          <span>Pengguna</span>
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/manajemen-pengguna?tab=pengguna">
              <FiExternalLink />
            </Link>
          </Button>
        </CardTitle>
        <CardDescription>
          Jumlah pengguna yang terdaftar di platform
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-4xl font-bold flex flex-row gap-2 items-center">
          <span>{data.total}</span>
          <Users />
        </div>
        <div className="text-sm text-muted-foreground flex flex-col">
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            {data.users} pengguna biasa
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            {data.admins} admin
          </span>
          <span className="flex flex-row gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            {data.superadmins} super admin
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
