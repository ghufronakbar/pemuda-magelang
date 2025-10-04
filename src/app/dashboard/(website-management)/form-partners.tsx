"use client";

import { useFormAppData } from "@/context/form-app-data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/custom/image-uploader";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PartnerTypeEnum } from "@prisma/client";
import { partnerTypeEnum } from "@/enum/partner-type-enum";
import { useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UrlInput } from "@/components/custom/url-input";

export const FormPartners = () => {
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
            variant="default"
            onClick={() => appendFor(type)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden lg:inline ml-2">
              Tambah {partnerTypeEnum.getLabel(type)}
            </span>
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
                  variant="destructive"
                  onClick={() => partnerArray.remove(i)}
                >
                  Hapus
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {indexes.length === 0 && (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              Belum ada partner pada kelompok{" "}
              <b>{partnerTypeEnum.getLabel(type)}</b>.
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
};
