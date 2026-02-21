import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from "nodemailer";
import prisma from "./prisma";
import { isAdmin } from "./helpers";

// Check if real SMTP credentials are configured
const hasSmtpConfig = Boolean(
  process.env.EMAIL_SERVER_HOST &&
    process.env.EMAIL_SERVER_PORT &&
    process.env.EMAIL_SERVER_USER &&
    process.env.EMAIL_SERVER_PASSWORD
);

/**
 * Custom email sender with Ethereal fallback for development.
 *
 * - If EMAIL_SERVER_* env vars are set: uses real SMTP.
 * - If missing AND NODE_ENV=development: creates an Ethereal test account
 *   and logs the preview URL to the console.
 * - In production with missing env vars: throws an error.
 */
async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  expires: Date;
  provider: { server: any; from: string };
  token: string;
  theme: any;
}) {
  const isDev = process.env.NODE_ENV === "development";
  let transporter: nodemailer.Transporter;

  if (hasSmtpConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  } else if (isDev) {
    // Dev fallback: auto-create an Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    throw new Error(
      "Email server not configured. Set EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD."
    );
  }

  const result = await transporter.sendMail({
    to: email,
    from: provider.from,
    subject: "Sign in to 3DMates",
    text: `Sign in to 3DMates\n\n${url}\n`,
    html: `
      <div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif;">
        <h2 style="color:#0FB6C8;">3DMates</h2>
        <p>Click the button below to sign in:</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:#0FB6C8;color:#000;text-decoration:none;border-radius:6px;font-weight:600;">
          Sign in to 3DMates
        </a>
        <p style="color:#888;font-size:14px;margin-top:24px;">
          If you didn&apos;t request this email, you can safely ignore it.
        </p>
      </div>
    `,
  });

  // In dev with Ethereal, log the preview URL so you can click the magic link
  if (isDev && !hasSmtpConfig) {
    const previewUrl = nodemailer.getTestMessageUrl(result);
    console.log("\n" + "=".repeat(60));
    console.log("  MAGIC LINK EMAIL (Ethereal dev fallback)");
    console.log("  Preview URL: " + previewUrl);
    console.log("=".repeat(60) + "\n");
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // server config is required by the type but our custom sendVerificationRequest
      // handles transport creation, so these are placeholders when SMTP is unconfigured.
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.ethereal.email",
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "3DMates <noreply@3dmates.com>",
      sendVerificationRequest,
    }),
    // Only include Google if credentials are present (production).
    // Locally, email magic link is the primary auth method.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "CUSTOMER";
        session.user.hasOnboarded = (user as any).hasOnboarded ?? false;
        session.user.isAdmin = isAdmin(user.email);
      }
      return session;
    },
  },
};
