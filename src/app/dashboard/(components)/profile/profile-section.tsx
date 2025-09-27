"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormUser } from "@/context/form-user-context";
import { updateUser } from "@/actions/user";
import { ImageUploader } from "@/components/custom/image-uploader";
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
import { Loader2, Trash } from "lucide-react";
import type { UserProfileInput } from "@/validator/user";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helper";
import { uploadImage } from "@/actions/image";
import { useSession } from "next-auth/react";

interface ProfileSectionProps {
  className?: string;
}

export function ProfileSection({ className }: ProfileSectionProps) {
  const { formProfile } = useFormUser();
  const { update } = useSession();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const onSubmit = formProfile.handleSubmit(async (data: UserProfileInput) => {
    try {
      setPending(true);
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      if (data.profilePicture) fd.append("profilePicture", data.profilePicture);
      const res = await updateUser(fd);
      if (!res?.ok) {
        toast.error(res?.error ?? "Gagal memperbarui profil");
      } else {
        await update({
          name: data.name,
          image: data.profilePicture,
        });
        toast.success("Profil berhasil diperbarui");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setPending(false);
    }
  });

  const [uploading, setUploading] = useState(false);
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 1024 * 1024 * 5) {
          toast.error("Gambar tidak boleh lebih dari 5MB");
          return;
        }
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          toast.error("Gambar harus berupa JPEG atau PNG");
          return;
        }
        setUploading(true);
        if (uploading) return;
        const formData = new FormData();
        formData.append("image", file);
        const url = await uploadImage(formData);
        if (url.success && url.result) {
          formProfile.setValue("profilePicture", url.result);
        } else {
          throw new Error("Error Upload");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Perbarui nama dan foto profilmu.</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <Form {...formProfile}>
          <form onSubmit={onSubmit} className="flex flex-col gap-4 h-full">
            <input
              type="file"
              className="hidden"
              id="profilePicture"
              onChange={onFileChange}
              accept="image/*"
            />
            <div className="flex flex-col gap-2 self-center items-center">
              <div className="w-24 h-24 relative overflow-hidden">
                {uploading && (
                  <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 rounded-full w-full h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
                <Avatar
                  className="w-full h-full"
                  onClick={() => {
                    if (uploading) return;
                    document.getElementById("profilePicture")?.click();
                  }}
                >
                  <AvatarImage
                    src={formProfile.watch("profilePicture") || ""}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {getInitials(formProfile.watch("name"))}
                  </AvatarFallback>
                </Avatar>
              </div>
              {formProfile.watch("profilePicture") && (
                <Button
                  size="sm"
                  className="text-xs cursor-pointer"
                  variant="destructive"
                  onClick={() => {
                    formProfile.setValue("profilePicture", null);
                  }}
                >
                  <Trash className="w-4 h-4" />
                  Hapus Foto
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <FormField
                control={formProfile.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={formProfile.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="min-w-28 w-fit mt-auto"
            >
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Simpan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
