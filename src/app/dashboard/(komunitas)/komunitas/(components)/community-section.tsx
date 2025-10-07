"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { FormCommunity } from "./form-community";
import { CommunityStatusEnum } from "@prisma/client";
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
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { FiExternalLink } from "react-icons/fi";
import { useFormCommunity } from "@/context/form-community-context";

interface CommunitySectionProps {
  className?: string;
  showForm?: boolean;
  title?: string;
  description?: string;
}

export function CommunitySection({
  className,
  showForm = true,
  title,
  description,
}: CommunitySectionProps) {
  const { data: session } = useSession();

  const {
    communityStatus,
    onSubmit,
    openCommunityDialog,
    setOpenCommunityDialog,
    loading,
    fetching,
  } = useFormCommunity();
  const isRegistered = !!communityStatus;
  const isEditable = communityStatus === "approved";

  if (session?.user?.role !== "user") return null;
  if (fetching) {
    return (
      <Card className="animate-pulse col-span-1">
        <CardHeader>
          <CardTitle>Memuat Data</CardTitle>
          <CardDescription>Harap tunggu</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="h-40 w-full rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
          <div className="col-span-2 h-10 w-full rounded bg-muted" />
          <div className="col-span-2 h-10 w-full rounded bg-muted" />
          <div className="col-span-2 h-10 w-full rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className={cn("rounded-xl border-muted/40 shadow-sm", className)}>
      <CardHeader className="pb-4 border-b border-muted/40">
        <CardTitle>{title ?? "Komunitas"}</CardTitle>
        <CardDescription>
          {description
            ? description
            : isRegistered
            ? "Kelola profil komunitas kamu."
            : "Belum terdaftar sebagai komunitas. Daftar dan bergabung bersama Pemuda Magelang."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info status bila belum approved */}
        {((communityStatus && communityStatus !== "approved") || !showForm) && (
          <div className="rounded-lg border border-muted/40 bg-muted/30 p-4 text-sm flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-2">
              <CommunityStatusBadge status={communityStatus!} />
              <span className="font-medium">{statusText(communityStatus)}</span>
            </div>
            <p className="text-muted-foreground">
              {statusDescription(communityStatus)}
            </p>
            {communityStatus === "approved" && (
              <Button asChild size="sm" className="mt-2 self-end">
                <Link href={`/dashboard/akun`}>
                  <div className="flex items-center gap-2">
                    <FiExternalLink />
                    Lihat profil
                  </div>
                </Link>
              </Button>
            )}
            {(!communityStatus || communityStatus === "rejected") && (
              <Button
                size="sm"
                className="mt-2 self-end"
                onClick={() => setOpenCommunityDialog(true)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles />
                  {communityStatus === "rejected" ? "Ajukan Ulang" : "Daftar sebagai Komunitas"}
                </div>
              </Button>
            )}
          </div>
        )}

        {/* CTA daftar (belum terdaftar atau ditolak) */}
        {(!communityStatus || communityStatus === "rejected") && (
          <Dialog
            open={openCommunityDialog}
            onOpenChange={setOpenCommunityDialog}
          >

            <DialogContent className="max-w-4xl max-h-[90vh] rounded-xl flex flex-col h-full w-full max-h-full max-w-full md:max-w-4xl md:max-h-[90vh] md:h-auto md:w-auto md:rounded-xl">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Daftar Komunitas</DialogTitle>
                <DialogDescription>
                  Isi data berikut untuk mengajukan pendaftaran sebagai
                  Komunitas.
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-1">
                <FormCommunity
                  pending={loading}
                  onSubmit={onSubmit}
                  showSubmit={false}
                  formId="communityRegisterForm"
                />
              </div>

              <DialogFooter className="flex-shrink-0">
                <Button form="communityRegisterForm" type="submit" disabled={loading} className="min-w-28">
                  {loading ? "Memproses…" : "Ajukan permohonan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Form edit (sudah terdaftar) */}
        {communityStatus === "approved" && showForm && (
          <div className="space-y-6">
            <FormCommunity
              pending={loading}
              disabled={!isEditable}
              onSubmit={onSubmit}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ===== Badges + helper text ===== */
function CommunityStatusBadge({ status }: { status: CommunityStatusEnum }) {
  const map: Record<CommunityStatusEnum, string> = {
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

function statusText(s: CommunityStatusEnum | null) {
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
function statusDescription(s: CommunityStatusEnum | null) {
  if (!s) return "Kamu belum terdaftar sebagai komunitas.";
  switch (s) {
    case "pending":
      return "Pengajuanmu sedang ditinjau. Kamu akan mendapat pemberitahuan saat sudah disetujui.";
    case "rejected":
      return "Maaf, pengajuanmu belum dapat kami setujui. Hubungi admin untuk info lebih lanjut.";
    case "banned":
      return "Akun komunitas diblokir. Hubungi admin bila ini sebuah kesalahan.";
    case "approved":
      return "Selamat! Akun komunitas kamu sudah aktif.";
  }
}
