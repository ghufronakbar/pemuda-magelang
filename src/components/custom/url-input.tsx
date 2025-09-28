"use client";
import { Input } from "../ui/input";

/* ============================
   Helpers
============================ */
function normalizeUrl(s: string) {
  const v = (s ?? "").trim();
  if (!v) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

/** Input URL yang auto-normalize saat blur */

export const UrlInput = ({
  value,
  onChange,
  placeholder,
  id,
  disabled,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
}) => {
  return (
    <Input
      id={id}
      value={value ?? ""}
      placeholder={placeholder ?? "https://…"}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onChange(normalizeUrl(e.target.value))}
      disabled={disabled}
      inputMode="url"
    />
  );
};
