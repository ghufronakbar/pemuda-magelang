"use client";

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
import { Loader2 } from "lucide-react";
import { useFormCategoryHub } from "@/context/form-category-hub-context";

export const FormCategoryHub = () => {
  const { form, onSubmit, setOpen, open, onClose, loading } =
    useFormCategoryHub();
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
          });
        }}
      >
        Tambah Kategori Zhub
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {form.watch("id") ? "Edit" : "Tambah"} Kategori Zhub
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
                    <Input {...field} placeholder="Dukungan interaksi budaya" />
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
                "Edit Kategori Zhub"
              ) : (
                "Buat Kategori Zhub"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
