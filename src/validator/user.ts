import { z } from "zod";
import { SocialMediaPlatformEnum } from "@prisma/client";

// USER PROFILE
export const UserProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email(),
  profilePicture: z.string().optional().nullable(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;

export const initialUserProfileInput: UserProfileInput = {
  name: "",
  email: "",
  profilePicture: null,
};

// USER TALENT
export const UserTalentSchema = z.object({
  profession: z.string().min(1, "Profesi tidak boleh kosong"),
  industry: z.string().min(1, "Industri tidak boleh kosong"),
  bannerPicture: z.string().url("URL Gambar tidak valid").optional().nullable(),
  description: z.string().optional().nullable(),
  socialMedias: z.array(
    z.object({
      platform: z.enum(SocialMediaPlatformEnum),
      url: z.string().url("URL tidak valid").min(1, "URL tidak boleh kosong"),
    })
  ),
});

export type UserTalentInput = z.infer<typeof UserTalentSchema>;

export const initialUserTalentInput: UserTalentInput = {
  profession: "",
  industry: "",
  bannerPicture: null,
  description: null,
  socialMedias: [],
};

// USER PASSWORD
export const UserPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password tidak boleh kosong"),
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });

export type UserPasswordInput = z.infer<typeof UserPasswordSchema>;

export const initialUserPasswordInput: UserPasswordInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// CREATE ADMIN
export const UserCreateAdminSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
});

export type UserCreateAdminInput = z.infer<typeof UserCreateAdminSchema>;

export const initialUserCreateAdminInput: UserCreateAdminInput = {
  name: "",
  email: "",
};
