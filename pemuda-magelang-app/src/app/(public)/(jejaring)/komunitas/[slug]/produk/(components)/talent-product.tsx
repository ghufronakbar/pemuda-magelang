"use client";

import * as React from "react";
import { Product, SocialMedia, Talent, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TalentHeader } from "@/app/(public)/(jejaring)/talenta/[slug]/(components)/talent-header";
import { TalentBio } from "@/app/(public)/(jejaring)/talenta/[slug]/(components)/talent-bio";
import { TalentProduct } from "@/app/(public)/(jejaring)/talenta/[slug]/(components)/talent-product";

export interface TalentProductProps {
  talent: Talent & {
    products: Product[];
    socialMedias: SocialMedia[];
    user: User;
  };
  className?: string;
}

export function TalentDetailProduct({ talent, className }: TalentProductProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* ===== Header (Banner + Avatar + Basic Info) ===== */}
      <TalentHeader talent={talent} />

      {/* ===== Bio / Deskripsi ===== */}

      <TalentBio bio={`Produk oleh ${talent.name}`} />

      {/* ===== Produk ===== */}
      <TalentProduct
        products={talent.products}
        talent={talent}
        showShowAllButton={false}
      />
    </section>
  );
}
