"use client";

import { ImageUploader } from "@/components/custom/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormHub } from "@/context/form-hub-context";
import { hubStatusEnum } from "@/enum/hub-status-enum";
import { HubCategory, HubStatusEnum } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";

interface FormHubProps {
  categories: HubCategory[];
}

export const FormHub = ({ categories }: FormHubProps) => {
  const { form, onSubmit, setOpen, open, onClose, loading } = useFormHub();
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
      }}
    >
      <Button
        onClick={() => {
          setOpen(true);
          form.reset({
            id: null,
            name: "",
            description: "",
            hubCategoryId: "",
            image: null,
            ctaLink: null,
            status: HubStatusEnum.active,
          });
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Program Zhub
      </Button>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {form.watch("id") ? "Edit" : "Tambah"} Program Zhub
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Program Manajemen Organisasi Seni"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Deskripsi program manajemen organisasi seni"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row w-full items-start gap-4">
              <FormField
                control={form.control}
                name="hubCategoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(v) => field.onChange(v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(HubStatusEnum).map((status) => (
                            <SelectItem key={status} value={status}>
                              {hubStatusEnum.getIcon(status)}
                              {hubStatusEnum.getLabel(status)}
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <ImageUploader
                      image={field.value ?? null}
                      setImage={field.onChange}
                      errorMessage={form.formState.errors.image?.message}
                      id="image-form-zhub"
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
                  <FormLabel>CTA Link (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://www.google.com"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Harap tunggu...</span>
                </div>
              ) : form.watch("id") ? (
                "Edit Program Zhub"
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Program Zhub
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
