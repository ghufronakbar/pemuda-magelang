"use server";

import { db } from "@/lib/db";
import {
  AppDataAboutItemsSchema,
  AppDataAboutSchema,
  AppDataBaseSchema,
  AppDataBrandingSchema,
  AppDataFaqSchema,
  AppDataHeroSchema,
  AppDataPartnerItemsSchema,
  AppDataPrivacySchema,
  AppDataSocialMediaItemsSchema,
  AppDataTermsSchema,
} from "@/validator/app-data";
import { AboutItem, AppData, AppSocialMedia, Partner } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

// GET APP DATA
interface AppDataReturnData extends AppData {
  id: string;
  aboutItems: AboutItem[];
  partners: Partner[];
  appSocialMedias: AppSocialMedia[];
}

const _getAppData = async (): Promise<AppDataReturnData> => {
  const appData: AppDataReturnData = (await db.appData.findFirst({
    where: {
      id: {
        contains: "",
      },
    },
    include: {
      aboutItems: true,
      partners: true,
      appSocialMedias: true,
    },
  })) || {
    id: "",
    baseLogo: "",
    footerText: "",
    // HERO
    heroTitle: "",
    heroDescription: "",
    heroImage: "",
    // ABOUT
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
    aboutItems: [],
    // BRANDING
    brandingTitle: "",
    brandingDescription: "",
    brandingVideo: "",
    // PARTNERS
    partners: [],
    // ADDITIONAL
    pageTerms: "",
    pagePrivacy: "",
    pageFaq: "",
    appSocialMedias: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return appData;
};

const makeGetAppData = () =>
  unstable_cache(async () => _getAppData(), [`app-data`, "v1"], {
    tags: [`app-data`],
    revalidate: 60 * 10, // 10 minutes
  });

export const getAppData = makeGetAppData();

// MUTATION
export const upsertAppDataHero = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataHeroSchema.safeParse(JSON.parse(payload as string));
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        heroImage: data.heroImage,
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
    });
  } else {
    await db.appData.update({
      where: { id: appData.id },
      data: {
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        heroImage: data.heroImage,
      },
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataAbout = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataAboutSchema.safeParse(JSON.parse(payload as string));
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
        heroTitle: "",
        heroDescription: "",
        heroImage: "",
        aboutTitle: data.aboutTitle,
        aboutDescription: data.aboutDescription,
        aboutImage: data.aboutImage,
        brandingTitle: "",
        brandingDescription: "",
        brandingVideo: "",
        pageTerms: "",
        pagePrivacy: "",
        pageFaq: "",
      },
    });
  }
  await db.appData.update({
    where: { id: appData.id },
    data: {
      aboutTitle: data.aboutTitle,
      aboutDescription: data.aboutDescription,
      aboutImage: data.aboutImage,
    },
  });
};

export const upsertAppDataAboutItems = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataAboutItemsSchema.safeParse(
    JSON.parse(payload as string)
  );
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
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
    });
  }
  if (appData.id) {
    await db.$transaction(async (tx) => {
      await tx.aboutItem.deleteMany({
        where: {
          appDataId: appData?.id ?? "",
        },
      });
      await tx.aboutItem.createMany({
        data: data.aboutItems.map((item) => ({
          key: item.title,
          value: item.description,
          icon: item.icon,
          appDataId: appData?.id ?? "",
        })),
      });
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataBranding = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataBrandingSchema.safeParse(
    JSON.parse(payload as string)
  );
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
        heroTitle: "",
        heroDescription: "",
        heroImage: "",
        aboutTitle: "",
        aboutDescription: "",
        aboutImage: "",
        brandingTitle: data.brandingTitle,
        brandingDescription: data.brandingDescription,
        brandingVideo: data.brandingVideo,
        pageTerms: "",
        pagePrivacy: "",
        pageFaq: "",
      },
    });
  } else {
    await db.appData.update({
      where: { id: appData.id },
      data: {
        brandingTitle: data.brandingTitle,
        brandingDescription: data.brandingDescription,
        brandingVideo: data.brandingVideo,
      },
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataPartners = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataPartnerItemsSchema.safeParse(
    JSON.parse(payload as string)
  );
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
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
    });
  }
  if (appData.id) {
    await db.$transaction(async (tx) => {
      await tx.partner.deleteMany({
        where: {
          appDataId: appData?.id ?? "",
        },
      });
      await tx.partner.createMany({
        data: data.partners.map((item) => ({
          name: item.name,
          image: item.image,
          href: item.href,
          type: item.type,
          appDataId: appData?.id ?? "",
        })),
      });
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataSocialMedias = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataSocialMediaItemsSchema.safeParse(
    JSON.parse(payload as string)
  );
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
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
    });
  }

  if (appData.id) {
    await db.$transaction(async (tx) => {
      await tx.appSocialMedia.deleteMany({
        where: {
          appDataId: appData?.id ?? "",
        },
      });
      await tx.appSocialMedia.createMany({
        data: data.socials.map((item) => ({
          platform: item.platform,
          url: item.url,
          appDataId: appData?.id ?? "",
        })),
      });
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataPrivacy = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataPrivacySchema.safeParse(
    JSON.parse(payload as string)
  );
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
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
        pageFaq: "",
        pagePrivacy: data.privacy,
      },
    });
  } else {
    await db.appData.update({
      where: { id: appData.id },
      data: {
        pagePrivacy: data.privacy,
      },
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataTerms = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataTermsSchema.safeParse(JSON.parse(payload as string));
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
        heroTitle: "",
        heroDescription: "",
        heroImage: "",
        aboutTitle: "",
        aboutDescription: "",
        aboutImage: "",
        brandingTitle: "",
        brandingDescription: "",
        brandingVideo: "",
        pageTerms: data.terms,
        pagePrivacy: "",
        pageFaq: "",
      },
    });
  } else {
    await db.appData.update({
      where: { id: appData.id },
      data: {
        pageTerms: data.terms,
      },
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataFaq = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataFaqSchema.safeParse(JSON.parse(payload as string));
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: "",
        footerText: "",
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
        pageFaq: data.faq,
      },
    });
  } else {
    await db.appData.update({
      where: { id: appData.id },
      data: {
        pageFaq: data.faq,
      },
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};

export const upsertAppDataBase = async (formData: FormData) => {
  const payload = formData.get("payload");
  if (!payload) {
    return { error: "Payload tidak ditemukan" };
  }
  const parseData = AppDataBaseSchema.safeParse(JSON.parse(payload as string));
  if (!parseData.success) {
    return { error: parseData.error.message };
  }
  const data = parseData.data;
  let appData = await db.appData.findFirst();
  if (!appData) {
    appData = await db.appData.create({
      data: {
        baseLogo: data.baseLogo,
        footerText: data.footerText,
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
    });
  }
  if (appData.id) {
    await db.appData.update({
      where: { id: appData.id },
      data: {
        baseLogo: data.baseLogo,
        footerText: data.footerText,
      },
    });
  }
  revalidateTag("app-data");
  return { ok: true, result: appData };
};
