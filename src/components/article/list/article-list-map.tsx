"use client";

import { useMemo } from "react";
import { ArticleListCard } from "./article-list-card";
import { ArticleCardProps } from "../type";
import { useArticleFilter } from "../filter/article-filter-context";

export const ArticleListMap = ({ data }: { data: ArticleCardProps[] }) => {
  const { search, category } = useArticleFilter();
  const filteredData = useMemo(() => {
    return data.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) &&
        a.category.toLowerCase().includes(category.toLowerCase())
    );
  }, [data, search, category]);

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col gap-5 max-w-4xl mx-auto h-40 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Tidak ada artikel yang cocok dengan pencarian
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {filteredData.map((a) => (
        <ArticleListCard key={a.slug} {...a} />
      ))}
    </div>
  );
};
