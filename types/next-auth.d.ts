// types/next-auth.d.ts

import type { DefaultSession } from "next-auth";

type UserRole = "CUSTOMER" | "ADMIN";

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }
}
