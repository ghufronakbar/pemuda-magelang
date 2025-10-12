// Reset Password & Mailer
export const JWT_RESET_PASSWORD_SECRET =
  process.env.JWT_RESET_PASSWORD_SECRET || "jwt-reset-password-secret";
export const NODEMAILER_USER =
  process.env.NODEMAILER_USER || "noreply@pemuda.magelangkota.go.id";
export const NODEMAILER_PASSWORD =
  process.env.NODEMAILER_PASSWORD || "SOME_APP_PASSWORD";
export const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE || "gmail";
export const NODEMAILER_PORT = process.env.NODEMAILER_PORT || 587;
export const NODEMAILER_FROM = `${process.env.APP_NAME || "Pemuda Magelang"} <${
  process.env.NODEMAILER_FROM || "noreply@pemuda.magelangkota.go.id"
}>`;
