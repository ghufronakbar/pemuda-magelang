import { db } from "@/lib/db";
import {
  ArticleStatusEnum,
  ProductStatusEnum,
  Role,
  TalentStatusEnum,
} from "@prisma/client";
import { Session } from "next-auth";

import { unstable_cache } from "next/cache";
import { TopArticleCardProps } from "./top-article";

export const getTotalArticle = (sess: Session | null) =>
  unstable_cache(
    async () => {
      if (!sess) {
        return {
          published: 0,
          draft: 0,
          banned: 0,
        };
      }
      const isAdmin = sess.user.role != Role.user;
      const totalArticle = await db.article.findMany({
        where: {
          status: ArticleStatusEnum.published,
          ...(isAdmin ? {} : { userId: sess.user.id }),
        },
        select: {
          status: true,
        },
      });
      return {
        published: totalArticle.filter(
          (article) => article.status === ArticleStatusEnum.published
        ).length,
        draft: totalArticle.filter(
          (article) => article.status === ArticleStatusEnum.draft
        ).length,
        banned: totalArticle.filter(
          (article) => article.status === ArticleStatusEnum.banned
        ).length,
      };
    },
    ["total-article"],
    {
      tags: [`total-article-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTotalProduct = (sess: Session | null) =>
  unstable_cache(
    async () => {
      if (!sess) {
        return {
          published: 0,
          draft: 0,
          banned: 0,
        };
      }
      const isAdmin = sess.user.role != Role.user;
      const totalProduct = await db.product.findMany({
        where: {
          status: ProductStatusEnum.published,
          ...(isAdmin
            ? {}
            : {
                talent: {
                  userId: sess.user.id,
                },
              }),
        },
        select: {
          status: true,
        },
      });
      return {
        published: totalProduct.filter(
          (product) => product.status === ProductStatusEnum.published
        ).length,
        draft: totalProduct.filter(
          (product) => product.status === ProductStatusEnum.draft
        ).length,
        banned: totalProduct.filter(
          (product) => product.status === ProductStatusEnum.banned
        ).length,
      };
    },
    ["total-product"],
    {
      tags: [`total-product-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTopArticle = (
  sess: Session | null
): (() => Promise<TopArticleCardProps["data"]>) =>
  unstable_cache(
    async () => {
      if (!sess) {
        return [];
      }
      const isAdmin = sess.user.role != Role.user;
      const articles = await db.article.findMany({
        where: {
          status: ArticleStatusEnum.published,
          ...(isAdmin ? {} : { userId: sess.user.id }),
        },
        include: {
          user: {
            select: {
              role: true,
            },
          },
          _count: {
            select: {
              articleUserLikes: true,
              comments: true,
              trackViews: true,
            },
          },
        },
      });
      const mappedArticles: TopArticleCardProps["data"] = articles
        .map((article) => {
          return {
            id: article.id,
            slug: article.slug,
            title: article.title,
            thumbnail: article.thumbnailImage,
            category: article.category,
            likes: article._count.articleUserLikes,
            comments: article._count.comments,
            publishedAt: article.createdAt,
            status: article.status,
            type: (article.user.role === Role.user ? "detak" : "gerak") as
              | "detak"
              | "gerak",
            views: article._count.trackViews,
          };
        })
        .sort((a, b) => b.views - a.views);
      return mappedArticles;
    },
    ["top-article"],
    {
      tags: [`top-article-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTotalTalent = (sess: Session | null) =>
  unstable_cache(
    async () => {
      const totalTalent = await db.talent.findMany({
        select: {
          status: true,
        },
      });
      return {
        pending: totalTalent.filter(
          (talent) => talent.status === TalentStatusEnum.pending
        ).length,
        approved: totalTalent.filter(
          (talent) => talent.status === TalentStatusEnum.approved
        ).length,
        rejected: totalTalent.filter(
          (talent) => talent.status === TalentStatusEnum.rejected
        ).length,
        banned: totalTalent.filter(
          (talent) => talent.status === TalentStatusEnum.banned
        ).length,
      };
    },
    ["total-talent"],
    {
      tags: [`total-talent-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTotalUsers = (sess: Session | null) =>
  unstable_cache(
    async () => {
      if (!sess || sess.user.role === Role.user) {
        return {
          total: 0,
          users: 0,
          admins: 0,
          superadmins: 0,
        };
      }
      const users = await db.user.findMany({
        select: {
          role: true,
        },
      });
      return {
        total: users.length,
        users: users.filter((user) => user.role === Role.user).length,
        admins: users.filter((user) => user.role === Role.admin).length,
        superadmins: users.filter((user) => user.role === Role.superadmin).length,
      };
    },
    ["total-users"],
    {
      tags: [`total-users-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTotalCommunities = (sess: Session | null) =>
  unstable_cache(
    async () => {
      if (!sess) {
        return {
          total: 0,
          active: 0,
          inactive: 0,
        };
      }
      const communities = await db.community.findMany({
        select: {
          status: true,
        },
      });
      return {
        total: communities.length,
        active: communities.filter((community) => community.status === "active").length,
        inactive: communities.filter((community) => community.status === "inactive").length,
      };
    },
    ["total-communities"],
    {
      tags: [`total-communities-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTotalZhubPrograms = (sess: Session | null) =>
  unstable_cache(
    async () => {
      if (!sess) {
        return {
          total: 0,
          active: 0,
          inactive: 0,
          soon: 0,
        };
      }
      const programs = await db.hub.findMany({
        select: {
          status: true,
        },
      });
      return {
        total: programs.length,
        active: programs.filter((program) => program.status === "active").length,
        inactive: programs.filter((program) => program.status === "inactive").length,
        soon: programs.filter((program) => program.status === "soon").length,
      };
    },
    ["total-zhub-programs"],
    {
      tags: [`total-zhub-programs-${sess?.user.id}`],
      revalidate: 60,
    }
  );

export const getTags = async (sess: Session | null) => {
  if (!sess) {
    return [];
  }
  return [
    `total-article-${sess.user.id}`,
    `total-product-${sess.user.id}`,
    `top-article-${sess.user.id}`,
    `total-talent-${sess.user.id}`,
    `total-users-${sess.user.id}`,
    `total-communities-${sess.user.id}`,
    `total-zhub-programs-${sess.user.id}`,
  ];
};
