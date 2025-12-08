import { z } from "zod";

export const CommunityInputSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  description: z.string().min(1, "Deskripsi tidak boleh kosong"),
  profilePicture: z.string().min(1, "Gambar tidak boleh kosong"),
  bannerPicture: z.string().min(1, "Gambar tidak boleh kosong"),
  ctaText: z.string().min(1, "CTA tidak boleh kosong"),
  ctaLink: z
    .string()

    .refine(
      (val) => {
        if (val) {
          return z
            .string()
            .url({
              message: "CTA Link tidak valid",
            })
            .safeParse(val).success;
        }
        return true;
      },
      { message: "CTA Link tidak valid" }
    ),
  category: z.string().min(1, "Kategori tidak boleh kosong"),
});

export type CommunityInput = z.infer<typeof CommunityInputSchema>;

export const initialCommunityInput: CommunityInput = {
  name: "",
  description: "",
  profilePicture: "",
  bannerPicture: "",
  ctaText: "",
  ctaLink: "",
  category: "",
};
