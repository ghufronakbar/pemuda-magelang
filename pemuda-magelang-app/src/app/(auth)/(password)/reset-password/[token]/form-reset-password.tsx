"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CdnImage } from "@/components/custom/cdn-image";
import { LOGO } from "@/constants";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/(auth)/(components)/auth-components";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { resetPasswordAction } from "../../action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Minimal 8 karakter")
      .max(72, "Terlalu panjang")
      .regex(/[a-z]/, "Harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Harus mengandung huruf besar")
      .regex(/[0-9]/, "Harus mengandung angka")
      .regex(/[^A-Za-z0-9]/, "Harus mengandung simbol"),
    confirmPassword: z.string().min(1, "Wajib diisi"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

interface FormResetPasswordProps {
  token: string;
  email: string | null;
  name: string | null;
  error: string | null; // dari validateResetPasswordToken
}

export const FormResetPassword = ({
  token,
  email,
  name,
  error,
}: FormResetPasswordProps) => {
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const maskedEmail = useMemo(() => {
    if (!email) return null;
    // Mask sederhana: a******@domain.com
    const [user, domain] = email.split("@");
    if (!domain) return email;
    const head = user.slice(0, 1);
    return `${head}${"*".repeat(Math.max(user.length - 1, 3))}@${domain}`;
  }, [email]);

  const router = useRouter();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    await sleep(300);
    const result = await resetPasswordAction(token, data.newPassword);
    if (result.error) {
      form.setError("newPassword", { type: "manual", message: result.error });
      return;
    }
    if (result.ok) {
      await sleep(1000);
      toast.success("Password berhasil diubah");
      router.push("/login");
    }
  };

  const goForgotHref = email
    ? `/forgot-password?email=${encodeURIComponent(email)}`
    : "/forgot-password";

  const hasError = Boolean(error);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <CdnImage
            uniqueKey={LOGO}
            alt="Pemuda Magelang"
            className="h-8 w-8 rounded"
            width={32}
            height={32}
          />
          <div>
            <CardTitle className="text-xl">
              {hasError ? "Link Tidak Valid" : "Atur Password Baru"}
            </CardTitle>
            <CardDescription>
              {hasError
                ? error
                : "Masukkan password baru untuk akunmu. Pastikan kuat dan unik."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {hasError ? (
        <CardContent>
          <div className="flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-10 w-10 text-destructive" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Tautan reset tidak dapat digunakan.{" "}
              {email ? (
                <>
                  Silakan minta tautan baru untuk{" "}
                  <span className="font-medium">{maskedEmail}</span>.
                </>
              ) : (
                <>Silakan minta tautan reset yang baru.</>
              )}
            </p>
            <div className="flex gap-2">
              <Link href={goForgotHref}>
                <Button>Ke Halaman Lupa Password</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="space-y-2 mb-4">
            {name || email ? (
              <p className="text-sm text-muted-foreground">
                Untuk akun:{" "}
                <span className="font-medium">
                  {name ? `${name}${email ? " · " : ""}` : ""}
                  {maskedEmail ?? ""}
                </span>
              </p>
            ) : null}
          </div>

          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email ?? ""} />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Baru</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimal 8 karakter & mengandung huruf besar, huruf kecil,
                      angka, dan simbol.
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton loading={form.formState.isSubmitting}>
                Simpan Password
              </SubmitButton>
            </form>
          </Form>

          <div className="my-6">
            <Separator />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Ingat password?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </CardContent>
      )}

      <CardFooter className="flex flex-col gap-2">
        <p className="text-center text-xs text-muted-foreground">
          Dengan menyimpan, kamu setuju dengan{" "}
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
  );
};
