// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // 1) SESSION COOKIE (sliding/idle)
  //    - maxAge: masa berlaku cookie (detik)
  //    - updateAge: seberapa sering cookie diperpanjang saat user aktif
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    updateAge: 60 * 60 * 12, // perpanjang cookie tiap 12 jam saat aktif
  },
  // 2) JWT EXPIRY (server-side, absolute)
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,

  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        redirectTo: { type: "string" },
      },
      authorize: async (credentials) => {
        const parsed = CredentialsSchema.safeParse(credentials ?? {});
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profilePicture ?? null,
          role: user.role as Role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) token.role = user.role;

      // OPTIONAL: hard-expiry manual (tak tergantung sliding cookie)
      // Misal: wajib login ulang setelah 7 hari, meskipun user aktif terus.
      // Simpan timestamp hardExp saat sign in:
      if (user && !("hardExp" in token)) {
        token.hardExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 hari
      }
      // Di setiap request, jika sudah lewat hardExp → kosongkan token (session jadi null)
      if (token.hardExp && Date.now() / 1000 > (token.hardExp as number)) {
        return {} 
      }

      // support update() dari client untuk refresh name/image
      if (trigger === "update" && session) {
        if (session?.name) token.name = session.name;
        if (typeof session?.image !== "undefined")
          token.picture = session.image 
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },

    // Proteksi route (redirect ke /login saat session null/expired)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");
      if (isProtected && !isLoggedIn) {
        const url = new URL("/login", nextUrl);
        url.searchParams.set("callbackUrl", nextUrl.href);
        return Response.redirect(url); // App Router (NextAuth v5)
      }
      return true;
    },
  },
});
