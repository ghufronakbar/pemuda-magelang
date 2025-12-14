// src/components/custom/cdn-image.tsx
import Image, { ImageProps } from "next/image";
import { forwardRef } from "react";
import { NEXT_PUBLIC_IMAGE_PREFIX } from "@/constants/s3";

export function cdnUrl(key: string): string {
  if (!key) return ""
  if (key.startsWith("http")) return key
  if (key.includes("static")) return key
  return `${NEXT_PUBLIC_IMAGE_PREFIX}${key}`;
}


type Props = Omit<ImageProps, "src"> & { uniqueKey: string };

export const CdnImage = forwardRef<HTMLImageElement, Props>(
  ({ uniqueKey, alt, ...rest }, ref) => {
    const src = cdnUrl(uniqueKey);
    // return <div className="w-full h-full">
    //   <Image ref={ref} src={src} alt={alt ?? ""} {...rest} unoptimized />
    //   <span>{src}</span>
    // </div>
    return <Image ref={ref} src={src} alt={alt ?? ""} {...rest} unoptimized />;
  }
);
CdnImage.displayName = "CdnImage";
