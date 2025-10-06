"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunitySection } from "./community-section";
import { TalentSection } from "@/app/dashboard/(components)/profile/talent-section";

export function KomunitasContent() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Only show for user role
  if (userRole !== "user") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Akses Terbatas</CardTitle>
          <CardDescription>
            Halaman ini hanya tersedia untuk pengguna dengan role User.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="komunitas" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="komunitas">Komunitas</TabsTrigger>
        <TabsTrigger value="talenta">Data Talenta</TabsTrigger>
      </TabsList>

      <TabsContent value="komunitas" className="space-y-4">
        <CommunitySection />
      </TabsContent>

      <TabsContent value="talenta" className="space-y-4">
        <TalentSection />
      </TabsContent>
    </Tabs>
  );
}

