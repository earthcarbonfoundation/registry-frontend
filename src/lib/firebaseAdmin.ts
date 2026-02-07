import * as admin from "firebase-admin";

/**
 * Initialize Firebase Admin SDK with service account credentials
 * Credentials should be provided via environment variable FIREBASE_SERVICE_ACCOUNT_KEY
 */
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set",
      );
    }

    // Parse the JSON string
    const serviceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // Don't throw here - let the getAdminDb/getAdminAuth functions handle it
  }
}

/**
 * Get Firebase Admin Firestore instance
 * @throws Error if Firebase Admin is not initialized
 */
export const getAdminDb = () => {
  if (!admin.apps.length) {
    throw new Error(
      "Firebase Admin not initialized. Check server logs for missing credentials.",
    );
  }
  return admin.firestore();
};

/**
 * Get Firebase Admin Auth instance
 * @throws Error if Firebase Admin is not initialized
 */
export const getAdminAuth = () => {
  if (!admin.apps.length) {
    throw new Error(
      "Firebase Admin not initialized. Check server logs for missing credentials.",
    );
  }
  return admin.auth();
};
