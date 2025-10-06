import { useFormAppData } from "@/context/form-app-data-context";
import { useFieldArray } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialMediaPlatformEnum } from "@prisma/client";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";
import { UrlInput } from "@/components/custom/url-input";

export const FormSocials = () => {
  const { form, loading } = useFormAppData();
  const socialArray = useFieldArray({
    control: form.control,
    name: "appSocialMedias",
  });
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
      <CardHeader>
        <CardTitle>Sosial Media</CardTitle>
        <CardDescription>
          Sosial media yang akan ditampilkan di footer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Sosial Media</h4>
          {socialArray.fields.length < 3 && (
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={() =>
                socialArray.append({ platform: "instagram", url: "" })
              }
            >
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline ml-2">Tambah Sosial Media</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {socialArray.fields.map((f, i) => (
            <div key={f.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              {/* label */}
              <FormField
                control={form.control}
                name={`appSocialMedias.${i}.platform`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Platform</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading || form.formState.isSubmitting}
                        onValueChange={(v) =>
                          field.onChange(v as SocialMediaPlatformEnum)
                        }
                        value={String(field.value ?? "")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(SocialMediaPlatformEnum).map((p) => (
                            <SelectItem key={p} value={p}>
                              {socialMediaPlatformEnum.getIcon(p)}
                              {socialMediaPlatformEnum.getLabel(p)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* value */}
              <FormField
                control={form.control}
                name={`appSocialMedias.${i}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Nilai</FormLabel>
                    <FormControl>
                      <UrlInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="https://…"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertConfirmation
                title="Hapus Media Sosial"
                description="Apakah Anda yakin ingin menghapus media sosial ini? Tindakan ini tidak dapat dibatalkan."
                onConfirm={() => socialArray.remove(i)}
              >
                <Button
                  type="button"
                  variant="destructive"
                  className="sm:justify-self-end"
                >
                  Hapus
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertConfirmation>
            </div>
          ))}

          {socialArray.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada sosial media yang ditampilkan. Tambahkan agar pengunjung
              mudah menghubungimu.
            </p>
          )}
        </div>
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
