"use client";

import {
  getAppData,
  upsertAppDataAbout,
  upsertAppDataAboutItems,
  upsertAppDataBase,
  upsertAppDataBranding,
  upsertAppDataFaq,
  upsertAppDataHero,
  upsertAppDataPartners,
  upsertAppDataPrivacy,
  upsertAppDataSocialMedias,
  upsertAppDataTerms,
} from "@/actions/app-data";
import {
  AppDataAbout,
  AppDataAboutItems,
  AppDataAboutItemsSchema,
  AppDataAboutSchema,
  AppDataBase,
  AppDataBaseSchema,
  AppDataBranding,
  AppDataBrandingSchema,
  AppDataFaq,
  AppDataFaqSchema,
  AppDataHero,
  AppDataHeroSchema,
  AppDataPartnerItems,
  AppDataPartnerItemsSchema,
  AppDataPrivacy,
  AppDataPrivacySchema,
  AppDataSocialMediaItems,
  AppDataSocialMediaItemsSchema,
  AppDataTerms,
  AppDataTermsSchema,
} from "@/validator/app-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormAppDataContext {
  form: {
    hero: UseFormReturn<AppDataHero>;
    about: UseFormReturn<AppDataAbout>;
    aboutItems: UseFormReturn<AppDataAboutItems>;
    branding: UseFormReturn<AppDataBranding>;
    partners: UseFormReturn<AppDataPartnerItems>;
    appSocialMedias: UseFormReturn<AppDataSocialMediaItems>;
    privacy: UseFormReturn<AppDataPrivacy>;
    terms: UseFormReturn<AppDataTerms>;
    faq: UseFormReturn<AppDataFaq>;
    base: UseFormReturn<AppDataBase>;
  };
  loading: boolean;
  onSubmit: {
    hero: () => Promise<void>;
    about: () => Promise<void>;
    aboutItems: () => Promise<void>;
    branding: () => Promise<void>;
    partners: () => Promise<void>;
    appSocialMedias: () => Promise<void>;
    privacy: () => Promise<void>;
    terms: () => Promise<void>;
    faq: () => Promise<void>;
    base: () => Promise<void>;
  };
  submitting: boolean;
}

const FormAppDataContext = createContext<FormAppDataContext | null>(null);

const FormAppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formHero = useForm<AppDataHero>({
    resolver: zodResolver(AppDataHeroSchema),
    defaultValues: {
      heroTitle: "",
      heroDescription: "",
      heroImage: "",
    },
  });
  const formAbout = useForm<AppDataAbout>({
    resolver: zodResolver(AppDataAboutSchema),
    defaultValues: {
      aboutTitle: "",
      aboutDescription: "",
      aboutImage: "",
    },
  });
  const formAboutItems = useForm<AppDataAboutItems>({
    resolver: zodResolver(AppDataAboutItemsSchema),
    defaultValues: {
      aboutItems: [],
    },
  });
  const formBranding = useForm<AppDataBranding>({
    resolver: zodResolver(AppDataBrandingSchema),
    defaultValues: {
      brandingTitle: "",
      brandingDescription: "",
      brandingVideo: "",
    },
  });
  const formPartners = useForm<AppDataPartnerItems>({
    resolver: zodResolver(AppDataPartnerItemsSchema),
    defaultValues: {
      partners: [],
    },
  });
  const formAppSocialMedias = useForm<AppDataSocialMediaItems>({
    resolver: zodResolver(AppDataSocialMediaItemsSchema),
    defaultValues: {
      socials: [],
    },
  });
  const formPrivacy = useForm<AppDataPrivacy>({
    resolver: zodResolver(AppDataPrivacySchema),
    defaultValues: {
      privacy: "",
    },
  });
  const formTerms = useForm<AppDataTerms>({
    resolver: zodResolver(AppDataTermsSchema),
    defaultValues: {
      terms: "",
    },
  });
  const formFaq = useForm<AppDataFaq>({
    resolver: zodResolver(AppDataFaqSchema),
    defaultValues: {
      faq: "",
    },
  });
  const formBase = useForm<AppDataBase>({
    resolver: zodResolver(AppDataBaseSchema),
    defaultValues: {
      baseLogo: "",
      footerText: "",
    },
  });
  useEffect(() => {
    setLoading(true);
    const fetchAppData = async () => {
      try {
        const res = await getAppData();
        formHero.reset({
          heroTitle: res.heroTitle,
          heroDescription: res.heroDescription,
          heroImage: res.heroImage ?? "",
        });
        formAbout.reset({
          aboutTitle: res.aboutTitle,
          aboutDescription: res.aboutDescription,
          aboutImage: res.aboutImage ?? "",
        });
        formAboutItems.reset({
          aboutItems: res.aboutItems?.map((item) => ({
            id: item.id,
            icon: item.icon,
            title: item.key,
            description: item.value,
          })),
        });
        formBranding.reset({
          brandingTitle: res.brandingTitle,
          brandingDescription: res.brandingDescription,
          brandingVideo: res.brandingVideo ?? "",
        });
        formPartners.reset({
          partners: res.partners.map((item) => ({
            id: item.id,
            name: item.name,
            href: item.href,
            image: item.image,
            type: item.type,
          })),
        });
        formAppSocialMedias.reset({
          socials: res.appSocialMedias.map((item) => ({
            id: item.id,
            platform: item.platform,
            url: item.url,
          })),
        });
        formPrivacy.reset({
          privacy: res.pagePrivacy,
        });
        formTerms.reset({
          terms: res.pageTerms,
        });
        formFaq.reset({
          faq: res.pageFaq,
        });
        formBase.reset({
          baseLogo: res.baseLogo,
          footerText: res.footerText,
        });
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchAppData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitHero = formHero.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataHero(fd);
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

  const onSubmitAbout = formAbout.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataAbout(fd);
      if (res?.error) {
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

  const onSubmitAboutItems = formAboutItems.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataAboutItems(fd);
      if (res?.error) {
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

  const onSubmitBranding = formBranding.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataBranding(fd);
      if (res?.error) {
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

  const onSubmitPartners = formPartners.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataPartners(fd);
      if (res?.error) {
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

  const onSubmitAppSocialMedias = formAppSocialMedias.handleSubmit(
    async (data) => {
      try {
        setSubmitting(true);
        const fd = new FormData();
        fd.append("payload", JSON.stringify(data));
        const res = await upsertAppDataSocialMedias(fd);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Data berhasil diubah");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }
  );

  const onSubmitPrivacy = formPrivacy.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataPrivacy(fd);
      if (res?.error) {
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

  const onSubmitTerms = formTerms.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataTerms(fd);
      if (res?.error) {
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

  const onSubmitFaq = formFaq.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataFaq(fd);
      if (res?.error) {
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

  const onSubmitBase = formBase.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await upsertAppDataBase(fd);
      if (res?.error) {
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

  const onSubmit = {
    hero: onSubmitHero,
    about: onSubmitAbout,
    aboutItems: onSubmitAboutItems,
    branding: onSubmitBranding,
    partners: onSubmitPartners,
    appSocialMedias: onSubmitAppSocialMedias,
    privacy: onSubmitPrivacy,
    terms: onSubmitTerms,
    faq: onSubmitFaq,
    base: onSubmitBase,
  };

  const form = {
    hero: formHero,
    about: formAbout,
    aboutItems: formAboutItems,
    branding: formBranding,
    partners: formPartners,
    appSocialMedias: formAppSocialMedias,
    privacy: formPrivacy,
    terms: formTerms,
    faq: formFaq,
    base: formBase,
  };

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
