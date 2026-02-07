import { NextResponse, NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

/**
 * Verify and extract the Firebase user ID from the Authorization header
 * Returns { userId, userEmail } or throws an error
 */
export async function verifyAuthHeader(request: NextRequest | Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const adminAuth = getAdminAuth();
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    return {
      userId: decodedToken.uid,
      userEmail: decodedToken.email,
      error: null,
      status: null,
    };
  } catch (error: any) {
    console.error("Token verification error:", error);
    return { error: "Invalid token", status: 401 };
  }
}

/**
 * Generic error response handler for API routes
 */
export function handleApiError(error: any, context: string = "API") {
  console.error(`${context} Error:`, error);

  if (error.message?.includes("Firebase Admin not initialized")) {
    return NextResponse.json(
      {
        error: "Server Misconfiguration: Missing Firebase Credentials",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { error: error.message || "Internal Server Error" },
    { status: 500 },
  );
}
