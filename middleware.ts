// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Admin area requires an ADMIN role; everyone else goes home.
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      // Match lib/auth.ts so unauthenticated users land on the sign-in form.
      signIn: "/account",
    },
    callbacks: {
      // Any valid session token is enough to pass; role is checked above.
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // `/account` itself stays public (it renders the sign-in / register form).
  // Protect only the authenticated sub-pages and the whole admin area.
  matcher: ["/account/:path+", "/admin", "/admin/:path*"],
};
