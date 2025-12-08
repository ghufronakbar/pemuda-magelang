import nodemailer from "nodemailer";
import {
  NODEMAILER_PORT,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  NODEMAILER_SERVICE,
} from "@/constants/nodemailer";

const mailer = nodemailer.createTransport({
  service: NODEMAILER_SERVICE || undefined,
  port: Number(NODEMAILER_PORT) || 465,
  secure: Number(NODEMAILER_PORT) === 465,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASSWORD,
  },
});

mailer.verify((error) => {
  if (error) {
    console.error("Mailer verification failed:", error);
  } else {
    console.log("Mailer verification passed");
  }
});

export { mailer };
