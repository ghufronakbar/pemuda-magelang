import { HubStatusEnum } from "@prisma/client";
import { z } from "zod";

// HUB CATEGORY
export const HubCategorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
});

export type HubCategoryInput = z.infer<typeof HubCategorySchema>;

export const initialHubCategoryInput: HubCategoryInput = {
  name: "",
};

// HUB INPUT
export const HubInputSchema = z.object({
  id: z.string().optional().nullable(),
  hubCategoryId: z.string().min(1, "Kategori tidak boleh kosong"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  description: z.string().min(1, "Deskripsi tidak boleh kosong"),
  status: z.enum(HubStatusEnum, "Status tidak valid"),
  image: z
    .string()
    .optional()
    .nullable(),
  ctaLink: z
    .string()
    .optional()
    .nullable()
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
});

export type HubInput = z.infer<typeof HubInputSchema>;

export const initialHubInput: HubInput = {
  hubCategoryId: "",
  name: "",
  description: "",
  status: HubStatusEnum.active,
  image: null,
  ctaLink: null,
};
