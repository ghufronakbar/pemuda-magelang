"use client";

import * as React from "react";
import { Community, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { CommunityHeader } from "./community-header";

import { CommunityArticle } from "./community-article";
import { ArticleCardProps } from "@/components/article/type";

export interface CommunityDetailProps {
  data: Community & {
    user: User;
    articles: ArticleCardProps[];
  };
  className?: string;
}

export function CommunityDetail({ data, className }: CommunityDetailProps) {
  const { user, articles } = data;

  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {/* ===== Header (Banner + Avatar + Basic Info) ===== */}
      <CommunityHeader community={data} />

      {/* ===== Bio / Deskripsi ===== */}

      {/* <CommunityBio bio={description} /> */}

      <CommunityArticle
        articles={articles}
        user={{
          ...user,
          talent: null,
        }}
        showShowAllButton={false}
      />
    </section>
  );
}
