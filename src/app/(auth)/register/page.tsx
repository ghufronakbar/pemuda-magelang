// app/(auth)/register/page.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
// import { isRedirectError } from "next/dist/client/components/redirect"; // opsi 1
import { register } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LOGO } from "@/constants";
import {
  PasswordField,
  SubmitButton,
} from "@/app/(auth)/(components)/auth-components";
import { isRedirectError } from "next/dist/client/components/redirect-error";

interface RegisterPageProps {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}

const ERROR_MESSAGES = {
  EMAIL_TAKEN: "Email sudah terdaftar.",
  NAME_INVALID: "Nama minimal 2 karakter.",
  PASSWORD_INVALID: "Password minimal 6 karakter.",
  DATA_INVALID: "Data tidak valid.",
  EMAIL_INVALID: "Email tidak valid.",
  PASSWORD_MISMATCH: "Konfirmasi password tidak sesuai.",
  REGISTER_FAILED: "Pendaftaran gagal. Coba lagi.",
} as const;

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const sp = await searchParams;
  const redirectTo = sp?.callbackUrl ?? "/login";
  const errKey = sp?.error as keyof typeof ERROR_MESSAGES | undefined;

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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <Image
              src={LOGO}
              alt="Pemuda Magelang"
              width={32}
              height={32}
              className="h-8 w-8 rounded"
            />
            <div>
              <CardTitle className="text-xl">Daftar</CardTitle>
              <CardDescription>
                Bergabung dan mulai berkreasi ✨
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {errKey && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {ERROR_MESSAGES[errKey] ?? ERROR_MESSAGES.REGISTER_FAILED}
            </div>
          )}

          <form action={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nama lengkap</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="kamu@contoh.com"
                required
              />
            </div>

            <PasswordField identifier="password" />
            <PasswordField identifier="confirmPassword" />

            {/* kalau action-mu butuh ini: */}
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <SubmitButton>Daftar</SubmitButton>
          </form>

          <div className="my-6">
            <Separator />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-xs text-muted-foreground">
            Dengan mendaftar, kamu setuju dengan{" "}
            <Link href="/terms" className="underline">
              Ketentuan
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="underline">
              Kebijakan Privasi
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
