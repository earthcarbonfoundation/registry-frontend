import { NextResponse, NextRequest } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import { verifyAuthHeader, handleApiError } from "@/lib/apiAuth";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthHeader(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const adminDb = getAdminDb();
    const userId = authResult.userId;

    const snapshot = await adminDb
      .collection("carbon_registry_actions")
      .where("userId", "==", userId)
      .get();

    const actions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to milliseconds (safest for JSON serialization)
        createdAt: data.createdAt?.toMillis?.() || 0,
        updatedAt: data.updatedAt?.toMillis?.() || null,
      };
    });

    // Sort by createdAt descending (newest first)
    actions.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ actions });
  } catch (error: any) {
    return handleApiError(error, "GET /api/actions");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthHeader(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const adminDb = getAdminDb();
    const userId = authResult.userId;
    const userEmail = authResult.userEmail;

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["actionType", "quantity", "unit", "address"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate data types
    if (typeof body.quantity !== "number" || body.quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 },
      );
    }

    const newAction = {
      actionType: String(body.actionType).trim(),
      quantity: Number(body.quantity),
      unit: String(body.unit).trim(),
      address: String(body.address).trim(),
      lat: body.lat ? Number(body.lat) : null,
      lng: body.lng ? Number(body.lng) : null,
      userId,
      userEmail,
      createdAt: Timestamp.now(),
    };

    const docRef = await adminDb
      .collection("carbon_registry_actions")
      .add(newAction);

    return NextResponse.json({
      id: docRef.id,
      ...newAction,
      createdAt: newAction.createdAt.toMillis(),
    });
  } catch (error: any) {
    return handleApiError(error, "POST /api/actions");
  }
}
