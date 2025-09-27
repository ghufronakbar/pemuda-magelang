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
});

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = RegisterSchema.safeParse(data);
  const safeParseEmail = EmailSchema.safeParse(data.email);
  if (!safeParseEmail.success) {
    return { ok: false, error: "EMAIL_INVALID" };
  }
  const safeParseName = NameSchema.safeParse(data.name);
  if (!safeParseName.success) {
    return { ok: false, error: "NAME_INVALID" };
  }
  const safeParsePassword = PasswordSchema.safeParse(data.password);
  if (!safeParsePassword.success) {
    return { ok: false, error: "PASSWORD_INVALID" };
  }
  if (data.password !== data.confirmPassword) {
    return { ok: false, error: "PASSWORD_MISMATCH" };
  }
  if (!parsed.success) {
    return { ok: false, error: "DATA_INVALID" };
  }

  const { name, email, password } = parsed.data;

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
    },
  });
  await signIn("credentials", { email, password, redirectTo: "/" });
  return { ok: true };
}
