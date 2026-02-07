import { NextRequest, NextResponse } from "next/server";
import { evaluateEligibility } from "../../../../lib/eligibility";
import { db } from "../../../../lib/firebaseConfig";
import { collection, addDoc, doc, Timestamp, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const projectData = projectDoc.data();
    const result = evaluateEligibility(projectData);

    await addDoc(collection(db, "eligibility_status"), {
      project_id: projectId,
      status: result.status,
      reason: result.reason,
      evaluation_date: Timestamp.now(),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return NextResponse.json(
      { success: true, message: "Eligibility evaluated successfully", result },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error evaluating eligibility",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
