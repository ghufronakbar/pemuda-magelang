// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
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
      if (trigger === "update" && session) {
        if (session?.name || session?.email || session?.image) {
          token.name = session.name ?? token.name;
          token.picture =
            typeof session.image !== "undefined"
              ? session.image
              : token.picture;
        }
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
    authorized() {
      return true;
    },
  },
});
