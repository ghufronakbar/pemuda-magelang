"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface ArticleFilterContext {
  search: string;
  setSearch: (search: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

const ArticleFilterContext = createContext<ArticleFilterContext>({
  search: "",
  setSearch: () => {},
  category: "",
  setCategory: () => {},
});

export const ArticleFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    setCategory("");
  }, [pathname]);
  return (
    <ArticleFilterContext.Provider
      value={{ search, setSearch, category, setCategory }}
    >
      {children}
    </ArticleFilterContext.Provider>
  );
};

export const useArticleFilter = () => {
  const context = useContext(ArticleFilterContext);
  if (!context) {
    throw new Error(
      "useArticleFilter must be used within a ArticleFilterProvider"
    );
  }
  return context;
};
