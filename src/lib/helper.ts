import { SocialMediaPlatformEnum } from "@prisma/client";

export const getInitials = (name: string) => {
  const p = name.trim().split(/\s+/);
  const a = p[0]?.[0] ?? "";
  const b = p.length > 1 ? p[p.length - 1][0] ?? "" : "";
  return (a + b).toUpperCase();
};

export const formatIDR = (value: number) => {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Rp ${Math.round(value).toLocaleString("id-ID")}`;
  }
};

export const normalizeSocialUrl = (
  platform: SocialMediaPlatformEnum,
  raw: string
) => {
  const url = (raw || "").trim();
  const hasScheme =
    /^([a-z][a-z0-9+\-.]*:)?\/\//i.test(url) ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:");

  if (hasScheme) return url;

  switch (platform) {
    case SocialMediaPlatformEnum.email:
      return `mailto:${url}`;
    case SocialMediaPlatformEnum.phone:
      return `tel:${url.replace(/\s+/g, "")}`;
    case SocialMediaPlatformEnum.whatsapp: {
      const digits = url.replace(/[^\d+]/g, "");
      return `https://wa.me/${digits.replace(/^\+/, "")}`;
    }
    case SocialMediaPlatformEnum.address:
      return `https://maps.google.com/?q=${encodeURIComponent(url)}`;
    case SocialMediaPlatformEnum.instagram:
      return `https://instagram.com/${stripAt(url)}`;
    case SocialMediaPlatformEnum.twitter:
      return `https://x.com/${stripAt(url)}`;
    case SocialMediaPlatformEnum.facebook:
      return `https://facebook.com/${stripAt(url)}`;
    case SocialMediaPlatformEnum.youtube:
      return `https://youtube.com/${url}`;
    case SocialMediaPlatformEnum.linkedin:
      return `https://www.linkedin.com/in/${stripAt(url)}`;
    case SocialMediaPlatformEnum.tiktok:
      return `https://www.tiktok.com/@${stripAt(url)}`;
    case SocialMediaPlatformEnum.website:
    case SocialMediaPlatformEnum.other:
    default:
      return `https://${url}`;
  }
};

const stripAt = (s: string) => {
  return s.replace(/^@/, "");
}

export const generateSlug = (title: string) => {
  const date = new Date().toISOString().split("T")[0];
  return `${title.toLowerCase().replace(/ /g, "-")}-${date}`;
};

export const formatIDDate = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  try {
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d);
  }
};
