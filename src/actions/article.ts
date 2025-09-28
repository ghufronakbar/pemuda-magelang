// actions/articles.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/helper";
import { ArticleInputSchema } from "@/validator/article";
import { ArticleStatusEnum } from "@prisma/client";
import { Session } from "next-auth";
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
const _getDetailArticle = async (slug: string, session: Session | null) => {
  const normalizedSlug = decodeURIComponent(slug);
  const article = await db.article.findUnique({
    where: { slug: normalizedSlug },
    include: {
      _count: true,
      user: {
        include: {
          talent: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  let likedStatus: "yes" | "yet" | "unauthenticated" = session?.user.id
    ? "yet"
    : "unauthenticated";
  if (article) {
    await db.article.update({
      where: { id: article?.id },
      data: { views: article?.views + 1 },
    });
    article.views = article.views + 1;
    const like = await db.articleUserLike.findFirst({
      where: {
        articleId: article?.id,
        userId: session?.user.id,
      },
      select: {
        id: true,
      },
    });
    likedStatus = like ? "yes" : "yet";
  }
  return {
    data: article,
    likedStatus: likedStatus,
  };
};

const makeGetDetailArticle = (slug: string, session: Session | null) =>
  unstable_cache(
    async () => _getDetailArticle(slug, session),
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

// LIKE ARTICLE
const _likeArticle = async (formData: FormData) => {
  const user = await auth();
  const slug = formData.get("slug");
  if (!user) {
    return {
      ok: false,
      error: "Harus login terlebih dahulu",
      result: undefined,
    };
  }
  if (!slug) {
    return { ok: false, error: "Slug tidak ditemukan", result: undefined };
  }
  const article = await db.article.findUnique({
    where: { slug: slug as string },
    select: {
      id: true,
      articleUserLikes: {
        where: {
          userId: user.user.id,
        },
      },
    },
  });
  if (!article) {
    return { ok: false, error: "Artikel tidak ditemukan", result: undefined };
  }
  if (article.articleUserLikes.length > 0) {
    await db.articleUserLike.delete({
      where: {
        id: article.articleUserLikes[0].id,
      },
    });
    revalidateTag(`detail-article:${slug}`);
    revalidateTag("published-articles");
    revalidateTag(`detail-article:${slug}`);
    return { ok: true, result: "unlike", error: null };
  } else {
    await db.articleUserLike.create({
      data: {
        articleId: article.id,
        userId: user.user.id,
      },
    });
    revalidateTag(`detail-article:${slug}`);
    revalidateTag("published-articles");
    revalidateTag(`detail-article:${slug}`);
    return { ok: true, result: "like", error: null };
  }
};

export const likeArticle = _likeArticle;

// COMMENT ARTICLE
const _commentArticle = async (formData: FormData) => {
  const user = await auth();
  const slug = formData.get("slug");
  const content = formData.get("content");
  if (!user) {
    return {
      ok: false,
      error: "Harus login terlebih dahulu",
      result: undefined,
    };
  }
  if (!slug) {
    return { ok: false, error: "Slug tidak ditemukan", result: undefined };
  }
  if (!content) {
    return { ok: false, error: "Konten tidak ditemukan", result: undefined };
  }
  const article = await db.article.findUnique({
    where: { slug: slug as string },
  });
  if (!article) {
    return { ok: false, error: "Artikel tidak ditemukan", result: undefined };
  }
  await db.comment.create({
    data: {
      articleId: article.id,
      userId: user.user.id,
      content: content as string,
    },
  });
  revalidateTag(`detail-article:${slug}`);
  revalidateTag("published-articles");
  revalidateTag(`detail-article:${slug}`);
  return { ok: true, result: "comment", error: null };
};

export const commentArticle = _commentArticle;

// DELETE COMMENT ARTICLE
const _deleteCommentArticle = async (formData: FormData) => {
  const commentId = formData.get("commentId");
  if (!commentId) {
    return {
      ok: false,
      error: "Comment ID tidak ditemukan",
      result: undefined,
    };
  }
  const comment = await db.comment.delete({
    where: { id: commentId as string },
    select: {
      article: {
        select: {
          slug: true,
          id: true,
        },
      },
    },
  });
  revalidateTag(`detail-article:${comment.article.slug}`);
  revalidateTag("published-articles");
  revalidateTag(`detail-article:${comment.article.id}`);
  return { ok: true, result: "delete comment", error: null };
};

export const deleteCommentArticle = _deleteCommentArticle;
