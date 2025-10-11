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
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/custom/image-uploader";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IconEnum } from "@prisma/client";
import { iconEnum } from "@/enum/icon-enum";
export const FormAboutHighlights = () => {
  const { form, onSubmit } = useFormAppData();
  const aboutArray = useFieldArray({
    control: form.aboutItems.control,
    name: "aboutItems",
  });

  return (
    <Form {...form.aboutItems}>
      <form onSubmit={onSubmit.aboutItems}>
        <Card>
          <CardHeader>
            <CardTitle>Highlight</CardTitle>
            <CardDescription>Poin highlight untuk About.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Daftar Highlight</h4>
              {aboutArray.fields.length < 4 && (
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() =>
                    aboutArray.append({
                      title: "",
                      description: "",
                      icon: IconEnum.sparkles,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah Highlight
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {aboutArray.fields.map((f, i) => (
                <Card key={f.id} className="flex flex-col gap-2">
                  <CardHeader>
                    <Label>Highlight {i + 1}</Label>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-row flex-wrap gap-2 w-full">
                      <div className="flex flex-col lg:flex-row gap-2 w-full">
                        <FormField
                          control={form.aboutItems.control}
                          name={`aboutItems.${i}.title`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="sr-only">Judul</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Judul poin (mis. Misi)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.aboutItems.control}
                          name={`aboutItems.${i}.icon`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="sr-only">Ikon</FormLabel>
                              <FormControl>
                                <Select
                                  value={String(field.value ?? "")}
                                  onValueChange={(v) => field.onChange(v)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih ikon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.values(IconEnum).map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {iconEnum?.getIcon
                                          ? iconEnum.getIcon(opt)
                                          : null}
                                        {iconEnum?.getLabel
                                          ? iconEnum.getLabel(opt)
                                          : opt}
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
                    </div>
                    <FormField
                      control={form.aboutItems.control}
                      name={`aboutItems.${i}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Deskripsi</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={6}
                              className="resize-none min-h-[70px]"
                              placeholder="Deskripsi singkat"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AlertConfirmation
                      title="Hapus Item Highlight"
                      description="Apakah Anda yakin ingin menghapus item highlight ini? Tindakan ini tidak dapat dibatalkan."
                      onConfirm={() => aboutArray.remove(i)}
                    >
                      <Button
                        type="button"
                        variant="destructive"
                        className="sm:justify-self-end ml-auto flex-shrink-0"
                      >
                        Hapus
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertConfirmation>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={form.aboutItems.formState.isSubmitting}
              >
                {form.aboutItems.formState.isSubmitting ? (
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
