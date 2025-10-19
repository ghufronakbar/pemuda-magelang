"use server";

import { headers } from "next/headers";

export async function getIp(): Promise<string> {
  try {
    const h = await headers();

    // urutan prioritas: X-Real-IP (dari Nginx real_ip), CF, XFF
    const xReal = h.get("x-real-ip");
    if (xReal) return normalizeIp(xReal);

    const cf = h.get("cf-connecting-ip");
    if (cf) return normalizeIp(cf);

    const xff = h.get("x-forwarded-for");
    if (xff) {
      const ip = xff.split(",")[0].trim();
      if (ip) return normalizeIp(ip);
    }

    const fwd = h.get("forwarded"); // RFC 7239: for=1.2.3.4
    if (fwd) {
      const m = fwd.match(/for="?(\[.*?\]|[^;," ]+)/i);
      if (m?.[1]) return normalizeIp(m[1].replace(/^\[|\]$/g, ""));
    }

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

function normalizeIp(ip: string) {
  // ubah ::ffff:1.2.3.4 → 1.2.3.4
  const m = ip.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
  return m ? m[1] : ip;
}
