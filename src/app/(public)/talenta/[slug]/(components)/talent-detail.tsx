"use client";

import * as React from "react";
import { Article, Product, SocialMedia, Talent, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TalentHeader } from "./talent-header";
import { TalentBio } from "./talent-bio";
import { TalentProduct } from "./talent-product";
import { TalentArticle } from "./talent-article";

export interface TalentDetailProps {
  talent: Talent & {
    products: Product[];
    socialMedias: SocialMedia[];
    user: User & {
      articles: Article[];
    };
  };
  className?: string;
}

export function TalentDetail({ talent, className }: TalentDetailProps) {
  const { description, products, user } = talent;

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* ===== Header (Banner + Avatar + Basic Info) ===== */}
      <TalentHeader talent={talent} />

      {/* ===== Bio / Deskripsi ===== */}

      <TalentBio bio={description} />

      <TalentProduct
        products={products?.slice(0, 3) ?? []}
        talent={talent}
        showShowAllButton={products.length > 3}
      />

      {/* ===== Artikel Populer ===== */}
      <TalentArticle
        articles={user.articles?.slice(0, 3) ?? []}
        user={{
          ...user,
          talent: talent,
        }}
        showShowAllButton={user.articles.length > 3}
      />
    </section>
  );
}
