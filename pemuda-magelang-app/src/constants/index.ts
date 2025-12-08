// src/constants/index.ts
export const LOGO = "/static/logo.svg";
export const APP_NAME = "Pemuda Magelang";
export const PLACEHOLDER_IMAGE = "/static/placeholder.svg";
export const HERO_IMAGE = "/static/hero.svg";

// UPLOAD
export const UPLOAD_ROOT =
  process.env.NEXT_PUBLIC_UPLOAD_ROOT || "public/upload"; // expected "public/upload" (dev) or "/srv/uploads" (prod)
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const CDN_URL = "/upload";


