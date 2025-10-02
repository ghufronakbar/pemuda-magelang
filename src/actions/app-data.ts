"use server";

import { db } from "@/lib/db";
import { UpsertAppDataInput, UpsertAppDataSchema } from "@/validator/app-data";
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
    revalidate: 300,
  });

export const getAppData = makeGetAppData();

// UPDATE APP DATA
// (sudah ada getAppData milikmu — biarkan)

// ====== Zod schemas (server-side) ======

// ====== ACTION: saveAppData ======

// --------- Upsert Action ---------
export async function upsertAppDataFromForm(formData: FormData) {
  "use server";
  const raw = formData.get("payload");
  if (typeof raw !== "string") {
    return { ok: false, error: "PAYLOAD_MISSING" };
  }

  let parsed: UpsertAppDataInput;
  try {
    parsed = UpsertAppDataSchema.parse(JSON.parse(raw));
  } catch (e) {
    console.error("APPDATA_PARSE_ERROR", e);
    return { ok: false, error: "INVALID_DATA" };
  }

  await db.$transaction(async (tx) => {
    // asumsi hanya ada 1 baris AppData
    const existing = await tx.appData.findFirst({ select: { id: true } });
    const base = {
      heroTitle: parsed.appData.heroTitle,
      heroDescription: parsed.appData.heroDescription,
      heroImage: parsed.appData.heroImage ?? null,

      aboutTitle: parsed.appData.aboutTitle,
      aboutDescription: parsed.appData.aboutDescription,
      aboutImage: parsed.appData.aboutImage ?? null,

      brandingTitle: parsed.appData.brandingTitle,
      brandingDescription: parsed.appData.brandingDescription,
      brandingVideo: parsed.appData.brandingVideo ?? null,

      pageTerms: parsed.appData.pageTerms,
      pagePrivacy: parsed.appData.pagePrivacy,
      pageFaq: parsed.appData.pageFaq,
    };

    const appData = existing
      ? await tx.appData.update({
          where: { id: existing.id },
          data: base,
          select: { id: true },
        })
      : await tx.appData.create({
          data: base,
          select: { id: true },
        });

    // reset relasi biar simpel & konsisten
    await tx.aboutItem.deleteMany({ where: { appDataId: appData.id } });
    await tx.partner.deleteMany({ where: { appDataId: appData.id } });
    await tx.appSocialMedia.deleteMany({ where: { appDataId: appData.id } });

    if (parsed.aboutItems.length) {
      await tx.aboutItem.createMany({
        data: parsed.aboutItems.map((a) => ({
          key: a.title,
          value: a.description,
          icon: a.icon,
          appDataId: appData.id,
        })),
      });
    }

    if (parsed.partners.length) {
      await tx.partner.createMany({
        data: parsed.partners.map((p) => ({
          name: p.name,
          image: p.image,
          href: p.href,
          type: p.type,
          appDataId: appData.id,
        })),
      });
    }

    if (parsed.appSocialMedias.length) {
      await tx.appSocialMedia.createMany({
        data: parsed.appSocialMedias.map((a) => ({
          platform: a.platform,
          url: a.url,
          appDataId: appData.id,
        })),
      });
    }
  });

  // bust cache untuk getAppData()
  revalidateTag("app-data");

  return { ok: true };
}
