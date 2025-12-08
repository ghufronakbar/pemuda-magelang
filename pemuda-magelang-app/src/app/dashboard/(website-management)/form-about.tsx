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

export const FormAbout = () => {
  const { form, onSubmit } = useFormAppData();
  return (
    <Form {...form.about}>
      <form onSubmit={onSubmit.about}>
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Judul, deskripsi, dan gambar untuk section About.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <FormField
                  control={form.about.control}
                  name="aboutTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="Judul about…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.about.control}
                  name="aboutDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          className="resize-none min-h-[150px]"
                          placeholder="Deskripsi about…"
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
                  control={form.about.control}
                  name="aboutImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar (Banner About)</FormLabel>
                      <FormControl>
                        <ImageUploader
                          image={field.value}
                          setImage={field.onChange}
                          id="aboutImage"
                          errorMessage={
                            form.about.formState.errors?.aboutImage?.message
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={form.about.formState.isSubmitting}
              >
                {form.about.formState.isSubmitting ? (
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
