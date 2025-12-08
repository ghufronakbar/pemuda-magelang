// src/actions/auth.ts
"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { signIn } from "@/auth";

const NameSchema = z.string().min(2);
const EmailSchema = z.string().email();
const PasswordSchema = z.string().min(6);
const RegisterSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: PasswordSchema,
  subdistrict: z.string().min(1),
  village: z.string().min(1),
  street: z.string().min(1),
});

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = RegisterSchema.safeParse(data);
  
  
  if (!parsed.success) {
    return { ok: false, error: "DATA_INVALID" };
  }

  const { name, email, password, subdistrict, village, street } = parsed.data;

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) {
    return { ok: false, error: "EMAIL_TAKEN" };
  }

  const hash = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      password: hash,
      role: Role.user,
      subdistrict,
      village,
      street,
    },
  });
  await signIn("credentials", { email, password, redirectTo: "/" });
  return { ok: true };
}
