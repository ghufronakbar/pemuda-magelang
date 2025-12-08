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

import { Save, EarthIcon, Loader2, Plus, Trash2, Package, Tag, DollarSign, Image as ImageIcon, FileText } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { PRODUCT_CATEGORIES } from "@/data/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { uploadImage } from "@/actions/image";

export function FormProduct() {
  const { form, loading } = useFormProduct();
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const addInputRef = React.useRef<HTMLInputElement | null>(null);
  const [addingImage, setAddingImage] = useState(false);

  const formatRupiah = (value?: number | null) => {
    if (value === null || value === undefined) return "";
    try {
      return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
    } catch {
      return "";
    }
  };
  const parseRupiahToNumber = (input: string): number | null => {
    const digitsOnly = (input || "").replace(/\D/g, "");
    if (!digitsOnly) return null;
    const n = Number(digitsOnly);
    return Number.isNaN(n) ? null : n;
  };

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

  const onAddImagePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      if (addingImage) return;
      setAddingImage(true);
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadImage(fd);
      if (res?.success && res.result) {
        imagesArray.append(res.result as unknown as never);
      } else {
        toast.error("Gagal mengunggah gambar");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat mengunggah gambar");
    } finally {
      setAddingImage(false);
      if (addInputRef.current) {
        addInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Informasi Dasar Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Informasi Dasar</CardTitle>
            </div>
            <CardDescription>
              Masukkan detail utama produk Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Foto Produk */}
            <div className="space-y-3">
              {/* Grid kecil, drag & drop, auto-slot */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {imagesArray.fields.map((f, idx) => (
                  <div key={f.id} className="relative group">
                    <ImageUploader
                      image={form.watch(`images.${idx}`)}
                      id={`product-image-${idx}`}
                      containerClassName="aspect-square h-24"
                      setImage={(url) => {
                        form.setValue(`images.${idx}`, url ?? "", { shouldValidate: true });
                      }}
                      errorMessage={form.formState.errors?.images?.[idx]?.message}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => imagesArray.remove(idx)}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {/* Always-present empty slot to add next image */}
                {imagesArray.fields.length < 10 && (
                  <button
                    type="button"
                    onClick={() => !addingImage && addInputRef.current?.click()}
                    disabled={addingImage}
                    className={cn(
                      "relative aspect-square h-24 rounded-lg border-2 border-dashed border-muted-foreground/30 transition-all duration-200 flex flex-col items-center justify-center gap-1",
                      addingImage
                        ? "bg-muted/40 cursor-not-allowed text-muted-foreground"
                        : "hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                    )}
                  >
                    {addingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-2xs">Mengunggah…</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span className="text-2xs">Tambah</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              {/* Hidden input to pick new image */}
              <input
                ref={addInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAddImagePicked}
              />

              {imagesArray.fields.length === 0 && (
                <p className="text-xs text-muted-foreground">Tambahkan minimal satu gambar produk.</p>
              )}

              {typeof form.formState.errors.images === "string" ? (
                <p className="text-sm text-destructive">{form.formState.errors.images}</p>
              ) : null}
            </div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Nama Produk
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh: Kaos Komunitas Edisi 2025"
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi Produk */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Deskripsi Produk
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={8}
                      placeholder="Tuliskan deskripsi produk secara ringkas & informatif…"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kategori */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Kategori
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full h-11">
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
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Harga (Opsional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Rp 150.000"
                        value={formatRupiah(field.value as number | null)}
                        className="h-11"
                        onChange={(e) => {
                          const next = parseRupiahToNumber(e.target.value);
                          field.onChange(next);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Beri 0 jika tidak ingin menampilkan harga
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </FormLabel>
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
          </CardContent>
        </Card>

        {/* (Cards untuk Gambar & Deskripsi dihapus karena sudah dipindah ke Informasi Dasar) */}

        {/* Action Buttons Card */}
        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                variant="outline"
                onClick={() => form.setValue("status", ProductStatusEnum.draft)}
                disabled={pending}
                className={cn(
                  "flex-1 h-11",
                  pending ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {pending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Draft
              </Button>

              <Button
                type="submit"
                onClick={() => form.setValue("status", ProductStatusEnum.published)}
                disabled={pending}
                className={cn(
                  "flex-1 h-11",
                  pending ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {pending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <EarthIcon className="mr-2 h-4 w-4" />
                )}
                Publikasikan
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
