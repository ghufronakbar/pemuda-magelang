"use client";

import { useFormAppData } from "@/context/form-app-data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { UrlInput } from "@/components/custom/url-input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

export const FormBranding = () => {
  const { form, onSubmit } = useFormAppData();
  return (
    <Form {...form.branding}>
      <form onSubmit={onSubmit.branding}>
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Bagian video & narasi brand di landing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.branding.control}
              name="brandingTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul branding…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.branding.control}
              name="brandingDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Deskripsi branding…"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.branding.control}
              name="brandingVideo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video (URL YouTube)</FormLabel>
                  <FormControl>
                    <UrlInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={form.branding.formState.isSubmitting}
              >
                {form.branding.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
