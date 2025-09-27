// actions/articles.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/helper";
import { ArticleInputSchema } from "@/validator/article";
import { ArticleStatusEnum } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

// GET ALL PUBLISHED ARTICLES

const _getArticles = async () => {
  const articles = await db.article.findMany({
    include: {
      user: {
        include: {
          talent: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return articles;
};

const makeGetArticles = () =>
  unstable_cache(async () => _getArticles(), [`published-articles`, "v1"], {
    tags: [`published-articles`],
    revalidate: 300,
  });

export const getArticles = makeGetArticles();

// GET DETAIL ARTICLE BY SLUG
const _getDetailArticle = async (slug: string) => {
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      user: {
        include: {
          talent: true,
        },
      },
    },
  });
  return article;
};

const makeGetDetailArticle = (slug: string) =>
  unstable_cache(
    async () => _getDetailArticle(slug),
    [`detail-article:${slug}`, "v1"],
    { tags: [`detail-article:${slug}`], revalidate: 300 }
  );

export const getDetailArticle = makeGetDetailArticle;

// GET DETAIL ARTICLE BY ID
const _getDetailArticleById = async (id: string) => {
  const article = await db.article.findUnique({
    where: { id },
  });
  return article;
};

const makeGetDetailArticleById = (id: string) =>
  unstable_cache(
    async () => _getDetailArticleById(id),
    [`detail-article:${id}`, "v1"],
    { tags: [`detail-article:${id}`], revalidate: 300 }
  );

export const getDetailArticleById = makeGetDetailArticleById;

// SET ARTICLE STATUS
const _setArticleStatus = async (slug: string, formData: FormData) => {
  const status = formData.get("status") as ArticleStatusEnum;
  const check = Object.values(ArticleStatusEnum).includes(status);
  if (!check) {
    console.error("INVALID_STATUS", status);
    return { ok: false, error: "INVALID_STATUS" };
  }
  await db.article.update({
    where: { slug },
    data: { status },
  });
  revalidateTag("published-articles");
  revalidateTag(`detail-article:${slug}`);
};

export const setArticleStatus = _setArticleStatus;

// DELETE ARTICLE
const _deleteArticle = async (slug: string) => {
  await db.article.delete({
    where: { slug },
  });
  revalidateTag("published-articles");
  revalidateTag(`detail-article:${slug}`);
};

export const deleteArticle = _deleteArticle;

// CREATE ARTICLE
const _createUpdateArticle = async (formData: FormData) => {
  const user = await auth();
  if (!user) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  const parseData = ArticleInputSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    tags: (formData.get("tags") as string)?.split(","),
    thumbnailImage: formData.get("thumbnailImage") as string,
    content: formData.get("content") as string,
    userId: user.user.id,
    status: formData.get("status"),
  });

  if (!parseData.success) {
    return { ok: false, error: parseData.error.message };
  }

  if (parseData.data.id) {
    const article = await db.article.update({
      where: {
        id: parseData.data.id,
      },
      data: {
        category: parseData.data.category,
        tags: parseData.data.tags,
        thumbnailImage: parseData.data.thumbnailImage,
        content: parseData.data.content,
        status: parseData.data.status,
        title: parseData.data.title,
        slug: generateSlug(parseData.data.title),
      },
    });
    revalidateTag(`detail-article:${article.id}`);
    revalidateTag(`detail-article:${article.slug}`);
    revalidateTag("published-articles");
    return { ok: true, result: article };
  } else {
    const article = await db.article.create({
      data: {
        category: parseData.data.category,
        tags: parseData.data.tags,
        thumbnailImage: parseData.data.thumbnailImage,
        content: parseData.data.content,
        status: parseData.data.status,
        title: parseData.data.title,
        views: 0,
        userId: user.user.id,
        slug: generateSlug(parseData.data.title),
      },
    });
    revalidateTag("published-articles");
    revalidateTag(`detail-article:${article.slug}`);
    return { ok: true, result: article };
  }
};

export const createUpdateArticle = _createUpdateArticle;
