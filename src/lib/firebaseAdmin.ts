import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      // Parse the JSON string
      const serviceAccount = JSON.parse(serviceAccountKey);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Fallback to individual variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      console.warn(
        "Firebase Admin not initialized. Missing FIREBASE_SERVICE_ACCOUNT_KEY or individual vars.",
      );
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

// Export getters or null-safe instances to avoid hard crash on import
export const getAdminDb = () => {
  if (!admin.apps.length) {
    throw new Error("Firebase Admin not initialized. Check server logs for missing credentials.");
  }
  return admin.firestore();
};

export const getAdminAuth = () => {
    if (!admin.apps.length) {
      throw new Error("Firebase Admin not initialized. Check server logs for missing credentials.");
    }
    return admin.auth();
};
// Optional: Keep these for backward compat if you want, but they risk crashing if accessed immediately.
// Better to force usage of getters or check apps.length in routes.

