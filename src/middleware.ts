import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware that protects routes requiring authentication.
 * Checks for the NextAuth session cookie and redirects
 * unauthenticated visitors to /auth/signin with a callbackUrl.
 */
export function middleware(request: NextRequest) {
  // Check for session cookie (NextAuth database sessions)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Only run middleware on these protected routes
export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/provider/:path*",
    "/onboarding/:path*",
  ],
};
