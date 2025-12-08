"use server";
import { mailer } from "@/lib/mailer";
import { db } from "@/lib/db";
import { JWT_RESET_PASSWORD_SECRET } from "@/constants/nodemailer";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { BASE_URL, APP_NAME } from "@/constants";
import bcrypt from "bcryptjs";
import { getAppData } from "@/actions/app-data";
import { cdnUrlWithBaseUrl } from "@/components/custom/cdn-image";

// --- Helper: build safe URL path ---
const resetPasswordLink = (token: string) =>
  `${BASE_URL.replace(/\/$/, "")}/reset-password/${token}`;

const getLogoEmail = async () => {
  try {
    const appData = await getAppData();
    return (
      cdnUrlWithBaseUrl(appData.baseLogo) ||
      "https://pemuda.magelangkota.go.id/favicon.ico"
    );
  } catch (error) {
    console.error(error);
    return "https://pemuda.magelangkota.go.id/favicon.ico";
  }
};

// Warna aman untuk email (hex)
const colorEmail = {
  primary: "#1BD0AC",
  background: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  mutedText: "#6B7280",
  buttonText: "#FFFFFF",
};

// Zod untuk payload token
const ResetPasswordDecodedSchema = z.object({
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});
type ResetPasswordDecodedSchemaType = z.infer<
  typeof ResetPasswordDecodedSchema
>;

// === Email template ===
function buildResetEmail({
  firstName,
  url,
  logo,
}: {
  firstName: string;
  url: string;
  logo: string;
}) {
  const preheader = `Tautan reset password ${APP_NAME} berlaku selama 10 menit.`;
  const subject = `Reset Password ${APP_NAME}`;

  const text = [
    `Halo ${firstName},`,
    ``,
    `Kami menerima permintaan untuk mengatur ulang password akun ${APP_NAME}.`,
    `Klik tautan di bawah ini untuk melanjutkan (berlaku 10 menit):`,
    url,
    ``,
    `Jika kamu tidak meminta reset password, abaikan email ini.`,
    ``,
    `${APP_NAME}`,
    BASE_URL,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charSet="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
    <meta name="x-preheader" content="${preheader}" />
    <style>
      /* Hide preheader */
      .preheader { display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; }
      a { text-decoration: none; }
    </style>
  </head>
  <body style="margin:0; padding:0; background:${colorEmail.background};">
    <span class="preheader">${preheader}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${colorEmail.background};">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%; max-width:600px; border:1px solid ${colorEmail.border}; border-radius:12px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding:24px;">
                <img src="${logo}" alt="${APP_NAME}" width="40" height="40" style="border-radius:8px; display:block;" />
                <div style="font:600 18px/1.4 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.text}; margin-top:8px;">${APP_NAME}</div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 8px 0; font:700 22px/1.3 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.text};">
                  Reset Password Akun ${APP_NAME}
                </h1>
                <p style="margin:0 0 16px 0; font:400 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.text};">
                  Halo ${firstName},
                </p>
                <p style="margin:0 0 16px 0; font:400 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.text};">
                  Kami menerima permintaan untuk mengatur ulang password akunmu. Klik tombol di bawah untuk melanjutkan. Tautan ini <b>berlaku selama 10 menit</b>.
                </p>

                <!-- Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                  <tr>
                    <td align="center" bgcolor="${colorEmail.primary}" style="border-radius:10px;">
                    <div style="width: 100%; text-align: center; display: flex; justify-content: center; align-items: center;">
                      <a href="${url}" style="display:inline-block; padding:12px 20px; font:600 14px/1 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; text-decoration: none; color:${colorEmail.buttonText};">
                        Atur Ulang Password
                      </a>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Fallback link -->
                <p style="margin:0 0 16px 0; font:400 12px/1.6 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.mutedText};">
                  Jika tombol tidak berfungsi, salin dan tempel URL berikut ke browser kamu:
                  <br />
                  <a href="${url}" style="color:${colorEmail.text}; word-break:break-all;">${url}</a>
                </p>

                <p style="margin:16px 0 0 0; font:400 12px/1.6 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.mutedText};">
                  Jika kamu tidak meminta reset password, abaikan email ini.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:16px 24px 24px 24px; border-top:1px solid ${colorEmail.border};">
                <p style="margin:0; font:400 12px/1.6 system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:${colorEmail.mutedText};">
                  ${APP_NAME} &middot; <a href="${BASE_URL}" style="color:${colorEmail.mutedText};">${BASE_URL}</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

export const sendEmailForgotPassword = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        resetPasswordToken: { select: { id: true, token: true } },
      },
    });

    if (!user) {
      return { ok: false, error: "Email tidak ditemukan" };
    }

    const now = Math.floor(Date.now() / 1000);

    // --- Rate limit 1 menit berdasarkan iat token lama (valid/tidak) ---
    if (user.resetPasswordToken?.token) {
      try {
        // tetap verifikasi signature tapi abaikan expiry untuk baca iat
        const decoded = jwt.verify(
          user.resetPasswordToken.token,
          JWT_RESET_PASSWORD_SECRET,
          { ignoreExpiration: true }
        );
        const parsed = ResetPasswordDecodedSchema.safeParse(decoded);
        if (parsed.success) {
          const lastIat = parsed.data.iat; // detik (unix)
          if (now - lastIat < 60) {
            return {
              ok: false,
              error: "Harap tunggu 1 menit sebelum mengirim email kembali",
            };
          }
        }
      } catch {
        // jika verifikasi gagal (signature tak valid), lanjut kirim token baru
      }
    }

    // --- Terbitkan token baru, kadaluarsa 10 menit ---
    const resetPasswordToken = jwt.sign({ email }, JWT_RESET_PASSWORD_SECRET, {
      expiresIn: "10m",
    });

    // Simpan/rotasi token di DB
    if (user.resetPasswordToken) {
      await db.resetPasswordToken.update({
        where: { id: user.resetPasswordToken.id },
        data: { token: resetPasswordToken, used: false },
      });
    } else {
      await db.resetPasswordToken.create({
        data: { userId: user.id, token: resetPasswordToken, used: false },
      });
    }

    const url = resetPasswordLink(resetPasswordToken);
    const firstName = (user.name ?? "").trim().split(/\s+/)[0] || "Pengguna";
    const logo = await getLogoEmail();

    const { subject, text, html } = buildResetEmail({ firstName, url, logo });

    await mailer.sendMail({
      from: `${APP_NAME}`,
      to: email,
      subject,
      text, // plain text fallback
      html,
      headers: { "X-Entity-UserId": String(user.id) },
    });

    return { ok: true, error: null };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Terjadi kesalahan" };
  }
};

interface ValidateResetPasswordTokenReturn {
  ok: boolean;
  error: string | null;
  email: string | null;
  name: string | null;
}

export const validateResetPasswordToken = async (
  token: string
): Promise<ValidateResetPasswordTokenReturn> => {
  try {
    // 1) Verifikasi tanda tangan & masa berlaku
    const decoded = jwt.verify(token, JWT_RESET_PASSWORD_SECRET);
    const parsed = ResetPasswordDecodedSchema.safeParse(decoded);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Link reset password tidak valid",
        email: null,
        name: null,
      };
    }

    const email = parsed.data.email;

    // 2) Ambil user + token yang tersimpan di DB
    const user = await db.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        resetPasswordToken: {
          select: { token: true, used: true },
        },
      },
    });

    if (!user || !user.resetPasswordToken) {
      return {
        ok: false,
        error: "Link reset password tidak valid",
        email: null,
        name: null,
      };
    }

    // 3) Cek apakah token sudah digunakan
    if (user.resetPasswordToken.used) {
      return {
        ok: false,
        error: "Link reset password sudah digunakan",
        email: null,
        name: null,
      };
    }

    // 4) Cek apakah token yang dibawa user adalah token TERBARU milik user
    if (user.resetPasswordToken.token !== token) {
      // Token lama / tidak cocok (mis. user meminta link baru)
      return {
        ok: false,
        error: "Link reset password tidak valid",
        email: null,
        name: null,
      };
    }

    // Lolos semua pengecekan
    return {
      ok: true,
      error: null,
      email: user.email,
      name: user.name,
    };
  } catch (err: unknown) {
    // Bedakan expiry untuk UX yang lebih jelas
    if (err instanceof Error && err.name === "TokenExpiredError") {
      return {
        ok: false,
        error: "Link reset password sudah kedaluwarsa",
        email: null,
        name: null,
      };
    }
    return {
      ok: false,
      error: "Link reset password tidak valid",
      email: null,
      name: null,
    };
  }
};

export const resetPasswordAction = async (
  token: string,
  newPassword: string
) => {
  try {
    const validateResult = await validateResetPasswordToken(token);
    if (!validateResult.ok || !validateResult.email) {
      return { ok: false, error: validateResult.error };
    }
    const { email } = validateResult;
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) {
      return { ok: false, error: "Pengguna tidak ditemukan" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    await db.resetPasswordToken.update({
      where: { token, userId: user.id },
      data: { used: true },
    });
    return { ok: true, error: null };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Terjadi kesalahan" };
  }
};
