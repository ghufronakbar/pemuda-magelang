import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import {
  SocialMedia,
  SocialMediaPlatformEnum,
  Talent,
  TalentStatusEnum,
} from "@prisma/client";
import Image from "next/image";
import { getInitials, normalizeSocialUrl } from "@/lib/helper";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";
import Link from "next/link";

interface TalentHeaderProps {
  talent: Talent & {
    socialMedias: SocialMedia[];
  };
}

export const TalentHeader = ({ talent }: TalentHeaderProps) => {
  const {
    bannerPicture,
    name,
    profilePicture,
    profession,
    industry,
    status,
    socialMedias,
  } = talent;

  // CTA prioritas WhatsApp -> Email -> Website -> lainnya
  const cta =
    socialMedias.find((s) => s.platform === SocialMediaPlatformEnum.whatsapp) ??
    socialMedias.find((s) => s.platform === SocialMediaPlatformEnum.email) ??
    socialMedias.find((s) => s.platform === SocialMediaPlatformEnum.website) ??
    socialMedias[0] ??
    null;

  const ctaHref = cta ? normalizeSocialUrl(cta.platform, cta.url) : null;
  const ctaLabel = cta
    ? `Hubungi di ${socialMediaPlatformEnum.getLabel(cta.platform)}`
    : "Hubungi";
  return (
    <div className="relative mb-16 overflow-hidden rounded-2xl border bg-card">
      {/* Banner */}
      <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-72">
        {bannerPicture ? (
          <Image
            src={bannerPicture}
            alt={`${name} banner`}
            fill
            sizes="(max-width:1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
            Banner belum diatur
          </div>
        )}
        {/* scrim agar tepi bawah lebih kontras */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/10 to-transparent" />
      </div>

      {/* Basic Info: tanpa -mt pada ROW, hanya avatar yang overlap */}
      <div className="px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* kiri: avatar + teks */}
          <div className="flex min-w-0 items-end gap-4">
            {/* Avatar overlap sedikit ke banner */}
            <div className="-mt-10 sm:-mt-12">
              <Avatar className="h-20 w-20 ring-4 ring-background sm:h-24 sm:w-24">
                <AvatarImage src={profilePicture ?? ""} alt={name} />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* truncate untuk nama panjang */}
                <h1 className="truncate text-xl font-semibold sm:text-2xl">
                  {name}
                </h1>
                {status === TalentStatusEnum.approved && (
                  <Badge className="shrink-0 gap-1 bg-primary/10 text-primary" variant="outline">
                    <CheckCheck className="h-3.5 w-3.5 text-primary" />
                    Terverifikasi
                  </Badge>
                )}
              </div>
              <div className="mt-1 truncate text-sm text-muted-foreground">
                {profession} • {industry}
              </div>
            </div>
          </div>

          {/* kanan: CTA, beri ruang & tidak mepet */}
          {ctaHref && (
            <Button asChild size="lg" className="shrink-0 sm:mt-0 md:mb-1">
              <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
                {socialMediaPlatformEnum.getIcon(
                  cta.platform,
                  "mr-2 text-white"
                )}
                {ctaLabel}
              </Link>
            </Button>
          )}
        </div>

        {/* Sosial media list */}
        {socialMedias.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {socialMedias.map((sm) => {
              const href = normalizeSocialUrl(sm.platform, sm.url);
              return (
                <Button
                  key={sm.id}
                  asChild
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-foreground"
                >
                  <Link href={href} target="_blank" rel="noopener noreferrer">
                    {socialMediaPlatformEnum.getIcon(sm.platform)}
                    <span className="text-xs text-primary">
                      {socialMediaPlatformEnum.getLabel(sm.platform)}
                    </span>
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
