import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle route protection and authentication
 *
 * Protected routes (require session):
 * - /profile (private user profile)
 *
 * Auth routes (public, redirect if authenticated):
 * - /signin (sign in page)
 *
 * Public routes:
 * - / (home)
 * - /about, /how-it-works, /impact, /pricing
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user has a server-managed session cookie
  const sessionCookie = request.cookies.get("session")?.value;

  // Protected routes (require authentication)
  const protectedRoutes = ["/profile"];

  // Auth routes (only for unauthenticated users)
  const authRoutes = ["/signin"];

  // If accessing a protected route
  if (protectedRoutes.includes(pathname)) {
    if (!sessionCookie) {
      // No session cookie, redirect to home
      console.warn(`[Middleware] Unauthorized access attempt to ${pathname}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Has session cookie, allow access
    return NextResponse.next();
  }

  // If accessing auth routes
  if (authRoutes.includes(pathname)) {
    if (sessionCookie) {
      // Already authenticated, redirect to profile
      console.info(
        `[Middleware] Authenticated user redirected from ${pathname} to /profile`,
      );
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    // Not authenticated, allow access to signin
    return NextResponse.next();
  }

  // For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder and files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
};
