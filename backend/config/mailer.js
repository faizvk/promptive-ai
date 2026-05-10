import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} from "./env.js";

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter = null;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  console.warn(
    "[mailer] SMTP not configured — emails will be logged to the console instead of sent. " +
      "Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in .env to enable real delivery."
  );
}

export const sendMail = async ({ to, subject, text, html }) => {
  const payload = { from: SMTP_FROM, to, subject, text, html };

  if (!transporter) {
    console.log("\n──────── [mailer] EMAIL (console transport) ────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text:\n${text}`);
    console.log("────────────────────────────────────────────────────\n");
    return { messageId: "console" };
  }

  return transporter.sendMail(payload);
};

export const isMailerLive = () => isConfigured;
