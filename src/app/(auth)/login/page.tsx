import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
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
import Image from "next/image";

interface LoginPageProps {
  searchParams?: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  const redirectTo = sp?.callbackUrl ?? "/";

  return (
    <div className="flex min-h-screen justify-center w-full items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            {/* Optional branding */}

            <Image
              src={LOGO}
              alt="Pemuda Magelang"
              className="h-8 w-8 rounded"
              width={32}
              height={32}
            />

            <div>
              <CardTitle className="text-xl">Masuk</CardTitle>
              <CardDescription>
                Akses akunmu dan mulai berkreasi ✨
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Pesan error dari query (?error=CredentialsSignin) */}
          {sp?.error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Email atau password tidak valid.
            </div>
          )}

          <form
            action={async (formData) => {
              "use server";
              try {
                const email = String(formData.get("email") || "");
                const password = String(formData.get("password") || "");
                // Kirim kredensial sebagai object + arahkan ke redirectTo
                await signIn("credentials", {
                  email,
                  password,
                  redirectTo: redirectTo,
                });
              } catch (err) {
                // Tampilkan error ramah pengguna
                if (err instanceof AuthError) {
                  // Bawa user kembali ke /login?error=...
                  redirect(`/login?error=${encodeURIComponent(err.type)}`);
                }
                throw err;
              }
            }}
            className="space-y-5"
          >
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

            <PasswordField />

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <SubmitButton>Masuk</SubmitButton>
          </form>

          <div className="my-6">
            <Separator />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Daftar
            </Link>
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-xs text-muted-foreground">
            Dengan masuk, kamu setuju dengan{" "}
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
