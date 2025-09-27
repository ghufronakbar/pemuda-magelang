// actions/talent.ts
"use server";

import { db } from "@/lib/db";
import { TalentStatusEnum } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

const _getTalents = async () => {
  const talents = await db.talent.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return talents;
};

const makeGetTalents = () =>
  unstable_cache(async () => _getTalents(), [`talents`, "v1"], {
    tags: [`talents`],
    revalidate: 300,
  });

export const getAllTalents = makeGetTalents();

// DETAIL TALENT
const _getDetailTalent = async (slug: string) => {
  const talent = await db.talent.findUnique({
    where: { slug },
    include: {
      products: true,
      socialMedias: true,
      user: {
        include: {
          articles: {
            orderBy: {
              views: "desc",
            },
          },
        },
      },
    },
  });
  return talent;
};

const makeGetDetailTalent = (slug: string) =>
  unstable_cache(
    async () => _getDetailTalent(slug),
    [`detail-talent:${slug}`, "v1"],
    { tags: [`detail-talent:${slug}`], revalidate: 300 }
  );

export const getDetailTalent = makeGetDetailTalent;

// ON SET TALENT

const _setStatusTalent = async (userId: string, formData: FormData) => {
  const isInclude = Object.values(TalentStatusEnum).includes(
    formData.get("status") as TalentStatusEnum
  );
  if (!isInclude) {
    return { ok: false, error: "Status tidak valid" };
  }
  const talent = await db.talent.update({
    where: { userId },
    data: { status: formData.get("status") as TalentStatusEnum },
    select: {
      slug: true,
      id: true,
      userId: true,
    },
  });
  revalidateTag(`detail-talent:${talent.userId}`);
  revalidateTag(`all-users`);
  revalidateTag(`detail-user:${talent.userId}`);
  revalidateTag(`detail-talent:${talent.slug}`);
  revalidateTag(`talents`);
  revalidateTag(`detail-talent:${talent.id}`);
  revalidateTag(`talent-products:${talent.slug}`);
  revalidateTag(`talent-articles:${talent.slug}`);
  revalidateTag(`all-users`);
  return { ok: true, result: talent };
};

export const setStatusTalent = _setStatusTalent;
