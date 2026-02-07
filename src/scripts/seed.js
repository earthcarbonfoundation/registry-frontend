import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function runSeed() {
  try {
    const projRefs = await addDoc(collection(db, "projects"), {
      name: "Solar Project Alpha",
      ownership: "private",
      baseline_type: "grid",
      commissioning_date: "2024-01-01",
      scale_flag: "standalone",
      eligibility_flag: "conditional",
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    const ProjectId = projRefs.id;

    await addDoc(collection(db, "actions"), {
      project_id: ProjectId,
      action_type: "project_owner",
      action_date: Timestamp.now(),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    await addDoc(collection(db, "contributors"), {
      project_id: ProjectId,
      name: "Green Energy Inc.",
      role: "implementer",
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    await addDoc(collection(db, "impact_logs"), {
      project_id: ProjectId,
      tco2e: 1000,
      note: "This is a test impact log",
      logged_at: Timestamp.now(),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    await addDoc(collection(db, "eligibility_status"), {
      project_id: ProjectId,
      status: "eligible",
      reason: "This project is eligible for carbon credits",
      evaluation_date: Timestamp.now(),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return {
      success: true,
      message: "Seed completed successfully",
      result: { ProjectId },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error seeding database",
      error: error.message,
    };
  }
}
