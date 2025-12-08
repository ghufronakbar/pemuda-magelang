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
        Tambah Program
      </Button>
      <DialogContent className="h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col p-0 md:p-6">
        {/* Header - Fixed */}
        <DialogHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-0 md:py-0 md:border-b-0 md:bg-transparent">
          <DialogTitle className="text-lg font-semibold">
            {form.watch("id") ? "Edit" : "Tambah"} Program Zhub
          </DialogTitle>
        </DialogHeader>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 md:px-0 md:py-0">
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

              <div className="flex flex-col md:flex-row w-full items-start gap-4">
                <FormField
                  control={form.control}
                  name="hubCategoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
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
                    <FormItem className="flex-1 w-full">
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
            </form>
          </Form>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-0 md:py-0 md:border-t-0 md:bg-transparent">
          <Button 
            type="submit" 
            disabled={loading}
            onClick={form.handleSubmit(onSubmit)}
            className="w-full md:w-auto"
          >
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
