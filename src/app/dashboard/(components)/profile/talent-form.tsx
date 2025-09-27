"use client";

import { useFormUser } from "@/context/form-user-context";
import { useFieldArray } from "react-hook-form";
import { SocialMediaPlatformEnum } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/custom/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";

export function TalentForm({
  pending,
  onSubmit,
  disabled,
}: {
  pending: boolean;
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
  disabled?: boolean;
}) {
  const { formTalent } = useFormUser();
  const smArray = useFieldArray({
    control: formTalent.control,
    name: "socialMedias",
  });

  return (
    <Form {...formTalent}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={formTalent.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profesi</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Fotografer, Penulis…"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formTalent.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industri</FormLabel>
                <FormControl>
                  <Select
                    disabled={disabled}
                    onValueChange={(v) => field.onChange(v)}
                    value={String(field.value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih industri" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_LIST.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
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

        <div>
          <FormLabel className="mb-2">Banner</FormLabel>
          <FormField
            control={formTalent.control}
            name="bannerPicture"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    image={field.value ?? null}
                    id="bannerPicture"
                    setImage={(url) =>
                      formTalent.setValue("bannerPicture", url)
                    }
                    errorMessage={
                      formTalent.formState.errors.bannerPicture?.message
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={formTalent.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={4}
                  placeholder="Ceritakan tentang dirimu…"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Media Sosial</h4>
          {!disabled && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => smArray.append({ platform: "instagram", url: "" })}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {smArray.fields.map((f, i) => (
            <div
              key={f.id}
              className="grid gap-3 md:grid-cols-[220px_1fr_auto]"
            >
              <FormField
                control={formTalent.control}
                name={`socialMedias.${i}.platform`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Platform</FormLabel>
                    <FormControl>
                      <Select
                        disabled={disabled}
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

              <FormField
                control={formTalent.control}
                name={`socialMedias.${i}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://…"
                        {...field}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!disabled ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => smArray.remove(i)}
                  className="justify-self-end"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : (
                <div />
              )}
            </div>
          ))}

          {smArray.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Tambahkan tautan media sosial agar orang mudah menghubungimu.
            </p>
          )}
        </div>

        {onSubmit && (
          <div>
            <Button type="submit" disabled={pending} className="min-w-28">
              {pending ? "Memproses…" : "Kirim"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

const INDUSTRY_LIST = [
  "Kreatif",
  "Edukasi",
  "Teknologi",
  "Bisnis",
  "Kesehatan",
  "Olahraga",
  "Kuliner",
];
