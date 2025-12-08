"use client";

import { useFormAdmin } from "@/context/form-admin-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Loader2, UserPlus } from "lucide-react";

export function FormCreateAdmin() {
  const { form, loading, onSubmit, open, setOpen } = useFormAdmin();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
        size="sm"
      >
        <UserPlus className="h-4 w-4" />
        Buat Akun
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Buat Akun Admin Baru
            </DialogTitle>
            <DialogDescription>
              Buat akun admin baru dengan akses penuh ke sistem manajemen.
              Password default akan diberikan setelah akun dibuat.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Masukkan email"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Catatan:</strong> Password default untuk akun admin baru adalah{" "}
                  <code className="bg-background px-1 py-0.5 rounded text-xs font-mono">
                    admin123
                  </code>
                  . Admin dapat mengubah password setelah login pertama kali.
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Buat Akun Admin
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
