"use client";

import * as React from "react";
import { Article, Product, SocialMedia, Talent, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { TalentHeader } from "@/app/(public)/(jejaring)/talenta/[slug]/(components)/talent-header";
import { TalentBio } from "@/app/(public)/(jejaring)/talenta/[slug]/(components)/talent-bio";
import { TalentArticle } from "@/app/(public)/(jejaring)/talenta/[slug]/(components)/talent-article";

interface DetailArticle extends Article {
  _count: {
    articleUserLikes: number;
    comments: number;
  };
}

export interface TalentArticleProps {
  talent: Talent & {
    products: Product[];
    socialMedias: SocialMedia[];
    user: User & {
      articles: DetailArticle[];
    };
  };
  className?: string;
}

export function TalentDetailArticle({ talent, className }: TalentArticleProps) {
  const { user } = talent;

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* ===== Header (Banner + Avatar + Basic Info) ===== */}
      <TalentHeader talent={talent} />

      {/* ===== Bio / Deskripsi ===== */}

      <TalentBio bio={`Artikel oleh ${talent.name}`} />

      {/* ===== Artikel Populer ===== */}
      <TalentArticle
        articles={user.articles}
        user={{
          ...user,
          talent: talent,
        }}
        showShowAllButton={false}
      />
    </section>
  );
}
