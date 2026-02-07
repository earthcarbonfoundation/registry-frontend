import { NextResponse, NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { verifyAuthHeader, handleApiError } from "@/lib/apiAuth";
import { Timestamp } from "firebase-admin/firestore";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
    const { id } = params;

    const docRef = adminDb.collection("carbon_registry_actions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    const docData = doc.data();
    if (docData?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate data if present
    if (
      body.quantity !== undefined &&
      (typeof body.quantity !== "number" || body.quantity <= 0)
    ) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 },
      );
    }

    // Only allow certain fields to be updated
    const allowedFields = [
      "actionType",
      "quantity",
      "unit",
      "address",
      "lat",
      "lng",
    ];
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };

    for (const field of allowedFields) {
      if (field in body) {
        if (field === "quantity") {
          updateData[field] = Number(body[field]);
        } else if (["lat", "lng"].includes(field)) {
          updateData[field] = body[field] ? Number(body[field]) : null;
        } else {
          updateData[field] = String(body[field]).trim();
        }
      }
    }

    await docRef.update(updateData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleApiError(error, "PUT /api/actions/[id]");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
    const { id } = params;

    const docRef = adminDb.collection("carbon_registry_actions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    const docData = doc.data();
    if (docData?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleApiError(error, "DELETE /api/actions/[id]");
  }
}
