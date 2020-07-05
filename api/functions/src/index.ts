import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const createProfile = functions.auth.user().onCreate((user) => {
  const { email, uid } = user;
  const domain = email?.split("@")[1];
  if (domain === "wustl.edu") {
    return db
      .collection("users")
      .doc(uid)
      .set({ security: "internal", finishProfile: false })
      .catch((error) => functions.logger.error(error));
  }
  return db
    .collection("users")
    .doc(uid)
    .set({ security: "external", finishProfile: false })
    .catch((error) => functions.logger.error(error));
});

export const finishProfile = functions.https.onCall((data, context) => {
  const uid = context.auth?.uid;
  if (uid) {
    return db
      .collection("users")
      .doc(uid)
      .get()
      .then(() => {
        db.collection("users")
          .doc(uid)
          .update({ finishProfile: true })
          .catch((error) => functions.logger.error(error));
      })
      .catch((error) => functions.logger.error(error));
  }
  return null;
});

export const deleteProfile = functions.auth.user().onDelete((user) => {
  const { uid } = user;
  return db.collection("users").doc(uid).delete();
});
