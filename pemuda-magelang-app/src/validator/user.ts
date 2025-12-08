import { z } from "zod";
import { SocialMediaPlatformEnum } from "@prisma/client";

// USER PROFILE
export const UserProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email(),
  profilePicture: z.string().optional().nullable(),
  subdistrict: z.string().min(1, "Kecamatan tidak boleh kosong"),
  village: z.string().min(1, "Kelurahan tidak boleh kosong"),
  street: z.string().min(1, "Alamat tidak boleh kosong"),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;

export const initialUserProfileInput: UserProfileInput = {
  name: "",
  email: "",
  profilePicture: null,
  subdistrict: "",
  village: "",
  street: "",
};

// USER TALENT
export const UserTalentSchema = z.object({
  profession: z.string().min(1, "Profesi tidak boleh kosong"),
  industry: z.string().min(1, "Industri tidak boleh kosong"),
  bannerPicture: z.string().optional().nullable(),
  description: z.string().optional().nullable(),

  socialMedias: z.array(
    z.object({
      platform: z.enum(SocialMediaPlatformEnum),
      url: z.string().url("URL tidak valid").min(1, "URL tidak boleh kosong"),
    })
  ),

  skills: z.array(z.string()).min(1, "Setidaknya isi satu skill"),

  awards: z.array(
    z.object({
      image: z.string().optional().nullable(),
      name: z.string().min(1, "Nama tidak boleh kosong"),
      description: z.string().optional().nullable(),
      date: z.coerce.date("Tanggal tidak boleh kosong"),
    })
  ),

  educations: z.array(
    z
      .object({
        degree: z.string().min(1, "Jenjang pendidikan tidak boleh kosong"),
        schoolName: z.string().min(1, "Nama sekolah tidak boleh kosong"),
        description: z.string().optional().nullable(),
        startDate: z.coerce.date("Tanggal mulai tidak boleh kosong"),
        endDate: z.coerce.date().optional().nullable(),
      })
      .refine((v) => v.endDate == null || v.endDate > v.startDate, {
        message: "Tanggal selesai harus lebih besar daripada tanggal mulai",
        path: ["endDate"],
      })
  ),

  workExperiences: z.array(
    z
      .object({
        companyName: z.string().min(1, "Nama perusahaan tidak boleh kosong"),
        position: z.string().min(1, "Jabatan tidak boleh kosong"),
        description: z.string().optional().nullable(),
        startDate: z.coerce.date("Tanggal mulai tidak boleh kosong"),
        endDate: z.coerce.date().optional().nullable(),
      })
      .refine((v) => v.endDate == null || v.endDate > v.startDate, {
        message: "Tanggal selesai harus lebih besar daripada tanggal mulai",
        path: ["endDate"],
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
  skills: [],
  awards: [],
  educations: [],
  workExperiences: [],
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
