import { z } from "zod";
import {
  IconEnum,
  PartnerTypeEnum,
  SocialMediaPlatformEnum,
} from "@prisma/client";

// new
export const AppDataHeroSchema = z.object({
  heroTitle: z.string().min(1, "Wajib diisi"),
  heroDescription: z.string().min(1, "Wajib diisi"),
  heroImage: z.string().url("Gambar tidak valid"),
});

export type AppDataHero = z.infer<typeof AppDataHeroSchema>;

export const AppDataAboutSchema = z.object({
  aboutTitle: z.string().min(1, "Wajib diisi"),
  aboutDescription: z.string().min(1, "Wajib diisi"),
  aboutImage: z.string().url("Gambar tidak valid"),
});

export type AppDataAbout = z.infer<typeof AppDataAboutSchema>;

export const AppDataAboutItemsSchema = z.object({
  aboutItems: z.array(
    z.object({
      title: z.string().min(1, "Wajib diisi"),
      description: z.string().min(1, "Wajib diisi"),
      icon: z.enum(IconEnum),
    })
  ),
});

export type AppDataAboutItems = z.infer<typeof AppDataAboutItemsSchema>;

export const AppDataBrandingSchema = z.object({
  brandingTitle: z.string().min(1, "Wajib diisi"),
  brandingDescription: z.string().min(1, "Wajib diisi"),
  brandingVideo: z
    .string()
    .url("URL tidak valid")
    .refine((url) => url.startsWith("http"), {
      message: "URL tidak valid",
    }),
});

export type AppDataBranding = z.infer<typeof AppDataBrandingSchema>;

export const AppDataPartnerItemsSchema = z.object({
  partners: z.array(
    z.object({
      name: z.string().min(1, "Wajib diisi"),
      image: z.string().url("Gambar tidak valid"),
      href: z
        .string()
        .url("URL tidak valid")
        .refine((url) => url.startsWith("http"), {
          message: "URL tidak valid",
        }),
      type: z.enum(PartnerTypeEnum),
    })
  ),
});

export type AppDataPartnerItems = z.infer<typeof AppDataPartnerItemsSchema>;

export const AppDataSocialMediaItemsSchema = z.object({
  socials: z.array(
    z.object({
      platform: z.enum(SocialMediaPlatformEnum),
      url: z
        .string()
        .url("URL tidak valid")
        .refine((url) => url.startsWith("http"), {
          message: "URL tidak valid",
        }),
    })
  ),
});

export type AppDataSocialMediaItems = z.infer<
  typeof AppDataSocialMediaItemsSchema
>;

export const AppDataPrivacySchema = z.object({
  privacy: z.string().min(1, "Wajib diisi"),
});

export type AppDataPrivacy = z.infer<typeof AppDataPrivacySchema>;

export const AppDataTermsSchema = z.object({
  terms: z.string().min(1, "Wajib diisi"),
});

export type AppDataTerms = z.infer<typeof AppDataTermsSchema>;

export const AppDataFaqSchema = z.object({
  faq: z.string().min(1, "Wajib diisi"),
});

export type AppDataFaq = z.infer<typeof AppDataFaqSchema>;
