"use client";

import * as React from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/custom/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormCommunity } from "@/context/form-community-context";
import { COMMUNITY_CATEGORIES } from "@/data/community";
import { UrlInput } from "@/components/custom/url-input";
import Image from "next/image";
import { UploadIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadImage } from "@/actions/image";
import { toast } from "sonner";

export function FormCommunity({
  pending,
  onSubmit,
  disabled,
}: {
  pending: boolean;
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
  disabled?: boolean;
}) {
  const { form, communityStatus } = useFormCommunity();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* ===== Basic ===== */}
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 items-center">
              <FormLabel>Gambar Profil</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2 items-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={field.value ?? ""} />
                      <AvatarFallback>
                        {field.value?.[0] ? field.value?.[0] : "C"}
                      </AvatarFallback>
                    </Avatar>

                    {(communityStatus === "approved" || !communityStatus) && (
                      <input
                        id="profilePictureCommunityInput"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0"
                        onChange={async (e) => {
                          try {
                            const file = e.target.files?.[0];
                            if (file) {
                              const formData = new FormData();
                              formData.append("image", file);
                              const res = await uploadImage(formData);
                              if (res.success && res.result) {
                                field.onChange(res.result);
                              }
                            }
                          } catch (error) {
                            toast.error("Gagal mengunggah gambar");
                            console.error(error);
                          }
                        }}
                      />
                    )}
                  </div>
                  {(communityStatus === "approved" || !communityStatus) && (
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("profilePictureCommunityInput")
                          ?.click()
                      }
                    >
                      <UploadIcon className="w-4 h-4" /> Unggah Gambar
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2 items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Komunitas</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Komunitas Fotografi"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormControl>
                  <Select
                    disabled={disabled}
                    onValueChange={(v) => field.onChange(v)}
                    value={String(field.value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNITY_CATEGORIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
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

        {/* ===== Banner ===== */}
        <div>
          <FormLabel className="mb-2 block">Banner</FormLabel>
          <FormField
            control={form.control}
            name="bannerPicture"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    image={field.value ?? null}
                    id="bannerPictureCommunity"
                    setImage={(url) => field.onChange(url ?? "")}
                    errorMessage={form.formState.errors.bannerPicture?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* ===== Description ===== */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={4}
                  placeholder="Ceritakan tentang komunitasmu…"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ctaText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teks CTA (Call to Action)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Bergabung sekarang juga!"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ctaLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link CTA (Call to Action)</FormLabel>
              <FormControl>
                <UrlInput
                  {...field}
                  disabled={disabled}
                  onChange={field.onChange}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== Submit (opsional, kalau parent kirim onSubmit) ===== */}
        {onSubmit && (
          <div>
            <Button type="submit" disabled={pending} className="min-w-28">
              {pending ? "Memproses…" : "Kirim"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
