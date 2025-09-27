"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useFormUser } from "@/context/form-user-context";
import { updateUserPassword } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { UserPasswordInput } from "@/validator/user";

interface PasswordSectionProps {
  className?: string;
}

export function PasswordSection({ className }: PasswordSectionProps) {
  const { formPassword } = useFormUser();
  const [pending, setPending] = useState(false);

  const onSubmit = formPassword.handleSubmit(
    async (data: UserPasswordInput) => {
      try {
        setPending(true);
        const fd = new FormData();
        fd.append("currentPassword", data.currentPassword);
        fd.append("newPassword", data.newPassword);
        fd.append("confirmPassword", data.confirmPassword);
        const res = await updateUserPassword(fd);
        if (!res?.ok) {
          toast.error(res?.error ?? "Gagal mengubah password");
        } else {
          toast.success("Password berhasil diubah");
          formPassword.reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      } catch (e) {
        console.error(e);
        toast.error("Terjadi kesalahan saat mengubah password");
      } finally {
        setPending(false);
      }
    }
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Kata Sandi</CardTitle>
        <CardDescription>Ubah kata sandi akunmu.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formPassword}>
          <form onSubmit={onSubmit} className="grid gap-4 md:max-w-md">
            <FormField
              control={formPassword.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Saat Ini</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-px w-full bg-border my-2" />
            <FormField
              control={formPassword.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Minimal 6 karakter"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formPassword.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password Baru</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ulangi password baru"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button type="submit" disabled={pending} className="min-w-28">
                {pending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
