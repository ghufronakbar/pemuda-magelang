// src/app/(auth)/login/page.tsx
import { signIn } from "@/auth";
import { getAppData } from "@/actions/app-data";
import { LoginForm } from "./login-form";
import { AuthError } from "next-auth";
import { getClientIpFromHeaders, verifyTurnstile } from "@/lib/turnstile";
import { headers } from "next/headers";

interface LoginPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  const appData = await getAppData();
  const redirectTo = sp?.redirect ?? "/";

  const handleLogin = async (
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
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
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
      // Kirim kredensial sebagai object + arahkan ke redirectTo
      const res = await signIn("credentials", {
        email,
        password,
        redirectTo: redirectTo,
      });
      console.log({ res });
      return { ok: true };
    } catch (err) {
      if (err instanceof AuthError) {
        return {
          ok: false,
          errors: { password: "Email atau password tidak valid" },
        };
      }
      console.error("Terjadi kesalahan login server side page", err);
      throw err;
    }
  };

  return (
    <div className="flex min-h-screen justify-center w-full items-center px-4 py-10">
      <LoginForm
        appData={appData}
        redirectTo={redirectTo}
        onLogin={handleLogin}
      />
    </div>
  );
}
