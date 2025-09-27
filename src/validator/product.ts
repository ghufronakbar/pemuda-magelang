import { ProductStatusEnum } from "@prisma/client";
import { z } from "zod";

export const ProductInputSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(1, "Judul harus diisi"),
  images: z
    .array(z.string().min(1, "Gambar harus diisi").url("Gambar harus valid"))
    .min(1, "Gambar harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  // price: z.coerce.number().optional(),
  price: z.number().optional(),
  category: z.string().min(1, "Kategori harus diisi"),
  status: z.enum(ProductStatusEnum, "Status harus diisi"),
  tags: z
    .array(
      z
        .string()
        .min(1, "Tag kosong")
        .max(30, "Tag terlalu panjang")
        .regex(/^[^,\s].*$/, "Tag tidak boleh diawali spasi/koma")
    )
    .min(1, "Minimal satu tag")
    .max(10, "Maksimal 10 tag")
    .transform((arr) => {
      // unique & trimming/normalizing ringan
      const seen = new Set<string>();
      return arr
        .map((t) => t.trim().replace(/^#/, "").toLowerCase())
        .filter((t) => {
          if (!t) return false;
          if (seen.has(t)) return false;
          seen.add(t);
          return true;
        });
    }),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

export const initialProductInput: ProductInput = {
  id: null,
  title: "",
  images: [],
  description: "",
  category: "",
  tags: [],
  price: 0,
  status: ProductStatusEnum.published,
};
