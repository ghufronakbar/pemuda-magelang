import { z } from "zod";
import {
  IconEnum,
  PartnerTypeEnum,
  SocialMediaPlatformEnum,
} from "@prisma/client";

const HeroItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Wajib diisi"),
  value: z.string().min(1, "Wajib diisi"),
});

const AboutItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Wajib diisi"),
  description: z.string().min(1, "Wajib diisi"),
  icon: z.enum(IconEnum),
});

const PartnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Wajib diisi"),
  image: z.string().url("URL tidak valid"),
  href: z.string().url("URL tidak valid"),
  type: z.nativeEnum(PartnerTypeEnum),
});

const AppDataOnlySchema = z.object({
  heroTitle: z.string().min(1, "Wajib diisi"),
  heroDescription: z.string().min(1, "Wajib diisi"),
  heroImage: z.string().url("URL tidak valid"),

  aboutTitle: z.string().min(1, "Wajib diisi"),
  aboutDescription: z.string().min(1, "Wajib diisi"),
  aboutImage: z.string().url("URL tidak valid"),

  brandingTitle: z.string().min(1, "Wajib diisi"),
  brandingDescription: z.string().min(1, "Wajib diisi"),
  brandingVideo: z.string().url("URL tidak valid"),

  pageTerms: z.string().min(1, "Wajib diisi"),
  pagePrivacy: z.string().min(1, "Wajib diisi"),
  pageFaq: z.string().min(1, "Wajib diisi"),
});

const AppSocialMediaSchema = z.object({
  id: z.string().optional(),
  platform: z.enum(SocialMediaPlatformEnum),
  url: z.string().url("URL tidak valid"),
});

export const UpsertAppDataSchema = z.object({
  appData: AppDataOnlySchema,
  heroItems: z.array(HeroItemSchema),
  aboutItems: z.array(AboutItemSchema),
  partners: z.array(PartnerSchema),
  appSocialMedias: z.array(AppSocialMediaSchema),
});

export type UpsertAppDataInput = z.infer<typeof UpsertAppDataSchema>;

export const initialUpsertAppDataInput: UpsertAppDataInput = {
  appData: {
    heroTitle: "",
    heroDescription: "",
    heroImage: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
    brandingTitle: "",
    brandingDescription: "",
    brandingVideo: "",
    pageTerms: "",
    pagePrivacy: "",
    pageFaq: "",
  },
  heroItems: [],
  aboutItems: [],
  partners: [],
  appSocialMedias: [],
};
