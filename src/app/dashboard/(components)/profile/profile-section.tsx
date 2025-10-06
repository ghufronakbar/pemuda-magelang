"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormUser } from "@/context/form-user-context";
import { updateUser } from "@/actions/user";
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
import { Loader2, Upload, Save } from "lucide-react";
import type { UserProfileInput } from "@/validator/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helper";
import { uploadImage } from "@/actions/image";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KOTA_MAGELANG_ADDRESS_DATA } from "@/data/address";
import { Textarea } from "@/components/ui/textarea";

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
      fd.append("subdistrict", data.subdistrict);
      fd.append("village", data.village);
      fd.append("street", data.street);
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

  const villages = useMemo(() => {
    return (
      KOTA_MAGELANG_ADDRESS_DATA.find(
        (item) => item.subdistrict === formProfile.watch("subdistrict")
      )?.villages ?? []
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formProfile.watch("subdistrict")]);

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
              <div className="w-24 h-24 relative overflow-hidden group">
                {uploading && (
                  <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 rounded-full w-full h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
                <Avatar
                  className="w-full h-full cursor-pointer"
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
                
                {/* Hover overlay with upload text */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-1 text-white">
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-medium">Unggah Foto</span>
                  </div>
                </div>
              </div>
            </div>

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
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={formProfile.control}
                name="subdistrict"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                          {KOTA_MAGELANG_ADDRESS_DATA.map((item) => (
                            <SelectItem
                              key={item.subdistrict}
                              value={item.subdistrict}
                            >
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
                control={formProfile.control}
                name="village"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Kelurahan</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kelurahan" />
                        </SelectTrigger>
                        <SelectContent>
                          {villages.map((item) => (
                            <SelectItem key={item} value={item}>
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
              control={formProfile.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alamat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={pending}
              className="min-w-28 w-fit mt-auto"
            >
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
