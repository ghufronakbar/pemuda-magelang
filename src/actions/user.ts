"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/helper";
import bcrypt from "bcryptjs";
import {
  UserCreateAdminSchema,
  UserPasswordSchema,
  UserProfileSchema,
  UserTalentSchema,
} from "@/validator/user";
import {
  ArticleStatusEnum,
  ProductStatusEnum,
  Role,
  TalentStatusEnum,
} from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

// GET ALL PRODUCTS

const _getAllUsers = async () => {
  const users = await db.user.findMany({
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: ArticleStatusEnum.published,
            },
          },
        },
      },
      talent: {
        include: {
          _count: {
            select: {
              products: {
                where: {
                  status: ProductStatusEnum.published,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
};

const makeGetUsers = () =>
  unstable_cache(async () => _getAllUsers(), [`all-users`, "v1"], {
    tags: [`all-users`],
    revalidate: 300,
  });

export const getAllUsers = makeGetUsers();

// DELETE USER

const _deleteUser = async (id: string) => {
  const user = await db.user.delete({
    where: { id },
    select: { talent: { select: { id: true, slug: true } } },
  });
  revalidateTag(`all-users`);
  revalidateTag(`detail-user:${id}`);
  revalidateTag(`talents`);
  revalidateTag(`detail-talent:${user.talent?.id}`);
  revalidateTag(`detail-talent:${user.talent?.slug}`);
  return { ok: true, result: id };
};

export const deleteUser = _deleteUser;

// GET DETAIL USER

const _getDetailUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      talent: {
        include: {
          socialMedias: true,
          workExperiences: {
            orderBy: {
              startDate: "desc",
            },
          },
          educations: {
            orderBy: {
              startDate: "desc",
            },
          },
          awards: {
            orderBy: {
              date: "desc",
            },
          },
        },
      },
    },
  });
  return user;
};

const makeGetDetailUser = (id: string) =>
  unstable_cache(async () => _getDetailUser(id), [`detail-user:${id}`, "v1"], {
    tags: [`detail-user:${id}`],
    revalidate: 300,
  });

export const getDetailUser = makeGetDetailUser;

// UPDATE USER
const _updateUser = async (formData: FormData) => {
  const user = await auth();
  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const checkUser = await db.user.findUnique({
    where: { id: user.user.id },
    select: {
      talent: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });
  if (!checkUser) {
    return { ok: false, error: "User not found" };
  }

  const parsedData = UserProfileSchema.safeParse({
    name: formData.get("name"),
    profilePicture: formData.get("profilePicture"),
    email: formData.get("email"),
    subdistrict: formData.get("subdistrict"),
    village: formData.get("village"),
    street: formData.get("street"),
  });

  if (!parsedData.success) {
    return { ok: false, error: parsedData.error.message };
  }

  const updatedUser = await db.user.update({
    where: { id: user.user.id },
    data: {
      name: parsedData.data.name,
      profilePicture: parsedData.data.profilePicture,
      subdistrict: parsedData.data.subdistrict,
      village: parsedData.data.village,
      street: parsedData.data.street,
      talent: checkUser.talent
        ? {
            update: {
              name: parsedData.data.name,
              slug: generateSlug(parsedData.data.name),
              profilePicture: parsedData.data.profilePicture,
            },
          }
        : undefined,
    },
    select: {
      talent: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });
  revalidateTag(`detail-user:${user.user.id}`);
  revalidateTag(`all-users`);
  revalidateTag(`detail-talent:${updatedUser.talent?.id}`);
  revalidateTag(`detail-talent:${updatedUser.talent?.slug}`);
  revalidateTag(`talents`);

  return { ok: true, result: updatedUser };
};

export const updateUser = _updateUser;

// UPDATE USER PASSWORD
const _updateUserPassword = async (formData: FormData) => {
  const user = await auth();
  if (!user) {
    return { ok: false, error: "Unauthorized" };
  }

  const checkUser = await db.user.findUnique({
    where: { id: user.user.id },
    select: { password: true },
  });
  if (!checkUser) {
    return { ok: false, error: "User not found" };
  }

  const parsedData = UserPasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedData.success) {
    return { ok: false, error: parsedData.error.message };
  }

  const isPasswordCorrect = await bcrypt.compare(
    parsedData.data.currentPassword,
    checkUser.password
  );
  if (!isPasswordCorrect) {
    return { ok: false, error: "Password lama salah" };
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.newPassword, 10);

  const updatedUser = await db.user.update({
    where: { id: user.user.id },
    data: {
      password: hashedPassword,
    },
  });
  return { ok: true, result: updatedUser };
};

export const updateUserPassword = _updateUserPassword;

// UPDATE USER TALENT
const _updateUserTalent = async (formData: FormData) => {
  const user = await auth();
  if (!user || user.user.role !== "user" || !user.user.name || !user.user.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const checkUser = await db.user.findUnique({
    where: { id: user.user.id },
    select: { talent: { select: { id: true, slug: true, status: true } } },
  });
  if (!checkUser) {
    return { ok: false, error: "Pengguna tidak ditemukan" };
  }
  let parsedPayload: unknown = {};
  try {
    parsedPayload = JSON.parse(String(formData.get("payload")) || "{}");
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Social media tidak valid" };
  }
  const parsedData = UserTalentSchema.safeParse(parsedPayload);
  if (!parsedData.success) {
    return { ok: false, error: parsedData.error.message };
  }
  if (!checkUser.talent) {
    const createdTalent = await db.talent.create({
      data: {
        name: user.user.name,
        slug: generateSlug(user.user.name),
        profilePicture: user.user.image,
        industry: parsedData.data.industry,
        profession: parsedData.data.profession,
        bannerPicture: parsedData.data.bannerPicture,
        description: parsedData.data.description,
        status: TalentStatusEnum.pending,
        skills: parsedData.data.skills,
        socialMedias:
          parsedData.data.socialMedias.length > 0
            ? {
                createMany: {
                  data: parsedData.data.socialMedias.map((socialMedia) => ({
                    platform: socialMedia.platform,
                    url: socialMedia.url,
                  })),
                },
              }
            : undefined,
        user: {
          connect: {
            id: user.user.id,
          },
        },
        workExperiences:
          parsedData.data.workExperiences.length > 0
            ? {
                createMany: {
                  data: parsedData.data.workExperiences.map(
                    (workExperience) => ({
                      companyName: workExperience.companyName,
                      position: workExperience.position,
                      startDate: workExperience.startDate,
                      endDate: workExperience.endDate,
                      description: workExperience.description,
                    })
                  ),
                },
              }
            : undefined,
        educations:
          parsedData.data.educations.length > 0
            ? {
                createMany: {
                  data: parsedData.data.educations.map((education) => ({
                    degree: education.degree,
                    schoolName: education.schoolName,
                    startDate: education.startDate,
                    endDate: education.endDate,
                    description: education.description,
                  })),
                },
              }
            : undefined,
        awards:
          parsedData.data.awards.length > 0
            ? {
                createMany: {
                  data: parsedData.data.awards.map((award) => ({
                    name: award.name,
                    description: award.description,
                    date: award.date,
                    image: award.image || null,
                  })),
                },
              }
            : undefined,
      },
    });
    revalidateTag(`detail-talent:${createdTalent.id}`);
    revalidateTag(`detail-talent:${createdTalent.slug}`);
    const encodedSlug = encodeURIComponent(createdTalent.slug);
    revalidateTag(`detail-talent:${encodedSlug}`);
    revalidateTag(`talents`);
    revalidateTag(`all-users`);
    revalidateTag(`detail-user:${user.user.id}`);
    return { ok: true, result: createdTalent };
  } else {
    if (checkUser.talent.status === TalentStatusEnum.pending) {
      return { ok: false, error: "Talent masih dalam proses verifikasi" };
    }
    if (checkUser.talent.status === TalentStatusEnum.banned) {
      return { ok: false, error: "Talent telah diblokir" };
    }
    const trans = await db.$transaction(async (tx) => {
      if (checkUser?.talent?.id) {
        await tx.socialMedia.deleteMany({
          where: { talentId: checkUser?.talent?.id },
        });
        await tx.workExperience.deleteMany({
          where: { talentId: checkUser?.talent?.id },
        });
        await tx.education.deleteMany({
          where: { talentId: checkUser?.talent?.id },
        });
        await tx.award.deleteMany({
          where: { talentId: checkUser?.talent?.id },
        });
        const updatedTalent = await db.talent.update({
          where: { id: checkUser.talent.id },
          data: {
            industry: parsedData.data.industry,
            profession: parsedData.data.profession,
            bannerPicture: parsedData.data.bannerPicture,
            description: parsedData.data.description,
            skills: parsedData.data.skills,
            status:
              checkUser.talent.status === "rejected"
                ? TalentStatusEnum.pending
                : checkUser.talent.status,
            socialMedias:
              parsedData.data.socialMedias.length > 0
                ? {
                    createMany: {
                      data: parsedData.data.socialMedias.map((socialMedia) => ({
                        platform: socialMedia.platform,
                        url: socialMedia.url,
                      })),
                    },
                  }
                : undefined,
            workExperiences:
              parsedData.data.workExperiences.length > 0
                ? {
                    createMany: {
                      data: parsedData.data.workExperiences.map(
                        (workExperience) => ({
                          companyName: workExperience.companyName,
                          position: workExperience.position,
                          startDate: workExperience.startDate,
                          endDate: workExperience.endDate,
                          description: workExperience.description,
                        })
                      ),
                    },
                  }
                : undefined,
            educations:
              parsedData.data.educations.length > 0
                ? {
                    createMany: {
                      data: parsedData.data.educations.map((education) => ({
                        degree: education.degree,
                        schoolName: education.schoolName,
                        startDate: education.startDate,
                        endDate: education.endDate,
                        description: education.description,
                      })),
                    },
                  }
                : undefined,
            awards:
              parsedData.data.awards.length > 0
                ? {
                    createMany: {
                      data: parsedData.data.awards.map((award) => ({
                        name: award.name,
                        description: award.description,
                        date: award.date,
                        image: award.image || null,
                      })),
                    },
                  }
                : undefined,
          },
        });
        return updatedTalent;
      }
    });

    revalidateTag(`detail-talent:${checkUser.talent.id}`);
    revalidateTag(`detail-talent:${checkUser.talent.slug}`);
    const encodedSlug = encodeURIComponent(checkUser.talent.slug);
    revalidateTag(`detail-talent:${encodedSlug}`);
    revalidateTag(`talents`);
    revalidateTag(`all-users`);
    revalidateTag(`detail-user:${user.user.id}`);
    return { ok: true, result: trans };
  }
};

export const updateUserTalent = _updateUserTalent;

// CREATE ADMIN
const _createAdmin = async (formData: FormData) => {
  const user = await auth();
  if (!user || user.user.role !== "superadmin") {
    return { ok: false, error: "Unauthorized" };
  }
  const parsedData = UserCreateAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsedData.success) {
    return { ok: false, error: parsedData.error.message };
  }
  const checkUser = await db.user.findUnique({
    where: { email: parsedData.data.email },
  });
  if (checkUser) {
    return { ok: false, error: "Email sudah terdaftar" };
  }
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await db.user.create({
    data: {
      name: parsedData.data.name,
      email: parsedData.data.email,
      password: hashedPassword,
      role: "admin",
    },
  });
  revalidateTag(`all-users`);
  return { ok: true, result: createdUser };
};

export const createAdmin = _createAdmin;

// FOR AUTH PAGE
export const checkPermission = async (roles: Role[]) => {
  const user = await auth();
  if (!user) redirect("/");
  if (!roles.includes(user.user.role)) redirect("/dashboard/ringkasan");
};
