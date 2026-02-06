import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const snapshot = await adminDb
      .collection("carbon_registry_actions")
      .where("userId", "==", userId)
      .get();

    const actions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to simple object or string if needed
      // but client usually handles it. sending raw milliseconds is safest for JSON
      createdAt: doc.data().createdAt?.toMillis() || 0,
    }));
    
    // Sort descending
    actions.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ actions });
  } catch (error: any) {
    console.error("API GET Actions Error:", error);
    const message = error.message.includes("Firebase Admin not initialized") 
        ? "Server Misconfiguration: Missing Firebase Credentials" 
        : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    const body = await request.json();
    
    // Validate body...
    if (!body.actionType || !body.quantity || !body.unit || !body.address) {
         return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newAction = {
      ...body,
      userId,
      userEmail,
      createdAt: Timestamp.now(), // Use server-side timestamp
    };

    const docRef = await adminDb.collection("carbon_registry_actions").add(newAction);

    return NextResponse.json({ id: docRef.id, ...newAction });
  } catch (error: any) {
    console.error("API POST Action Error:", error);
    const message = error.message.includes("Firebase Admin not initialized") 
        ? "Server Misconfiguration: Missing Firebase Credentials" 
        : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
