import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const deleteProfile = functions.auth.user().onDelete((user) => {
  const { uid } = user;
  return db.collection("users").doc(uid).delete();
});

// Create method to get resume if valid project manager
