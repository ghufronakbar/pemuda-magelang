// src/app/(auth)/register/page.tsx

import { redirect } from "next/navigation";
import { register } from "@/actions/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { RegisterForm } from "./register-form";
import { verifyTurnstile } from "@/lib/turnstile";
import { getClientIpFromHeaders } from "@/lib/turnstile";
import { headers } from "next/headers";

interface RegisterPageProps {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const sp = await searchParams;
  const redirectTo = sp?.callbackUrl ?? "/login";

  const handleRegister = async (
    formData: FormData
  ): Promise<{
    ok: boolean;
    errors?: {
      email?: string;
      password?: string;
      turnstile?: string;
    };
  }> => {
    "use server";
    try {
      const turnstile = String(formData.get("turnstile") || "");

      const h = await headers();
      const ip = getClientIpFromHeaders(h);
      const verify = await verifyTurnstile(turnstile, ip);

      if (!verify.success) {
        return {
          ok: false,
          errors: { turnstile: "Verifikasi captcha gagal. Silakan coba lagi." },
        };
      }
      const result = await register(formData); // ini akan call signIn(...redirectTo: "/")
      if (result?.ok === false && result?.error === "EMAIL_TAKEN") {
        return { ok: false, errors: { email: "Email sudah terdaftar" } };
      }
      return {
        ok: true,
        errors: undefined,
      };
    } catch (error: unknown) {
      if (isRedirectError(error)) throw error; // opsi 1
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.digest === "NEXT_REDIRECT") throw error; // opsi 2
      const e = error as Error;
      const msg =
        typeof e?.message === "string" ? e.message : "REGISTER_FAILED";
      redirect(`/register?error=${encodeURIComponent(msg)}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <RegisterForm redirectTo={redirectTo} handleRegister={handleRegister} />
    </div>
  );
}
