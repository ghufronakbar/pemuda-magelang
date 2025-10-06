import { useFormAppData } from "@/context/form-app-data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { uploadImage } from "@/actions/image";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

export const FormTerms = () => {
  const { form, loading } = useFormAppData();

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
    <Card>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="appData.pageTerms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Tulis isi halaman ketentuan di sini…"
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
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
