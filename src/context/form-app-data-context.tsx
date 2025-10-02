"use client";

import { getAppData, upsertAppDataFromForm } from "@/actions/app-data";
import {
  UpsertAppDataInput,
  UpsertAppDataSchema,
  initialUpsertAppDataInput,
} from "@/validator/app-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormAppDataContext {
  form: UseFormReturn<UpsertAppDataInput>;
  loading: boolean;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

const FormAppDataContext = createContext<FormAppDataContext | null>(null);

const FormAppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<UpsertAppDataInput>({
    resolver: zodResolver(UpsertAppDataSchema),
    defaultValues: initialUpsertAppDataInput,
  });

  useEffect(() => {
    setLoading(true);
    const fetchAppData = async () => {
      try {
        const res = await getAppData();
        form.reset({
          appData: {
            heroTitle: res.heroTitle,
            heroDescription: res.heroDescription,
            heroImage: res.heroImage ?? "",
            aboutTitle: res.aboutTitle,
            aboutDescription: res.aboutDescription,
            aboutImage: res.aboutImage ?? "",
            brandingTitle: res.brandingTitle,
            brandingDescription: res.brandingDescription,
            brandingVideo: res.brandingVideo ?? "",
            pageTerms: res.pageTerms,
            pagePrivacy: res.pagePrivacy,
            pageFaq: res.pageFaq,
          },
          aboutItems: res.aboutItems.map((item) => ({
            id: item.id,
            title: item.key,
            description: item.value,
            icon: item.icon,
          })),
          partners: res.partners.map((item) => ({
            id: item.id,
            name: item.name,
            href: item.href,
            image: item.image,
            type: item.type,
          })),
          appSocialMedias: res.appSocialMedias.map((item) => ({
            id: item.id,
            platform: item.platform,
            url: item.url,
          })),
        });
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchAppData();
  }, []);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (loading) return;
      if (submitting) return;
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataFromForm(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Data berhasil diubah");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormAppDataContext.Provider
      value={{ form, loading, onSubmit, submitting }}
    >
      {children}
    </FormAppDataContext.Provider>
  );
};

const useFormAppData = () => {
  const context = useContext(FormAppDataContext);
  if (!context) {
    throw new Error("useFormAppData must be used within a FormAppDataProvider");
  }
  return context;
};

export { FormAppDataProvider, useFormAppData };
