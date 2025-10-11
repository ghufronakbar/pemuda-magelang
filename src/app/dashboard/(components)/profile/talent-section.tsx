"use client";

import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormUser } from "@/context/form-user-context";
import { updateUserTalent } from "@/actions/user";
import { FormTalent } from "./form-talent";
import { TalentStatusEnum } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Save } from "lucide-react";
import type { UserTalentInput } from "@/validator/user";

interface TalentSectionProps {
  className?: string;
  title?: string;
  description?: string;
}

export function TalentSection({
  className,
  // showForm = true,
  title,
  description,
}: TalentSectionProps) {
  const { data: session } = useSession();

  const {
    talentStatus,
    formTalent,
    openTalentDialog,
    setOpenTalentDialog,
    refetch,
    loading,
  } = useFormUser();
  const isRegistered = !!talentStatus;
  const isEditable = talentStatus === "approved";

  const [pending, setPending] = useState(false);

  const router = useRouter();

  const onSubmit = formTalent.handleSubmit(async (data: UserTalentInput) => {
    try {
      setPending(true);
      const mappedData = {
        ...data,
        awards: data.awards.map((award) => ({
          ...award,
          date: new Date(award.date),
        })),
        educations: data.educations.map((education) => ({
          ...education,
          startDate: new Date(education.startDate),
          endDate: education.endDate ? new Date(education.endDate) : null,
        })),
        workExperiences: data.workExperiences.map((workExperience) => ({
          ...workExperience,
          startDate: new Date(workExperience.startDate),
          endDate: workExperience.endDate
            ? new Date(workExperience.endDate)
            : null,
        })),
      };
      const fd = new FormData();
      fd.append("payload", JSON.stringify(mappedData));

      const res = await updateUserTalent(fd);
      if (!res?.ok) {
        console.log("res error", res?.error);
        toast.error(res?.error ?? "Gagal menyimpan data talenta");
      } else {
        toast.success(
          !isRegistered
            ? "Pendaftaran talenta berhasil dikirim"
            : "Profil talenta berhasil diperbarui"
        );
        setOpenTalentDialog(false);
        refetch();
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan pada talenta");
    } finally {
      setPending(false);
    }
  });

  if (loading)
    return (
      <Card
        className={cn(
          "rounded-xl border-muted/40 shadow-sm animate-pulse",
          className
        )}
      >
        <CardHeader>
          <CardTitle>Memuat Data</CardTitle>
          <CardDescription>Harap tunggu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="w-full h-10 rounded-md bg-muted" />
          <div className="w-full h-10 rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  if (session?.user?.role !== "user") return null;
  return (
    <Card className={cn("rounded-xl border-muted/40 shadow-sm", className)}>
      <CardHeader className="pb-4 border-b border-muted/40">
        <CardTitle>{title ?? "Talenta"}</CardTitle>
        <CardDescription>
          {description
            ? description
            : isRegistered
            ? "Kelola profil talenta kamu."
            : "Belum terdaftar sebagai talenta. Daftar dan tampilkan karya/produkmu."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info status bila belum approved */}
        {talentStatus !== "approved" && (
          <div className="rounded-lg border border-muted/40 bg-muted/30 p-4 text-sm flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-2">
              <TalentStatusBadge status={talentStatus!} />
              <span className="font-medium">{statusText(talentStatus)}</span>
            </div>
            <p className="text-muted-foreground">
              {statusDescription(talentStatus)}
            </p>
            {(!talentStatus || talentStatus === "rejected") && (
              <Button
                size="sm"
                className="mt-2 self-end"
                onClick={() => setOpenTalentDialog(true)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles />
                  {talentStatus === "rejected"
                    ? "Ajukan Ulang"
                    : "Daftar sebagai Talenta"}
                </div>
              </Button>
            )}
          </div>
        )}

        {/* CTA daftar (belum terdaftar atau ditolak) */}
        {(!talentStatus || talentStatus === "rejected") && (
          <Dialog open={openTalentDialog} onOpenChange={setOpenTalentDialog}>
            <DialogContent className="max-w-3xl max-h-[90vh] rounded-xl flex flex-col h-full w-full max-h-full max-w-full md:max-w-3xl md:max-h-[90vh] md:h-auto md:w-auto md:rounded-xl">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Daftar Talenta</DialogTitle>
                <DialogDescription>
                  Isi data berikut untuk mengajukan pendaftaran sebagai Talenta.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-1">
                <FormTalent
                  pending={pending}
                  onSubmit={onSubmit}
                  showSubmit={false}
                  formId="talentRegisterForm"
                />
              </div>

              <DialogFooter className="flex-shrink-0">
                <Button
                  form="talentRegisterForm"
                  type="submit"
                  disabled={pending}
                  className="min-w-28"
                >
                  {pending ? "Memproses…" : "Ajukan permohonan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Form edit (sudah terdaftar) */}
        {talentStatus === "approved" && (
          <form onSubmit={onSubmit} className="space-y-6">
            <FormTalent pending={pending} disabled={!isEditable} />
            <div>
              <Button
                type="submit"
                disabled={!isEditable || pending}
                className="min-w-28"
              >
                {pending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

/* ===== Badges + helper text ===== */
function TalentStatusBadge({ status }: { status: TalentStatusEnum }) {
  const map: Record<TalentStatusEnum, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    banned: "bg-rose-100 text-rose-700",
  };
  return (
    <Badge
      className={cn("rounded-full capitalize", map[status])}
      variant="secondary"
    >
      {statusText(status)}
    </Badge>
  );
}

function statusText(s: TalentStatusEnum | null) {
  if (!s) return "Belum terdaftar";
  switch (s) {
    case "pending":
      return "Menunggu";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "banned":
      return "Diblokir";
  }
}
function statusDescription(s: TalentStatusEnum | null) {
  if (!s) return "Kamu belum terdaftar sebagai talenta.";
  switch (s) {
    case "pending":
      return "Pengajuanmu sedang ditinjau. Kamu akan mendapat pemberitahuan saat sudah disetujui.";
    case "rejected":
      return "Maaf, pengajuanmu belum dapat kami setujui. Hubungi admin untuk info lebih lanjut.";
    case "banned":
      return "Akun talenta diblokir. Hubungi admin bila ini sebuah kesalahan.";
    case "approved":
      return "Selamat! Akun talenta kamu sudah aktif.";
  }
}
