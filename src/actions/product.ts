// actions/talent.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/helper";
import { ProductInputSchema } from "@/validator/product";
import { ProductStatusEnum, TalentStatusEnum } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

// GET ALL PRODUCTS

const _getProducts = async () => {
  const products = await db.product.findMany({
    include: {
      talent: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

const makeGetProducts = () =>
  unstable_cache(async () => _getProducts(), [`products`, "v1"], {
    tags: [`products`],
    revalidate: 300,
  });

export const getAllProducts = makeGetProducts();

// GET DETAIL PRODUCTS

const _getDetailProduct = async (slug: string) => {
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      talent: {
        include: {
          socialMedias: true,
          products: true,
        },
      },
    },
  });
  return product;
};

const makeGetDetailProduct = (slug: string) =>
  unstable_cache(
    async () => _getDetailProduct(slug),
    [`detail-product:${slug}`, "v1"],
    { tags: [`detail-product:${slug}`], revalidate: 300 }
  );

export const getDetailProduct = makeGetDetailProduct;

// GET DETAIL PRODUCT BY ID

const _getDetailProductById = async (id: string) => {
  const product = await db.product.findUnique({
    where: { id },
  });
  return product;
};

const makeGetDetailProductById = (id: string) =>
  unstable_cache(
    async () => _getDetailProductById(id),
    [`detail-product:${id}`, "v1"],
    { tags: [`detail-product:${id}`], revalidate: 300 }
  );

export const getDetailProductById = makeGetDetailProductById;

// SET STATUS PRODUCT

const _setStatusProduct = async (slug: string, formData: FormData) => {
  const isInclude = Object.values(ProductStatusEnum).includes(
    formData.get("status") as ProductStatusEnum
  );
  if (!isInclude) {
    return { ok: false, error: "Status tidak valid" };
  }
  const product = await db.product.update({
    where: { slug },
    data: { status: formData.get("status") as ProductStatusEnum },
    select: {
      slug: true,
      talent: {
        select: {
          slug: true,
        },
      },
      id: true,
    },
  });
  revalidateTag(`detail-product:${product.slug}`);
  revalidateTag(`products`);
  revalidateTag(`detail-talent:${product.talent.slug}`);
  revalidateTag(`talent-products:${product.talent.slug}`);
  revalidateTag(`detail-product:${product.id}`);
  return { ok: true, result: product };
};

export const setStatusProduct = _setStatusProduct;

// DELETE PRODUCT

const _deleteProduct = async (slug: string) => {
  const product = await db.product.delete({
    where: { slug },
    select: {
      slug: true,
      talent: {
        select: {
          slug: true,
        },
      },
      id: true,
    },
  });

  revalidateTag(`detail-product:${product.slug}`);
  revalidateTag(`products`);
  revalidateTag(`detail-talent:${product.talent?.slug}`);
  revalidateTag(`talent-products:${product.talent?.slug}`);
  revalidateTag(`detail-product:${product.id}`);
  return { ok: true, result: product };
};

export const deleteProduct = _deleteProduct;

// CREATE UPDATE PRODUCT

const _createUpdateProduct = async (formData: FormData) => {
  const user = await auth();
  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }
  const talent = await db.talent.findUnique({
    where: {
      userId: user.user.id,
    },
  });
  if (!talent) {
    return { ok: false, error: "Anda bukan talent" };
  }
  if (talent.status !== TalentStatusEnum.approved) {
    return { ok: false, error: "Anda belum terverifikasi" };
  }
  const parseData = ProductInputSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    images: (formData.get("images") as string)?.split(","),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    category: formData.get("category"),
    tags: (formData.get("tags") as string)?.split(","),
    status: formData.get("status"),
  });
  if (!parseData.success) {
    return { ok: false, error: parseData.error.message };
  }
  if (parseData.data.id) {
    const product = await db.product.update({
      where: { id: parseData.data.id },
      data: {
        description: parseData.data.description,
        title: parseData.data.title,
        images: parseData.data.images,
        price: parseData.data.price || null,
        category: parseData.data.category,
        tags: parseData.data.tags,
        slug: generateSlug(parseData.data.title),
        status: parseData.data.status,
      },
    });
    revalidateTag(`detail-product:${product.slug}`);
    revalidateTag(`detail-talent:${talent.slug}`);
    revalidateTag(`products`);
    revalidateTag(`talent-products:${talent.slug}`);
    revalidateTag(`detail-product:${product.id}`);
    return { ok: true, result: product };
  } else {
    const product = await db.product.create({
      data: {
        description: parseData.data.description,
        title: parseData.data.title,
        images: parseData.data.images,
        price: parseData.data.price || null,
        category: parseData.data.category,
        tags: parseData.data.tags,
        slug: generateSlug(parseData.data.title),
        talentId: talent.id,
        status: parseData.data.status,
      },
    });
    revalidateTag(`detail-product:${product.slug}`);
    revalidateTag(`detail-talent:${talent.slug}`);
    revalidateTag(`products`);
    revalidateTag(`talent-products:${talent.slug}`);
    revalidateTag(`detail-product:${product.id}`);
    return { ok: true, result: product };
  }
};

export const createUpdateProduct = _createUpdateProduct;
