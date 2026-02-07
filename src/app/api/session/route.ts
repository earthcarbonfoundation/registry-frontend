import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { handleApiError } from "@/lib/apiAuth";

/**
 * POST /api/session
 * Creates a secure, HttpOnly session cookie from a Firebase ID token.
 * This should only be called after client-side authentication succeeds.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const auth = getAdminAuth();

    // Session expiry: 5 days (in milliseconds)
    const expiresIn = 5 * 24 * 60 * 60 * 1000;

    try {
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn,
      });

      const res = NextResponse.json({ success: true });

      // Set secure HttpOnly cookie
      // secure: true enforces HTTPS in production
      // sameSite: 'lax' provides CSRF protection
      res.cookies.set({
        name: "session",
        value: sessionCookie,
        httpOnly: true,
        maxAge: expiresIn / 1000, // Convert ms to seconds
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return res;
    } catch (tokenError: any) {
      console.error("Session cookie creation error:", tokenError);
      if (tokenError.code === "auth/argument-error") {
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 400 },
        );
      }
      throw tokenError;
    }
  } catch (error: any) {
    return handleApiError(error, "POST /api/session");
  }
}

/**
 * DELETE /api/session
 * Clears the session cookie (server-side session termination).
 * Called on logout.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true });

  // Clear the secure session cookie by setting maxAge to 0
  res.cookies.set({
    name: "session",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
