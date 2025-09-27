"use client";

import * as React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductStatusEnum } from "@prisma/client";
import { useFormProduct } from "@/context/form-product-context";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/custom/image-uploader";
import { TagsInput } from "@/components/custom/tags-input";
import { cn } from "@/lib/utils";
import { createUpdateProduct } from "@/actions/product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Save, EarthIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

export function FormProduct() {
  const { form, loading } = useFormProduct();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const params = useParams();
  const id = (params.id as string) || null;

  // ====== Multi images handler (String[]) ======
  const imagesArray = useFieldArray({
    control: form.control,
    name: "images" as never, // pastikan context defaultValues.images: string[]
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setPending(true);
      if (pending) return;

      // Di sini aku kirim lewat FormData seperti di Artikel:
      const fd = new FormData();
      if (id) fd.append("id", id);

      fd.append("title", data.title);
      fd.append("category", data.category);
      fd.append("tags", (data.tags ?? []).join(",")); // server action: split(",")
      fd.append("description", data.description ?? "");
      if (data.price && !isNaN(Number(data.price))) {
        fd.append("price", String(data.price));
      } else {
        // opsional: kirim kosong sebagai null
        fd.append("price", "");
      }

      // Kirim images sebagai JSON agar aman
      fd.append("images", (data.images ?? []).join(","));

      // Status diatur oleh tombol yang ditekan
      fd.append("status", data.status);

      const res = await createUpdateProduct(fd);
      if (res?.error) {
        toast.error(res.error);
      } else {
        switch (res?.result?.status as ProductStatusEnum) {
          case ProductStatusEnum.draft:
            toast.success("Produk berhasil disimpan sebagai draft");
            break;
          case ProductStatusEnum.published:
            toast.success("Produk berhasil dipublikasikan");
            break;
        }
        router.push("/dashboard/produk");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setPending(false);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Kiri: Detail */}
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh: Kaos Komunitas Edisi 2025"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Harga (opsional) */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (opsional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="1000"
                      min="0"
                      placeholder="Contoh: 150000"
                      value={field.value ?? ""}
                      onKeyDown={(e) => {
                        if (e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Beri 0 jika tidak ingin menampilkan harga.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field?.value ?? []}
                      onChange={field.onChange}
                      placeholder="Ketik tag lalu Enter (contoh: merchandise, komunitas)…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Kanan: Gambar (multi) */}
          <div className="flex flex-col gap-3">
            <FormLabel>Gambar Produk</FormLabel>

            <div className="space-y-3">
              {imagesArray.fields.map((f, idx) => (
                <div key={f.id} className="rounded-md border p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium">Gambar {idx + 1}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imagesArray.remove(idx)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </Button>
                  </div>

                  <ImageUploader
                    image={form.watch(`images.${idx}`)}
                    id={`product-image-${idx}`}
                    setImage={(url) => {
                      form.setValue(`images.${idx}`, url ?? "", {
                        shouldValidate: true,
                      });
                    }}
                    errorMessage={form.formState.errors?.images?.[idx]?.message}
                  />
                </div>
              ))}

              {imagesArray.fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada gambar. Tambahkan minimal satu gambar agar produk
                  terlihat menarik.
                </p>
              )}

              <div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => imagesArray.append("")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Gambar
                </Button>
              </div>

              {typeof form.formState.errors.images === "string" ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.images}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tuliskan deskripsi produk secara ringkas & informatif…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tombol Aksi */}
        <div className="mt-4 flex flex-row gap-2">
          <Button
            type="submit"
            variant="outline"
            onClick={() => form.setValue("status", ProductStatusEnum.draft)}
            disabled={pending}
            className={cn(pending ? "cursor-not-allowed" : "cursor-pointer")}
          >
            <Save className="mr-2 h-4 w-4" />
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Simpan Draft"
            )}
          </Button>

          <Button
            type="submit"
            onClick={() => form.setValue("status", ProductStatusEnum.published)}
            disabled={pending}
            className={cn(pending ? "cursor-not-allowed" : "cursor-pointer")}
          >
            <EarthIcon className="mr-2 h-4 w-4" />
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Publikasikan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* ================== Konstanta ================== */
const PRODUCT_CATEGORIES = [
  "Merchandise",
  "Kerajinan",
  "Desain",
  "Fotografi",
  "Musik",
  "Kuliner",
  "Event",
  "Layanan",
];
