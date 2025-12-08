import { useFormAppData } from "@/context/form-app-data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/custom/image-uploader";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Form } from "@/components/ui/form";

export const FormBase = () => {
  const { form, loading, onSubmit } = useFormAppData();

  if (loading) {
    return (
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Memuat Data</CardTitle>
          <CardDescription>Harap tunggu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-10 w-full rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Form {...form.base}>
      <form onSubmit={onSubmit.base}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Logo / Ikon Aplikasi & Deskripsi Footer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <FormField
                  control={form.base.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deskripsi Footer</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Deskripsi footer…"
                          className="resize-none min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.base.control}
                  name="baseLogo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo / Ikon Aplikasi</FormLabel>
                      <FormControl>
                        <ImageUploader
                          image={field.value}
                          setImage={field.onChange}
                          id="baseLogo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button type="submit" disabled={form.base.formState.isSubmitting}>
                {form.base.formState.isSubmitting ? (
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
