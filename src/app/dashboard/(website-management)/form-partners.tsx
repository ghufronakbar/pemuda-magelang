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
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { ImageUploader } from "@/components/custom/image-uploader";
import { AlertConfirmation } from "@/components/custom/alert-confirmation";
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
  Form,
} from "@/components/ui/form";
import { UrlInput } from "@/components/custom/url-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FormPartners = () => {
  const { form, onSubmit } = useFormAppData();
  const partnerArray = useFieldArray({
    control: form.partners.control,
    name: "partners",
  });

  // pantau seluruh partners agar bisa dikelompokkan
  const partners = form.partners.watch("partners") ?? [];

  // Helper grouping
  const groups: Array<{
    type: PartnerTypeEnum;
    title: string;
    desc: string;
    tabLabel: string;
    tabValue: string;
  }> = [
    {
      type: PartnerTypeEnum.supported,
      title: "Supported",
      desc: "Partner pendukung utama.",
      tabLabel: "Didukung / Sponsor",
      tabValue: PartnerTypeEnum.supported,
    },
    {
      type: PartnerTypeEnum.collaborator,
      title: "Collaborator",
      desc: "Partner yang berkolaborasi pada inisiatif/kegiatan.",
      tabLabel: "Kolaborator Partner",
      tabValue: PartnerTypeEnum.collaborator,
    },
    {
      type: PartnerTypeEnum.media,
      title: "Media",
      desc: "Partner media & publikasi.",
      tabLabel: "Media Partner",
      tabValue: PartnerTypeEnum.media,
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

    // return null;

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
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
              <input
                type="hidden"
                name={`partners.${i}.type`}
                value={partnerArray.fields[i].type}
              />
              {/* Gambar */}
              <FormField
                control={form.partners.control}
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
                          form.partners.formState.errors.partners?.[i]?.image
                            ?.message
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nama */}
              <FormField
                control={form.partners.control}
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
                control={form.partners.control}
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

              <div className="flex items-center justify-end">
                <AlertConfirmation
                  title="Hapus Partner"
                  description="Apakah Anda yakin ingin menghapus partner ini? Tindakan ini tidak dapat dibatalkan."
                  onConfirm={() => partnerArray.remove(i)}
                >
                  <Button type="button" variant="destructive">
                    Hapus
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertConfirmation>
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

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={form.partners.formState.isSubmitting}>
            {form.partners.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Form {...form.partners}>
      <form onSubmit={onSubmit.partners}>
        <Card>
          <CardHeader>
            <CardTitle>Partners</CardTitle>
            <CardDescription>
              Daftar partner yang tampil di landing, dikelompokkan per tipe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue={groups[0].tabValue} className="w-full">
              <div className="space-y-4">
                <TabsList className="flex w-full h-12 gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto items-center justify-start">
                  {groups.map((g) => (
                    <TabsTrigger
                      key={g.tabValue}
                      value={g.tabValue}
                      className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
                    >
                      {g.tabLabel}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {groups.map((g) => (
                <TabsContent
                  key={g.tabValue}
                  value={g.tabValue}
                  className="space-y-4"
                >
                  {renderSection(g.type)}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
