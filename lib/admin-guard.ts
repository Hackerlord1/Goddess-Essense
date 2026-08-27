// lib/admin-guard.ts

import { getServerSession, type Session } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

type AdminGuardResult =
  | { ok: true; session: Session; email: string }
  | { ok: false; response: NextResponse };

/**
 * Guard for admin-only API routes.
 *
 * Reads the role straight from the NextAuth JWT session (populated in
 * `lib/auth.ts`), so it costs no database query — unlike the old per-route
 * `checkAdmin()` helpers that hit `prisma.user.findUnique` on every request.
 *
 * Usage:
 *   const guard = await requireAdmin();
 *   if (!guard.ok) return guard.response;
 *   // ...guard.session is available and typed
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session, email: session.user.email };
}
