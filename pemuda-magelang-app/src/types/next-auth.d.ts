import { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

/**
 * Di v5, augment JWT yang dipakai ada di @auth/core/jwt
 * (bukan lagi next-auth/jwt).
 */
declare module "@auth/core/jwt" {
  interface JWT {
    role?: Role;
  }
}
