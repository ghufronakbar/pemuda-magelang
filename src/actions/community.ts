"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/helper";

import { CommunityInputSchema } from "@/validator/community";
import { CommunityStatusEnum } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

// GET ALL COMMUNITIES

const _getCommunities = async () => {
  const communities = await db.community.findMany({
    include: {
      user: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return communities;
};

const makeGetCommunities = () =>
  unstable_cache(async () => _getCommunities(), [`communities`, "v1"], {
    tags: [`communities`],
    revalidate: 300,
  });

export const getAllCommunities = makeGetCommunities();

// // GET DETAIL COMMUNITY BY SLUG
const _getDetailCommBySlug = async (slug: string) => {
  const normalizedSlug = decodeURIComponent(slug);
  const community = await db.community.findUnique({
    where: { slug: normalizedSlug },
    include: {
      user: true,
      articles: {
        include: {
          user: true,
          _count: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return community;
};

const makeGetDetailCommunityBySlug = (slug: string) =>
  unstable_cache(
    async () => _getDetailCommBySlug(slug),
    [`detail-community:${slug}`, "v1"],
    { tags: [`detail-community:${slug}`], revalidate: 300 }
  );

export const getDetailCommunityBySlug = makeGetDetailCommunityBySlug;

// // GET DETAIL ARTICLE BY ID
const _getDetailCommunityByUserId = async (userId: string) => {
  const community = await db.community.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });
  return community;
};

const makeGetDetailCommunityByUserId = (userId: string) =>
  unstable_cache(
    async () => _getDetailCommunityByUserId(userId),
    [`detail-community:${userId}`, "v1"],
    { tags: [`detail-community:${userId}`], revalidate: 300 }
  );

export const getDetailCommunityByUserId = makeGetDetailCommunityByUserId;

// SET Community STATUS
const _setCommunityStatus = async (id: string, formData: FormData) => {
  const status = formData.get("status") as CommunityStatusEnum;
  const check = Object.values(CommunityStatusEnum).includes(status);
  if (!check) {
    console.error("INVALID_STATUS", status);
    return { ok: false, error: "INVALID_STATUS" };
  }
  const community = await db.community.update({
    where: { id },
    data: { status },
  });
  revalidateTag("published-articles");
  revalidateTag(`detail-community:${id}`);
  revalidateTag(`detail-community:${community.userId}`);
  revalidateTag(`detail-community:${community.slug}`);
  revalidateTag("communities");
  return { ok: true, result: community };
};

export const setCommunityStatus = _setCommunityStatus;

// DELETE COMMUNITY
const _deleteCommunity = async (id: string) => {
  const community = await db.community.delete({
    where: { id },
  });
  revalidateTag("published-articles");
  revalidateTag(`detail-community:${id}`);
  revalidateTag(`detail-community:${community.userId}`);
  revalidateTag(`detail-community:${community.slug}`);
  revalidateTag("communities");
  return { ok: true, result: community };
};

export const deleteCommunity = _deleteCommunity;

// CREATE ARTICLE
const _createUpdateCommunity = async (formData: FormData) => {
  const user = await auth();
  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }
  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get("payload")));
  } catch (error) {
    console.error(error);
    return { ok: false, error: "INVALID_DATA" };
  }

  const parseData = CommunityInputSchema.safeParse(payload);

  if (!parseData.success) {
    return { ok: false, error: parseData.error.message };
  }

  if (parseData.data.id) {
    const community = await db.community.update({
      where: {
        id: parseData.data.id,
      },
      data: {
        name: parseData.data.name,
        description: parseData.data.description,
        profilePicture: parseData.data.profilePicture,
        bannerPicture: parseData.data.bannerPicture,
        ctaText: parseData.data.ctaText,
        ctaLink: parseData.data.ctaLink,
        category: parseData.data.category,
        slug: generateSlug(parseData.data.name),
      },
    });
    revalidateTag(`detail-community:${community.id}`);
    revalidateTag(`detail-community:${community.slug}`);
    revalidateTag("communities");
    revalidateTag(`detail-community:${community.id}`);
    revalidateTag(`detail-community:${community.userId}`);
    revalidateTag("published-articles");
    return { ok: true, result: community };
  } else {
    const community = await db.community.create({
      data: {
        name: parseData.data.name,
        description: parseData.data.description,
        profilePicture: parseData.data.profilePicture,
        bannerPicture: parseData.data.bannerPicture,
        ctaText: parseData.data.ctaText,
        ctaLink: parseData.data.ctaLink,
        category: parseData.data.category,
        slug: generateSlug(parseData.data.name),
        userId: user.user.id,
        status: "pending",
      },
    });
    revalidateTag("published-articles");
    revalidateTag("communities");
    revalidateTag(`detail-community:${community.slug}`);
    revalidateTag(`detail-community:${community.id}`);
    revalidateTag(`detail-community:${community.userId}`);
    return { ok: true, result: community };
  }
};

export const createUpdateCommunity = _createUpdateCommunity;
