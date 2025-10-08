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
import {
  AirplayIcon,
  EarthIcon,
  Loader2,
  Plus,
  Save,
  SendIcon,
} from "lucide-react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { uploadImage } from "@/actions/image";
import { createUpdateArticle } from "@/actions/article";
import { toast } from "sonner";
import { ArticleStatusEnum, Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ARTICLE_CATEGORIES } from "@/data/article";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useFormCommunity } from "@/context/form-community-context";
import { cdnUrl } from "@/components/custom/cdn-image";

interface FormArticleProps {
  type: "gerak" | "detak" | "dampak";
}

export function FormArticlePublic({ type }: FormArticleProps) {
  const { form, loading } = useFormArticle();
  const { communityStatus, form: formCommunity } = useFormCommunity();
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const communityId = formCommunity.watch("id");

  const isValid = useMemo(() => {
    if (!session?.user) return false;
    if (
      (session?.user?.role === Role.admin ||
        session?.user?.role === Role.superadmin) &&
      type === "detak"
    )
      return true;
    if (session?.user?.role === Role.user && type === "gerak") return true;
    if (
      session?.user?.role === Role.user &&
      type === "dampak" &&
      communityStatus === "approved" &&
      communityId
    )
      return true;
    return false;
  }, [session?.user, type, communityStatus, communityId]);

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
      formData.append("type", type);

      if (communityId) {
        formData.append("communityId", communityId);
      }

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
        router.refresh();
      }
      setIsOpen(false);
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

  if (!isValid) return null;

  return (
    <>
      <div className="w-full flex flex-row gap-2 items-start justify-between relative">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={cdnUrl(session?.user?.image || "")}
            className="w-full h-full object-cover"
          />
          <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <Textarea
          onClick={() => setIsOpen(true)}
          placeholder="Tuangkan opini di sini..."
          className="w-full h-auto md:h-24 !flex !items-start !justify-start !resize-none"
          rows={3}
        />
        <div className="md:absolute md:right-2 md:bottom-2 flex flex-row gap-2">
          <Button onClick={() => setIsOpen(true)} className="w-10 h-10">
            <SendIcon />
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] !max-w-none">
          <DialogHeader>
            <DialogTitle>Tambah Artikel</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="overflow-y-auto">
              <div className="max-h-[60vh] overflow-y-auto">
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
                                {ARTICLE_CATEGORIES.map((category) => (
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
                      errorMessage={
                        form.formState.errors.thumbnailImage?.message
                      }
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
              </div>
              <DialogFooter className="!mt-0">
                <div className="flex flex-row gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="outline"
                    onClick={() => {
                      form.setValue("status", "draft");
                    }}
                    disabled={pending}
                    className={cn(
                      pending ? "cursor-not-allowed" : "cursor-pointer"
                    )}
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
                    className={cn(
                      pending ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <EarthIcon />
                    {pending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Publikasikan"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
