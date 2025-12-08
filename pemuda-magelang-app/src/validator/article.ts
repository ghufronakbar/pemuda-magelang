import { ArticleStatusEnum, ArticleTypeEnum } from "@prisma/client";
import { z } from "zod";

export const ArticleInputSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(1, "Judul harus diisi"),
  thumbnailImage: z.string().min(1, "Harap unggah gambar"),
  content: z.string().min(1, "Konten harus diisi"),
  category: z.string().min(1, "Kategori harus diisi"),
  communityId: z.string().optional().nullable(),
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
  status: z.enum(ArticleStatusEnum, "Status harus diisi"),
  type: z.enum(ArticleTypeEnum, "Tipe harus diisi"),
});

export type ArticleInput = z.infer<typeof ArticleInputSchema>;

export const initialArticleInput: ArticleInput = {
  title: "",
  thumbnailImage: "",
  content: "",
  category: "",
  tags: [],
  status: ArticleStatusEnum.draft,
  type: ArticleTypeEnum.gerak,
};
