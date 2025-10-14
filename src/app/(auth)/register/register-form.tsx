// src/app/(auth)/register/register-form.tsx
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LOGO } from "@/constants";
import {
  PasswordField,
  SubmitButton,
} from "@/app/(auth)/(components)/auth-components";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KOTA_MAGELANG_ADDRESS_DATA } from "@/data/address";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CdnImage } from "@/components/custom/cdn-image";
import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "@/constants/cloudflare";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(40, "Nama terlalu panjang"),
    email: z
      .string()
      .email("Email tidak valid")
      .min(1, "Email tidak boleh kosong"),
    password: z
      .string()
      .min(8, "Minimal 8 karakter")
      .max(72, "Terlalu panjang")
      .regex(/[a-z]/, "Harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Harus mengandung huruf besar")
      .regex(/[0-9]/, "Harus mengandung angka")
      .regex(/[^A-Za-z0-9]/, "Harus mengandung simbol"),
    confirmPassword: z.string().min(1, "Wajib diisi"),
    subdistrict: z.string().min(1, "Kecamatan tidak boleh kosong"),
    village: z.string().min(1, "Kelurahan tidak boleh kosong"),
    street: z.string().min(1, "Alamat tidak boleh kosong"),
    turnstile: z.string().min(1, "Captcha tidak boleh kosong"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sesuai",
  });

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  handleRegister: (formData: FormData) => Promise<{
    ok: boolean;
    errors?: {
      email?: string;
      password?: string;
      turnstile?: string;
    };
  }>;
  redirectTo: string;
}

export const RegisterForm = ({
  handleRegister,
  redirectTo,
}: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const resetCaptcha = () => {
    form.setValue("turnstile", "");
    setCaptchaKey((k) => k + 1);
  };
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      subdistrict: "",
      village: "",
      street: "",
      turnstile: "",
    },
  });

  const villages = useMemo(() => {
    return (
      KOTA_MAGELANG_ADDRESS_DATA.find(
        (item) => item.subdistrict === form.getValues("subdistrict")
      )?.villages ?? []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("subdistrict")]);

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      setLoading(true);
      if (loading) return;
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("password", data.password);
      fd.append("confirmPassword", data.confirmPassword);
      fd.append("subdistrict", data.subdistrict);
      fd.append("village", data.village);
      fd.append("street", data.street);
      fd.append("turnstile", data.turnstile);
      const res = await handleRegister(fd);
      if (res.errors) {
        for (const [key, value] of Object.entries(res.errors)) {
          form.setError(
            key as
              | "name"
              | "email"
              | "password"
              | "confirmPassword"
              | "subdistrict"
              | "village"
              | "street"
              | "turnstile",
            {
              type: "manual",
              message: value,
            }
          );
        }
        resetCaptcha();
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <CdnImage
                uniqueKey={LOGO}
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

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama lengkap</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nama lengkap" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordField
                      identifier="confirmPassword"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Konfirmasi Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-2 w-full items-start">
              <FormField
                control={form.control}
                name="subdistrict"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("village", "");
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                          {KOTA_MAGELANG_ADDRESS_DATA.map((item, index) => (
                            <SelectItem key={index} value={item.subdistrict}>
                              {item.subdistrict}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Kelurahan</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("subdistrict")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Kelurahan" />
                        </SelectTrigger>
                        <SelectContent>
                          {villages.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Alamat" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* kalau action-mu butuh ini: */}
            <input type="hidden" name="redirectTo" value={redirectTo} />
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
            <SubmitButton loading={loading}>Daftar</SubmitButton>

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
      </form>
    </Form>
  );
};
