// lib/turnstile.ts

type TurnstileVerifyResp = {
  success: boolean;
  ["error-codes"]?: string[];
  action?: string;
  cdata?: string;
};

export async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not set");

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    }
  );

  const data = (await res.json()) as TurnstileVerifyResp;
  return data;
}

export function getClientIpFromHeaders(h: Headers) {
  // Urutan prioritas IP yang umum di proxy/CDN
  return (
    h.get("CF-Connecting-IP") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null
  );
}
