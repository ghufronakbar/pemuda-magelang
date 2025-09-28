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

export const FormPrivacy = () => {
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
          name="appData.pagePrivacy"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Tulis isi halaman privasi di sini…"
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
      </CardContent>
    </Card>
  );
};
