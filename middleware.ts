import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle route protection based on session cookies
 *
 * Session cookie is created by AuthContext when user logs in via Firebase.
 * Cookie contains uid and email, validated before trusting it.
 * Actual auth verification also happens client-side via Firebase SDK.
 *
 * Protected routes (require session cookie):
 * - /profile (private user profile)
 *
 * Auth routes (redirect if already authenticated):
 * - /signin (sign in page)
 *
 * Public routes:
 * - / (home)
 * - /about, /how-it-works, /impact, /pricing
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session cookie
  const sessionCookie = request.cookies.get("session")?.value;

  // Validate session cookie format
  let isValidSession = false;
  if (sessionCookie) {
    try {
      const data = JSON.parse(decodeURIComponent(sessionCookie));
      // Validate cookie has required fields
      if (data.uid && data.email) {
        isValidSession = true;
      } else {
        console.warn(
          "[Middleware] Invalid cookie structure - missing uid or email",
        );
      }
    } catch (error) {
      console.warn("[Middleware] Failed to parse session cookie:", error);
    }
  }

  // Protected routes (require authentication)
  const protectedRoutes = ["/profile"];

  // Auth routes (only for unauthenticated users)
  const authRoutes = ["/signin"];

  // If accessing a protected route
  if (protectedRoutes.includes(pathname)) {
    if (!isValidSession) {
      // No valid session cookie, redirect to signin
      console.warn(`[Middleware] Unauthorized access attempt to ${pathname}`);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    // Has valid session cookie, allow access (component will verify Firebase auth)
    return NextResponse.next();
  }

  // If accessing auth routes
  if (authRoutes.includes(pathname)) {
    // Allow access to signin page regardless of session
    // Component will verify Firebase auth and redirect to /profile if authenticated
    // This prevents redirect loops between /signin and /profile
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
