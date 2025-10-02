"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useArticleFilter } from "./article-filter-context";
import { Button } from "../../ui/button";

interface Props {
  categories: string[];
  className?: string;
}

export const ArticleFilter = ({ categories, className }: Props) => {
  const { search, setSearch, category, setCategory } = useArticleFilter();
  const handleReset = () => {
    setSearch("");
    setCategory("");
  };
  return (
    <div className={cn("w-full flex flex-row gap-4", className)}>
      <Input
        placeholder="Cari artikel"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select value={category} onValueChange={(value) => setCategory(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih kategori" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category}
              value={category}
              onClick={() => setCategory(category)}
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
};
