"use client";
// src/components/custom/cdn-image.tsx
import Image, { ImageProps } from "next/image";
import { forwardRef } from "react";
import { CDN_URL } from "@/constants";

export function cdnUrl(key: string) {
  if (key.startsWith("http")) return key;
  if (key.startsWith("/static")) return key;
  const base = (CDN_URL || "").replace(/\/+$/, "");
  const rel = key.replace(/^\/+/, "");
  return `${base}/${rel}`;
}

type Props = Omit<ImageProps, "src"> & { uniqueKey: string };

export const CdnImage = forwardRef<HTMLImageElement, Props>(
  ({ uniqueKey, alt, ...rest }, ref) => {
    const src = cdnUrl(uniqueKey);
    return <Image ref={ref} src={src} alt={alt ?? ""} {...rest} unoptimized />;
  }
);
CdnImage.displayName = "CdnImage";
