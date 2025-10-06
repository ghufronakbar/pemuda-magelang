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
import { useFilter } from "./filter-context";
import { Button } from "../ui/button";

interface Props {
  categories: string[];
  className?: string;
  placeholder?: string;
  hideReset?: boolean;
}

export const Filter = ({
  categories,
  className,
  placeholder = "Cari artikel...",
  hideReset = false,
}: Props) => {
  const { search, setSearch, category, setCategory } = useFilter();
  const handleReset = () => {
    setSearch("");
    setCategory("");
  };
  return (
    <div className={cn("w-full flex flex-row gap-4", className)}>
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        value={category === "" ? "all" : category}
        onValueChange={(value) => setCategory(value === "all" ? "" : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="__all__" value="all">
            Semua
          </SelectItem>
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
      {!hideReset && (
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      )}
    </div>
  );
};
