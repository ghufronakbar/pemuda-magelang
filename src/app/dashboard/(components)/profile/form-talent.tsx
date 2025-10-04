"use client";

import * as React from "react";
import { useFieldArray } from "react-hook-form";
import { SocialMediaPlatformEnum } from "@prisma/client";
import { useFormUser } from "@/context/form-user-context";

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
import { TagsInput } from "@/components/custom/tags-input";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";
import { INDUSTRY_LIST } from "@/data/industry";

// ===== Helpers untuk input type="date" =====
function formatDateInput(d?: Date | null) {
  if (!d) return "";
  try {
    // pastikan ke YYYY-MM-DD (UTC-safe)
    const iso = new Date(d).toISOString();
    return iso.slice(0, 10);
  } catch {
    return "";
  }
}
function toDateOrNull(v: string) {
  const s = v?.trim();
  if (!s) return null;
  // interpret sebagai tanggal lokal 00:00
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
}

export function FormTalent({
  pending,
  onSubmit,
  disabled,
}: {
  pending: boolean;
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
  disabled?: boolean;
}) {
  const { formTalent } = useFormUser();

  // ===== Field Arrays =====
  const smArray = useFieldArray({
    control: formTalent.control,
    name: "socialMedias",
  });
  const workExperiencesArray = useFieldArray({
    control: formTalent.control,
    name: "workExperiences",
  });
  const educationsArray = useFieldArray({
    control: formTalent.control,
    name: "educations",
  });
  const awardsArray = useFieldArray({
    control: formTalent.control,
    name: "awards",
  });

  return (
    <Form {...formTalent}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* ===== Basic ===== */}
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

        {/* ===== Banner ===== */}
        <div>
          <FormLabel className="mb-2 block">Banner</FormLabel>
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

        {/* ===== Description ===== */}
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

        {/* ===== Skills (string[]) ===== */}
        <FormField
          control={formTalent.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keahlian (Skills)</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Ketik skill lalu Enter (mis: fotografi, copywriting)…"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== Social Medias ===== */}
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
            <div key={f.id} className="flex flex-row gap-3 items-start">
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
                        <SelectTrigger>
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
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://…"
                        {...field}
                        disabled={disabled}
                        className="w-full"
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

        {/* ===== Work Experiences ===== */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Pengalaman Kerja</h4>
          {!disabled && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                workExperiencesArray.append({
                  companyName: "",
                  position: "",
                  description: "",
                  startDate: new Date(),
                  endDate: null,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {workExperiencesArray.fields.map((f, i) => (
            <div key={f.id} className="rounded-md border p-3 space-y-3">
              <div className="grid gap-3 md:grid-cols-2 items-start">
                <FormField
                  control={formTalent.control}
                  name={`workExperiences.${i}.companyName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Perusahaan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: PT Maju Jaya"
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
                  name={`workExperiences.${i}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Senior Designer"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 items-start">
                <FormField
                  control={formTalent.control}
                  name={`workExperiences.${i}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={formatDateInput(field.value as Date)}
                          onChange={(e) =>
                            field.onChange(toDateOrNull(e.target.value))
                          }
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formTalent.control}
                  name={`workExperiences.${i}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Selesai (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={formatDateInput(field.value as Date | null)}
                          onChange={(e) =>
                            field.onChange(toDateOrNull(e.target.value))
                          }
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={formTalent.control}
                name={`workExperiences.${i}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!disabled && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => workExperiencesArray.remove(i)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          ))}

          {workExperiencesArray.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada pengalaman kerja.
            </p>
          )}
        </div>

        {/* ===== Educations ===== */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Pendidikan</h4>
          {!disabled && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                educationsArray.append({
                  degree: "",
                  schoolName: "",
                  description: "",
                  startDate: new Date(),
                  endDate: null,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {educationsArray.fields.map((f, i) => (
            <div key={f.id} className="rounded-md border p-3 space-y-3">
              <div className="grid gap-3 md:grid-cols-2 items-start">
                <FormField
                  control={formTalent.control}
                  name={`educations.${i}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenjang</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: S1 Informatika"
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
                  name={`educations.${i}.schoolName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Sekolah/Kampus</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Universitas X"
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 items-start">
                <FormField
                  control={formTalent.control}
                  name={`educations.${i}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={formatDateInput(field.value as Date)}
                          onChange={(e) =>
                            field.onChange(toDateOrNull(e.target.value))
                          }
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formTalent.control}
                  name={`educations.${i}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Selesai (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={formatDateInput(field.value as Date | null)}
                          onChange={(e) =>
                            field.onChange(toDateOrNull(e.target.value))
                          }
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={formTalent.control}
                name={`educations.${i}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!disabled && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => educationsArray.remove(i)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          ))}

          {educationsArray.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada data pendidikan.
            </p>
          )}
        </div>

        {/* ===== Awards ===== */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Penghargaan (Awards)</h4>
          {!disabled && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                awardsArray.append({
                  image: null,
                  name: "",
                  description: "",
                  date: new Date(),
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {awardsArray.fields.map((f, i) => (
            <div key={f.id} className="rounded-md border p-3 space-y-3">
              <div className="grid gap-3 md:grid-cols-[220px_1fr] items-start">
                <FormField
                  control={formTalent.control}
                  name={`awards.${i}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar (opsional)</FormLabel>
                      <FormControl>
                        <ImageUploader
                          image={field.value ?? null}
                          id={`award-image-${i}`}
                          setImage={(url) =>
                            formTalent.setValue(`awards.${i}.image`, url)
                          }
                          errorMessage={
                            formTalent.formState.errors.awards?.[i]?.image
                              ?.message as string | undefined
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormField
                    control={formTalent.control}
                    name={`awards.${i}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Penghargaan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Best Photographer 2024"
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
                    name={`awards.${i}.date`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            type="date"
                            value={formatDateInput(field.value as Date)}
                            onChange={(e) =>
                              field.onChange(toDateOrNull(e.target.value))
                            }
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formTalent.control}
                    name={`awards.${i}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi (opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            {...field}
                            value={field.value ?? ""}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {!disabled && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => awardsArray.remove(i)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          ))}

          {awardsArray.fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Belum ada penghargaan.
            </p>
          )}
        </div>

        {/* ===== Submit (opsional, kalau parent kirim onSubmit) ===== */}
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
