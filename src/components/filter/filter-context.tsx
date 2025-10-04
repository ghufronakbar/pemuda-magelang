"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface FilterContext {
  search: string;
  setSearch: (search: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

const FilterContext = createContext<FilterContext>({
  search: "",
  setSearch: () => {},
  category: "",
  setCategory: () => {},
});

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    setCategory("");
    setSearch("");
  }, [pathname]);
  return (
    <FilterContext.Provider
      value={{ search, setSearch, category, setCategory }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
