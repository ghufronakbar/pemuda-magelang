import { redirect } from "next/navigation";
// import { isRedirectError } from "next/dist/client/components/redirect"; // opsi 1
import { register } from "@/actions/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { RegisterForm } from "./register-form";

interface RegisterPageProps {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const sp = await searchParams;
  const redirectTo = sp?.callbackUrl ?? "/login";

  const handleRegister = async (formData: FormData) => {
    "use server";
    try {
      const result = await register(formData); // ini akan call signIn(...redirectTo: "/")
      if (result?.ok === false && result?.error) {
        throw new Error(result.error);
      }
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
      <RegisterForm
        redirectTo={redirectTo}
        handleRegister={handleRegister}
        defaultError={
          sp?.error === "EMAIL_TAKEN"
            ? "Email sudah terdaftar"
            : sp?.error === "PASSWORD_MISMATCH"
            ? "Password tidak sesuai"
            : sp?.error === "PASSWORD_INVALID"
            ? "Password tidak valid"
            : sp?.error === "NAME_INVALID"
            ? "Nama tidak valid"
            : sp?.error === "EMAIL_INVALID"
            ? "Email tidak valid"
            : sp?.error === "SUBDISTRICT_INVALID"
            ? "Kecamatan tidak valid"
            : sp?.error === "VILLAGE_INVALID"
            ? "Kelurahan tidak valid"
            : sp?.error === "STREET_INVALID"
            ? "Alamat tidak valid"
            : !!sp?.error
            ? "Terjadi kesalahan saat registrasi"
            : undefined
        }
      />
    </div>
  );
}
