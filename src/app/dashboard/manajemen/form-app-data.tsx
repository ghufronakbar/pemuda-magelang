"use client";

import * as React from "react";
import { useFieldArray } from "react-hook-form";
import { useFormAppData } from "@/context/form-app-data-context";
import { IconEnum, PartnerTypeEnum } from "@prisma/client";

// shadcn
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { iconEnum } from "@/enum/icon-enum";
import { partnerTypeEnum } from "@/enum/partner-type-enum";
import { ImageUploader } from "@/components/custom/image-uploader";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

/* ============================
   Helpers
============================ */
function normalizeUrl(s: string) {
  const v = (s ?? "").trim();
  if (!v) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

/** Input URL yang auto-normalize saat blur */
function UrlInput({
  value,
  onChange,
  placeholder,
  id,
  disabled,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <Input
      id={id}
      value={value ?? ""}
      placeholder={placeholder ?? "https://…"}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onChange(normalizeUrl(e.target.value))}
      disabled={disabled}
      inputMode="url"
    />
  );
}

/* ============================
   Root Component
============================ */
export function FormAppData() {
  const { form, loading, onSubmit } = useFormAppData();

  if (loading) {
    return (
      <div className="flex h-[240px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormHero />
        <FormAbout />
        <FormBranding />
        <FormPartners />
        <SubmitFormAppData />
      </form>
    </Form>
  );
}

const FormHero = () => {
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

        <div className="space-y-3">
          {heroArray.fields.map((f, i) => (
            <div key={f.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              {/* label */}
              <FormField
                control={form.control}
                name={`heroItems.${i}.label`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Label (mis. Komunitas)" {...field} />
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

const FormAbout = () => {
  const { form } = useFormAppData();
  const aboutArray = useFieldArray({
    control: form.control,
    name: "aboutItems",
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          Judul, deskripsi, gambar & highlight poin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <FormField
              control={form.control}
              name="appData.aboutTitle"
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
              control={form.control}
              name="appData.aboutDescription"
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
              control={form.control}
              name="appData.aboutImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar (Banner About)</FormLabel>
                  <FormControl>
                    <ImageUploader
                      image={field.value}
                      setImage={field.onChange}
                      id="aboutImage"
                      errorMessage={
                        form.formState.errors.appData?.aboutImage?.message
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
          <h4 className="text-sm font-medium">Highlight</h4>
          {aboutArray.fields.length < 4 && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
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
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-row gap-2 w-full">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:justify-self-end ml-auto flex-shrink-0"
                    onClick={() => aboutArray.remove(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* title */}

                {/* description */}
                <FormField
                  control={form.control}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const FormBranding = () => {
  const { form } = useFormAppData();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>
          Bagian video & narasi brand di landing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="appData.brandingTitle"
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
          control={form.control}
          name="appData.brandingDescription"
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
          control={form.control}
          name="appData.brandingVideo"
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
      </CardContent>
    </Card>
  );
};

export function FormPartners() {
  const { form } = useFormAppData();
  const partnerArray = useFieldArray({
    control: form.control,
    name: "partners",
  });

  // pantau seluruh partners agar bisa dikelompokkan
  const partners = form.watch("partners") ?? [];

  // Helper grouping
  const groups: Array<{
    type: PartnerTypeEnum;
    title: string;
    desc: string;
  }> = [
    {
      type: PartnerTypeEnum.supported,
      title: "Supported",
      desc: "Partner pendukung utama.",
    },
    {
      type: PartnerTypeEnum.collaborator,
      title: "Collaborator",
      desc: "Partner yang berkolaborasi pada inisiatif/kegiatan.",
    },
    {
      type: PartnerTypeEnum.media,
      title: "Media",
      desc: "Partner media & publikasi.",
    },
  ];

  // util untuk menambah partner per kelompok
  const appendFor = (type: PartnerTypeEnum) =>
    partnerArray.append({
      name: "",
      image: "",
      href: "",
      type,
    });

  // Render satu section per type
  const renderSection = (type: PartnerTypeEnum) => {
    // daftar index global (sesuai array asli) yang type-nya sama
    const indexes = partnerArray.fields
      .map((f, i) => i)
      .filter((i) => partners?.[i]?.type === type);

    const count = indexes.length;

    return (
      <div key={type} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold">
              {partnerTypeEnum.getLabel(type)}{" "}
              <Badge variant="secondary" className="ml-2 rounded-full">
                {count}
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">
              {groups.find((g) => g.type === type)?.desc}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => appendFor(type)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah {partnerTypeEnum.getLabel(type)}
          </Button>
        </div>

        {/* Grid kartu partner per kelompok */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {indexes.map((i) => (
            <div
              key={partnerArray.fields[i].id}
              className="flex flex-col gap-2"
            >
              {/* Gambar */}
              <FormField
                control={form.control}
                name={`partners.${i}.image`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xs">Gambar</FormLabel>
                    <FormControl>
                      <ImageUploader
                        id={`partner-image-${i}`}
                        image={field.value}
                        setImage={(url) => field.onChange(url)}
                        errorMessage={
                          form.formState.errors.partners?.[i]?.image?.message
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nama */}
              <FormField
                control={form.control}
                name={`partners.${i}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama partner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL situs */}
              <FormField
                control={form.control}
                name={`partners.${i}.href`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">URL Situs</FormLabel>
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

              {/* Pindah kelompok (opsional) */}
              <FormField
                control={form.control}
                name={`partners.${i}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Kelompok</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value ?? "")}
                        onValueChange={(v) =>
                          field.onChange(v as PartnerTypeEnum)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih kelompok" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PartnerTypeEnum).map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {partnerTypeEnum.getLabel(opt)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => partnerArray.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {indexes.length === 0 && (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              Belum ada partner pada kelompok <b>{partnerTypeEnum.getLabel(type)}</b>.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partners</CardTitle>
        <CardDescription>
          Daftar partner yang tampil di landing, dikelompokkan per tipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {groups.map((g) => renderSection(g.type))}
      </CardContent>
    </Card>
  );
}
const SubmitFormAppData = () => {
  const { form } = useFormAppData();
  return (
    <div className="mt-2 flex items-center gap-2">
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Simpan
      </Button>
      <Button type="button" variant="outline" onClick={() => form.reset()}>
        Reset
      </Button>
    </div>
  );
};
