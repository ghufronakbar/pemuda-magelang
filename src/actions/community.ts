"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/helper";
import { ArticleInputSchema } from "@/validator/article";
import { CommunityInputSchema } from "@/validator/community";
import {
  ArticleStatusEnum,
  ArticleTypeEnum,
  CommunityStatusEnum,
  Role,
} from "@prisma/client";
import { Session } from "next-auth";
import { revalidateTag, unstable_cache } from "next/cache";

// GET ALL PUBLISHED ARTICLES

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

// // GET DETAIL ARTICLE BY SLUG
// const _getDetailArticle = async (slug: string, session: Session | null) => {
//   const normalizedSlug = decodeURIComponent(slug);
//   const article = await db.article.findUnique({
//     where: { slug: normalizedSlug },
//     include: {
//       _count: true,
//       user: {
//         include: {
//           talent: true,
//         },
//       },
//       comments: {
//         include: {
//           user: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//     },
//   });
//   let likedStatus: "yes" | "yet" | "unauthenticated" = session?.user.id
//     ? "yet"
//     : "unauthenticated";
//   if (article) {
//     await db.article.update({
//       where: { id: article?.id },
//       data: { views: article?.views + 1 },
//     });
//     article.views = article.views + 1;
//     const like = await db.articleUserLike.findFirst({
//       where: {
//         articleId: article?.id,
//         userId: session?.user.id,
//       },
//       select: {
//         id: true,
//       },
//     });
//     likedStatus = like ? "yes" : "yet";
//   }
//   return {
//     data: article,
//     likedStatus: likedStatus,
//   };
// };

// const makeGetDetailArticle = (slug: string, session: Session | null) =>
//   unstable_cache(
//     async () => _getDetailArticle(slug, session),
//     [`detail-article:${slug}`, "v1"],
//     { tags: [`detail-article:${slug}`], revalidate: 300 }
//   );

// export const getDetailArticle = makeGetDetailArticle;

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
