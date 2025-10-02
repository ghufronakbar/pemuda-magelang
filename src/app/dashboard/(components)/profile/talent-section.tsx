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
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import type { UserTalentInput } from "@/validator/user";
import { FiExternalLink } from "react-icons/fi";

interface TalentSectionProps {
  className?: string;
  showForm?: boolean;
  title?: string;
  description?: string;
}

export function TalentSection({
  className,
  showForm = true,
  title,
  description,
}: TalentSectionProps) {
  const { data: session } = useSession();

  const { talentStatus, formTalent, openTalentDialog, setOpenTalentDialog } =
    useFormUser();
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
      console.log("data", mappedData);
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
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi kesalahan pada talenta");
    } finally {
      setPending(false);
    }
  });

  if (session?.user?.role !== "user") return null;
  return (
    <Card className={className}>
      <CardHeader>
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
        {((isRegistered && talentStatus !== "approved") || !showForm) && (
          <div className="rounded-md border p-3 text-sm flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-2">
              <TalentStatusBadge status={talentStatus!} />
              <span className="font-medium">{statusText(talentStatus)}</span>
            </div>
            <p className="text-muted-foreground">
              {statusDescription(talentStatus)}
            </p>
            {talentStatus === "approved" && (
              <Button asChild size="sm" className="mt-2 self-end">
                <Link href={`/dashboard/akun`}>
                  <div className="flex items-center gap-2">
                    <FiExternalLink />
                    Lihat profil
                  </div>
                </Link>
              </Button>
            )}
            {!talentStatus && (
              <Button
                size="sm"
                className="mt-2 self-end"
                onClick={() => setOpenTalentDialog(true)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles />
                  Daftar sebagai Talenta
                </div>
              </Button>
            )}
          </div>
        )}

        {/* CTA daftar (belum terdaftar) */}
        {!isRegistered && (
          <Dialog open={openTalentDialog} onOpenChange={setOpenTalentDialog}>
            {showForm && (
              <Button size="sm" onClick={() => setOpenTalentDialog(true)}>
                Daftar sebagai Talenta
              </Button>
            )}

            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Daftar Talenta</DialogTitle>
                <DialogDescription>
                  Isi data berikut untuk mengajukan pendaftaran sebagai Talenta.
                </DialogDescription>
              </DialogHeader>

              <FormTalent pending={pending} onSubmit={onSubmit} />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Form edit (sudah terdaftar) */}
        {isRegistered && showForm && (
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
                ) : null}
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
