// src/app/(auth)/login/form-login.tsx
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PasswordField } from "@/app/(auth)/(components)/auth-components";
import { SubmitButton } from "@/app/(auth)/(components)/auth-components";
import { AppData } from "@prisma/client";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "@/constants/cloudflare";
import { useState } from "react";

interface LoginFormProps {
  appData: AppData;
  redirectTo?: string;
  onLogin: (formData: FormData) => Promise<{
    ok: boolean;
    errors?: {
      email?: string;
      password?: string;
      turnstile?: string;
    };
  }>;
}
export const LoginForm = ({ appData, onLogin }: LoginFormProps) => {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      turnstile: "",
    },
  });

  const [captchaKey, setCaptchaKey] = useState(0);
  const resetCaptcha = () => {
    form.setValue("turnstile", "");
    setCaptchaKey((k) => k + 1);
  };

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("turnstile", data.turnstile);
      const res = await onLogin(formData);
      if (res.errors) {
        for (const [key, value] of Object.entries(res.errors)) {
          form.setError(key as "email" | "password" | "turnstile", {
            type: "manual",
            message: value,
          });
        }
        resetCaptcha();
        return;
      }
    } catch (error) {
      console.error("Terjadi kesalahan login", error);
      form.setError("password", {
        type: "manual",
        message: "Terjadi kesalahan",
      });
    }
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            {/* Optional branding */}

            <CdnImage
              uniqueKey={appData.baseLogo}
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordField
                      identifier="password"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="turnstile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Turnstile
                      className="mx-auto"
                      key={captchaKey}
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={(token) => field.onChange(token)}
                      onExpire={() => resetCaptcha()}
                      onError={() => resetCaptcha()}
                      options={{
                        action: "auth",
                        theme: "light",
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link
              className="text-xs from-accent-foreground mb-2 self-end"
              href="/forgot-password"
            >
              Lupa Password?
            </Link>

            <SubmitButton loading={form.formState.isSubmitting}>
              Masuk
            </SubmitButton>
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
    </Form>
  );
};

const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string(),
  turnstile: z.string().min(1, "Harap verifikasi captcha"),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;
