import { useFormAppData } from "@/context/form-app-data-context";
import { useFieldArray } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/custom/image-uploader";

export const FormHero = () => {
  const { form, loading } = useFormAppData();
  const heroArray = useFieldArray({ control: form.control, name: "heroItems" });
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
        <CardTitle>Hero</CardTitle>
        <CardDescription>
          Judul, deskripsi, gambar & statistik ringkas di landing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <FormField
              control={form.control}
              name="appData.heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Judul hero…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appData.heroDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Deskripsi hero…"
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
              control={form.control}
              name="appData.heroImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar (Banner Hero)</FormLabel>
                  <FormControl>
                    <ImageUploader
                      image={field.value}
                      setImage={field.onChange}
                      id="heroImage"
                      errorMessage={
                        form.formState.errors.appData?.heroImage?.message
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Statistik</h4>
          {heroArray.fields.length < 3 && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => heroArray.append({ label: "", value: "" })}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Statistik
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {heroArray.fields.map((f, i) => (
            <div key={f.id} className="flex flex-col gap-2">
              <p className="text-xs font-medium">Statistik {i + 1}</p>
              <div
                key={f.id}
                className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                {/* label */}
                <FormField
                  control={form.control}
                  name={`heroItems.${i}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Label</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Label (mis. Komunitas)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* value */}
                <FormField
                  control={form.control}
                  name={`heroItems.${i}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Nilai</FormLabel>
                      <FormControl>
                        <Input placeholder="Nilai (mis. 120+)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="sm:justify-self-end"
                  onClick={() => heroArray.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {heroArray.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada item. Tambahkan minimal satu statistik agar area hero
              hidup.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
