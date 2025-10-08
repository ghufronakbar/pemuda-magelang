import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { Community, User } from "@prisma/client";
import { getInitials } from "@/lib/helper";

import Link from "next/link";
import { CdnImage, cdnUrl } from "@/components/custom/cdn-image";

interface CommunityHeaderProps {
  community: Community & {
    user: User;
  };
}

export const CommunityHeader = ({ community }: CommunityHeaderProps) => {
  const {
    bannerPicture,
    name,
    profilePicture,
    ctaText,
    ctaLink,
    category,
    description,
  } = community;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border bg-card">
      {/* Banner */}
      <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-72">
        {bannerPicture ? (
          <CdnImage
            uniqueKey={bannerPicture}
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
          <div className="flex flex-col min-w-0 items-start gap-4">
            <div>
              <div className="-mt-10 sm:-mt-12">
                <Avatar className="h-20 w-20 ring-4 ring-background sm:h-24 sm:w-24">
                  <AvatarImage src={cdnUrl(profilePicture ?? "")} alt={name} />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  {/* truncate untuk nama panjang */}
                  <h1 className="truncate text-xl font-semibold sm:text-2xl">
                    {name}
                  </h1>
                </div>
                <div className="mt-1 truncate text-sm text-muted-foreground">
                  {category}
                </div>
              </div>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {/* kanan: CTA, beri ruang & tidak mepet */}
          <div className="flex flex-col gap-2">
            {ctaLink && (
              <Button asChild size="lg" className="shrink-0 sm:mt-0 md:mb-1">
                <Link href={ctaLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="h-4 w-4" />
                  {ctaText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
