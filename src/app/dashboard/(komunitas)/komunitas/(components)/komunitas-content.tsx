import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunitySection } from "./community-section";
import { TalentSection } from "@/app/dashboard/(components)/profile/talent-section";

export function KomunitasContent() {
  return (
    <Tabs defaultValue="komunitas" className="w-full">
      <TabsList className="w-full flex flex-row gap-2 justify-start overflow-x-auto scrollbar-hide">
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
