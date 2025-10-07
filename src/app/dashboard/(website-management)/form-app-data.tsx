"use client";

import * as React from "react";
import { useFormAppData } from "@/context/form-app-data-context";

// shadcn
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Loader2, Home, Info, Sparkles, Users2, Share2, Grid3x3, FileText, Shield, HelpCircle } from "lucide-react";

import { FormHero } from "./form-hero";
import { FormAbout, FormAboutHighlights } from "./form-about";
import { FormBranding } from "./form-branding";
import { FormPartners } from "./form-partners";
import { FormSocials } from "./form-socials";
import { FormPrivacy } from "./form-privacy";
import { FormTerms } from "./form-terms";
import { FormFaq } from "./form-faq";
import { FormKategoriZhub } from "./form-kategori-zhub";

type ShowForm =
  | "hero"
  | "about"
  | "branding"
  | "partners"
  | "socials"
  | "privacy"
  | "terms"
  | "faq"
  | "kategori-zhub";

interface FormAppDataProps {
  shows: ShowForm[];
}

export function FormAppData({ shows }: FormAppDataProps) {
  const { form, loading, onSubmit } = useFormAppData();

  if (loading) {
    return (
      <div className="flex h-[240px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  // Check if this is a content pages (privacy, terms, faq) or website management
  const isContentPages = shows.includes("privacy") || shows.includes("terms") || shows.includes("faq");
  
  if (isContentPages) {
    // Content pages with tabs
    const contentTabs = [
      { value: "privacy", label: "Privasi", icon: Shield, show: shows.includes("privacy") },
      { value: "terms", label: "Ketentuan", icon: FileText, show: shows.includes("terms") },
      { value: "faq", label: "FAQ", icon: HelpCircle, show: shows.includes("faq") },
    ];

    const visibleContentTabs = contentTabs.filter(tab => tab.show);

    return (
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Tabs defaultValue={visibleContentTabs[0]?.value} className="w-full">
            <TabsList className="flex w-full h-12 gap-1 bg-muted/50 p-1 rounded-xl">
              {visibleContentTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {shows.includes("privacy") && (
              <TabsContent value="privacy" className="mt-6">
                <FormPrivacy />
              </TabsContent>
            )}

            {shows.includes("terms") && (
              <TabsContent value="terms" className="mt-6">
                <FormTerms />
              </TabsContent>
            )}

            {shows.includes("faq") && (
              <TabsContent value="faq" className="mt-6">
                <FormFaq />
              </TabsContent>
            )}
          </Tabs>
        </form>
      </Form>
    );
  }

  // Website management sections with tabs
  const websiteTabs = [
    { value: "hero", label: "Hero", icon: Home, show: shows.includes("hero") },
    { value: "about", label: "About", icon: Info, show: shows.includes("about") },
    { value: "highlight", label: "Highlight", icon: Sparkles, show: shows.includes("about") },
    { value: "branding", label: "Branding", icon: Sparkles, show: shows.includes("branding") },
    { value: "partners", label: "Partners", icon: Users2, show: shows.includes("partners") },
    { value: "socials", label: "Social Media", icon: Share2, show: shows.includes("socials") },
    { value: "kategori-zhub", label: "Kategori Zhub", icon: Grid3x3, show: shows.includes("kategori-zhub") },
  ];

  const visibleTabs = websiteTabs.filter(tab => tab.show);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Tabs defaultValue={visibleTabs[0]?.value} className="w-full">
          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <TabsList className={`grid w-full h-12 gap-1 bg-muted/50 p-1 rounded-xl`} style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))` }}>
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Mobile/Tablet Tabs - Scrollable */}
          <div className="lg:hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex w-max h-12 gap-1 bg-muted/50 p-1 rounded-xl min-w-full">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {shows.includes("hero") && (
            <TabsContent value="hero" className="mt-6">
              <FormHero />
            </TabsContent>
          )}

          {shows.includes("about") && (
            <>
              <TabsContent value="about" className="mt-6">
                <FormAbout />
              </TabsContent>
              <TabsContent value="highlight" className="mt-6">
                <FormAboutHighlights />
              </TabsContent>
            </>
          )}

          {shows.includes("branding") && (
            <TabsContent value="branding" className="mt-6">
              <FormBranding />
            </TabsContent>
          )}

          {shows.includes("partners") && (
            <TabsContent value="partners" className="mt-6">
              <FormPartners />
            </TabsContent>
          )}

          {shows.includes("socials") && (
            <TabsContent value="socials" className="mt-6">
              <FormSocials />
            </TabsContent>
          )}

          {shows.includes("kategori-zhub") && (
            <TabsContent value="kategori-zhub" className="mt-6">
              <FormKategoriZhub />
            </TabsContent>
          )}
        </Tabs>
      </form>
    </Form>
  );
}
