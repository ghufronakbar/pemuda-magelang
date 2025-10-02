"use client";

import { useMemo } from "react";
import { ArticleCardProps } from "../type";
import { ArticleGridCard } from "./article-grid-card";
import { useArticleFilter } from "../filter/article-filter-context";

export const ArticleGridMap = ({ data }: { data: ArticleCardProps[] }) => {
  const { search, category } = useArticleFilter();
  const filteredData = useMemo(() => {
    return data.filter(
      (a) =>
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) &&
        a.title.toLowerCase().includes(search.toLowerCase()) &&
        a.category.toLowerCase().includes(category.toLowerCase())
    );
  }, [data, search, category]);

  if (filteredData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Tidak ada artikel yang cocok dengan pencarian
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      {filteredData.map((a) => (
        <ArticleGridCard key={a.slug} {...a} />
      ))}
    </div>
  );
};
