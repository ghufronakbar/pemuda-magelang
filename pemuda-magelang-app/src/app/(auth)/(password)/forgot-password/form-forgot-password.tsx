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
import { sendEmailForgotPassword } from "../action";
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
import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid")
    .nonempty("Email tidak boleh kosong"),
});
type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export const FormForgotPassword = () => {
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // --- UI phase & resend state ---
  const [phase, setPhase] = useState<"input" | "sent">("input");
  const [savedEmail, setSavedEmail] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  const startCooldown = (sec = 60) => setCooldown(sec);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    await sleep(300); // opsional: biar ada feedback loading singkat
    const result = await sendEmailForgotPassword(data.email);
    if (result?.error) {
      form.setError("email", { type: "manual", message: result.error });
      return;
    }
    // sukses kirim email
    setSavedEmail(data.email);
    setPhase("sent");
    startCooldown(60);
  };

  const handleResend = async () => {
    if (!savedEmail || cooldown > 0) return;
    setResendLoading(true);
    const result = await sendEmailForgotPassword(savedEmail);
    setResendLoading(false);
    if (result?.error) {
      // kalau gagal (misal rate limit server), balikin ke fase input agar user bisa ganti email
      form.setError("email", { type: "manual", message: result.error });
      setPhase("input");
      return;
    }
    startCooldown(60);
  };

  return (
    <Form {...form}>
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
                {phase === "input" ? "Lupa Password" : "Cek Email Kamu"}
              </CardTitle>
              <CardDescription>
                {phase === "input"
                  ? "Masukkan email kamu dan kami akan mengirimkan link untuk mengatur ulang password kamu ✨"
                  : "Link untuk reset password sudah kami kirim. Silakan cek inbox, spam, atau promotions."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {phase === "input" ? (
          <CardContent>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="kamu@contoh.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SubmitButton loading={form.formState.isSubmitting}>
                Kirim
              </SubmitButton>
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
        ) : (
          <CardContent>
            <div className="flex flex-col items-center text-center gap-4">
              <MailCheck className="h-10 w-10" aria-hidden />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Kami mengirim link reset ke{" "}
                  <span className="font-medium">{savedEmail}</span>.
                </p>
                <p className="text-xs text-muted-foreground">
                  Tidak menerima email? Cek folder Spam/Promotions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPhase("input");
                    form.reset({ email: savedEmail });
                  }}
                >
                  Ubah Email
                </Button>
                {cooldown > 0 ? (
                  <Button variant="secondary" disabled>
                    Kirim ulang dalam {formatTime(cooldown)}
                  </Button>
                ) : (
                  <Button onClick={handleResend} disabled={resendLoading}>
                    {resendLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Kirim Ulang
                  </Button>
                )}
              </div>

              <div className="my-2 w-full">
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
            </div>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-xs text-muted-foreground">
            Dengan mengirim, kamu setuju dengan{" "}
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
    </Form>
  );
};
