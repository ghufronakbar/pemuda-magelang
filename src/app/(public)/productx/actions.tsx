"use server";

import { db } from "@/lib/db";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
});

export async function createProduct(formData: FormData) {
  const parsed = ProductSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  await db.product.create({ data: parsed.data });

  // invalidate data
  revalidateTag("products");

  // paksa render baru halaman yang sama (UI langsung fresh)
  return { success: true };
}

export const getProducts = unstable_cache(
  async () => {
    await sleep(3000);
    const products = await db.product.findMany();
    return products;
  },
  ["products"],
  { tags: ["products"], revalidate: 300 }
);
