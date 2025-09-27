"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface TagsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Normalizer opsional: mis. (t) => t.toLowerCase().trim() */
  normalize?: (tag: string) => string;
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Ketik tag lalu Enter…",
  disabled,
  className,
  normalize = (t) =>
    t
      .trim()
      .replace(/\s+/g, "-") // spasi → dash
      .replace(/^#/, "") // buang leading '#'
      .toLowerCase(),
}: TagsInputProps) {
  const [input, setInput] = React.useState("");
  const [messageError, setMessageError] = React.useState("");

  const addTag = (raw: string) => {
    const tag = normalize(raw);
    if (!tag) {
      setMessageError("Tag tidak boleh kosong");
      return;
    }

    if (value.includes(tag)) {
      setMessageError(`Tag ${tag} sudah ada`);
      return;
    }
    onChange([...value, tag]);
    setInput("");
    setMessageError("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const addMany = (text: string) => {
    const parts = text
      .split(/[,\n]/g)
      .map((p) => normalize(p))
      .filter(Boolean);
    if (parts.length === 0) return;
    const set = new Set(value);
    for (const p of parts) {
      set.add(p);
    }
    onChange(Array.from(set));
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Enter, Comma, Tab -> add
    if (
      (e.key === "Enter" || e.key === "," || e.key === "Tab") &&
      input.trim() !== ""
    ) {
      e.preventDefault();
      addTag(input);
      return;
    }

    // Backspace di input kosong -> remove last
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      e.preventDefault();
      removeTag(value[value.length - 1]);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (text && /,|\n/.test(text)) {
      e.preventDefault();
      addMany(text);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border bg-background px-2 py-2",
        disabled && "opacity-60",
        className
      )}
    >
      {/* chips */}
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1 rounded-full"
        >
          #{tag}
          <button
            type="button"
            aria-label={`Hapus ${tag}`}
            className="rounded-full p-0.5 hover:bg-muted"
            onClick={() => removeTag(tag)}
            disabled={disabled}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}

      {/* input */}
      <Input
        value={input}
        onChange={(e) => {
          setMessageError("");
          setInput(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        disabled={disabled}
        placeholder={value.length === 0 ? placeholder : ""}
      />

      {/* tombol tambah manual (opsional) */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8"
        onClick={() => input.trim() && addTag(input)}
        disabled={disabled || input.trim() === ""}
      >
        <Plus className="mr-1 h-4 w-4" /> Tambah
      </Button>

      {messageError && <p className="text-sm text-red-500">{messageError}</p>}
    </div>
  );
}
