"use client";

import * as React from "react";
import { useFormAppData } from "@/context/form-app-data-context";

// shadcn
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Loader2 } from "lucide-react";

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
      { value: "privacy", label: "Privasi", show: shows.includes("privacy") },
      { value: "terms", label: "Ketentuan", show: shows.includes("terms") },
      { value: "faq", label: "FAQ", show: shows.includes("faq") },
    ];

    const visibleContentTabs = contentTabs.filter(tab => tab.show);

    return (
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Tabs defaultValue={visibleContentTabs[0]?.value} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {visibleContentTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {shows.includes("privacy") && (
              <TabsContent value="privacy" className="mt-4">
                <FormPrivacy />
              </TabsContent>
            )}

            {shows.includes("terms") && (
              <TabsContent value="terms" className="mt-4">
                <FormTerms />
              </TabsContent>
            )}

            {shows.includes("faq") && (
              <TabsContent value="faq" className="mt-4">
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
    { value: "hero", label: "Hero", show: shows.includes("hero") },
    { value: "about", label: "About", show: shows.includes("about") },
    { value: "highlight", label: "Highlight", show: shows.includes("about") },
    { value: "branding", label: "Branding", show: shows.includes("branding") },
    { value: "partners", label: "Partners", show: shows.includes("partners") },
    { value: "socials", label: "Social Media", show: shows.includes("socials") },
    { value: "kategori-zhub", label: "Kategori Zhub", show: shows.includes("kategori-zhub") },
  ];

  const visibleTabs = websiteTabs.filter(tab => tab.show);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Tabs defaultValue={visibleTabs[0]?.value} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {shows.includes("hero") && (
            <TabsContent value="hero" className="mt-4">
              <FormHero />
            </TabsContent>
          )}

          {shows.includes("about") && (
            <>
              <TabsContent value="about" className="mt-4">
                <FormAbout />
              </TabsContent>
              <TabsContent value="highlight" className="mt-4">
                <FormAboutHighlights />
              </TabsContent>
            </>
          )}

          {shows.includes("branding") && (
            <TabsContent value="branding" className="mt-4">
              <FormBranding />
            </TabsContent>
          )}

          {shows.includes("partners") && (
            <TabsContent value="partners" className="mt-4">
              <FormPartners />
            </TabsContent>
          )}

          {shows.includes("socials") && (
            <TabsContent value="socials" className="mt-4">
              <FormSocials />
            </TabsContent>
          )}

          {shows.includes("kategori-zhub") && (
            <TabsContent value="kategori-zhub" className="mt-4">
              <FormKategoriZhub />
            </TabsContent>
          )}
        </Tabs>
      </form>
    </Form>
  );
}
