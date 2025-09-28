"use client";

import * as React from "react";
import { useFormAppData } from "@/context/form-app-data-context";

// shadcn
import { Form } from "@/components/ui/form";

import { Loader2 } from "lucide-react";

import { FormHero } from "./form-hero";
import { FormAbout } from "./form-about";
import { FormBranding } from "./form-branding";
import { FormPartners } from "./form-partners";
import { SubmitFormAppData } from "./submit-form-app-data";
import { FormSocials } from "./form-socials";
import { FormPrivacy } from "./form-privacy";
import { FormTerms } from "./form-terms";
import { FormFaq } from "./form-faq";

type ShowForm =
  | "hero"
  | "about"
  | "branding"
  | "partners"
  | "socials"
  | "privacy"
  | "terms"
  | "faq";
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

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {shows.includes("hero") && <FormHero />}
        {shows.includes("about") && <FormAbout />}
        {shows.includes("branding") && <FormBranding />}
        {shows.includes("partners") && <FormPartners />}
        {shows.includes("socials") && <FormSocials />}
        {shows.includes("privacy") && <FormPrivacy />}
        {shows.includes("terms") && <FormTerms />}
        {shows.includes("faq") && <FormFaq />}
        <SubmitFormAppData />
      </form>
    </Form>
  );
}
