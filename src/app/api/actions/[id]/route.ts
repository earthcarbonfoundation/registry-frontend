import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
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
    const { id } = params;

    const docRef = adminDb.collection("carbon_registry_actions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    if (doc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: Timestamp.now(),
    };

    // Remove protected fields from update if accidentally sent
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.id;

    await docRef.update(updateData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API PUT Action Error:", error);
    const message = error.message.includes("Firebase Admin not initialized")
      ? "Server Misconfiguration: Missing Firebase Credentials"
      : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
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
    const { id } = params;

    const docRef = adminDb.collection("carbon_registry_actions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    if (doc.data()?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API DELETE Action Error:", error);
    const message = error.message.includes("Firebase Admin not initialized")
      ? "Server Misconfiguration: Missing Firebase Credentials"
      : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
