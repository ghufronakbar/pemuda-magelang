"use client";

import { useFormArticle } from "@/context/form-article-context";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/custom/image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/custom/tags-input";
import { EarthIcon, Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { uploadImage } from "@/actions/image";
import { createUpdateArticle } from "@/actions/article";
import { toast } from "sonner";
import { ArticleStatusEnum } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface FormArticleProps {
  type: "gerak" | "detak";
}

export function FormArticle({ type }: FormArticleProps) {
  const { form, loading } = useFormArticle();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const params = useParams();
  const id = (params.id as string) || null;
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setPending(true);
      if (pending) return;
      const formData = new FormData();
      if (id) {
        formData.append("id", id);
      }
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("tags", data.tags.join(","));
      formData.append("thumbnailImage", data.thumbnailImage);
      formData.append("content", data.content);
      formData.append("status", data.status);
      const res = await createUpdateArticle(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        switch (res?.result?.status) {
          case ArticleStatusEnum.draft:
            toast.success("Artikel berhasil disimpan sebagai draft");
            break;
          case ArticleStatusEnum.published:
            toast.success("Artikel berhasil dipublikasikan");
            break;
        }
        router.push(`/dashboard/${type}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Judul artikel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field?.value ?? []}
                      onChange={field.onChange}
                      placeholder="Ketik tag lalu Enter (contoh: komunitas, kreatif)…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel>Gambar Thumbnail</FormLabel>
            <ImageUploader
              image={form.watch("thumbnailImage")}
              setImage={(image) => {
                if (image) {
                  form.setValue("thumbnailImage", image);
                }
              }}
              errorMessage={form.formState.errors.thumbnailImage?.message}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Tulis, format, dan tambahkan media di sini…"
                  className="!max-w-none !w-full"
                  onUploadImage={async (file) => {
                    const fd = new FormData();
                    fd.append("image", file);
                    const res = await uploadImage(fd);
                    if (res.success && res.result) return res.result;
                    throw new Error("Upload gagal");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-2 mt-4">
          <Button
            type="submit"
            variant="outline"
            onClick={() => {
              form.setValue("status", "draft");
            }}
            disabled={pending}
            className={cn(pending ? "cursor-not-allowed" : "cursor-pointer")}
          >
            <Save />
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Simpan Draft"
            )}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              form.setValue("status", "published");
            }}
            disabled={pending}
            className={cn(pending ? "cursor-not-allowed" : "cursor-pointer")}
          >
            <EarthIcon />
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Publikasikan"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const CATEGORIES = [
  "Kesehatan",
  "Teknologi",
  "Ekonomi",
  "Politik",
  "Sosial",
  "Budaya",
  "Olahraga",
  "Edukasi",
];
