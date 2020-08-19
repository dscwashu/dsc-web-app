import * as firebase from "@firebase/testing";
import * as fs from "fs";

const projectId = `test-security-rules`;

firebase.loadFirestoreRules({
  projectId,
  rules: fs.readFileSync("firestore/firestore.rules", "utf8"),
});

export interface Auth {
  uid: string;
  email: string;
  email_verified?: boolean;
}

export const getFirestoreInstance = (
  auth?: Auth
): firebase.firestore.Firestore => {
  const app = firebase.initializeTestApp({
    projectId,
    auth,
  });
  return app.firestore();
};

export const seedData = (data?: Record<string, any>): Promise<any[]> => {
  const adminApp = firebase.initializeAdminApp({
    projectId,
  });
  const adminDb = adminApp.firestore();
  const dataArray: Promise<any>[] = [];
  if (data) {
    for (const key in data) {
      dataArray.push(adminDb.doc(key).set(data[key]));
    }
  }
  return Promise.all(dataArray);
};

export const clearFirestore = (): Promise<void> => {
  return firebase.clearFirestoreData({
    projectId,
  });
};

export const clearApps = (): Promise<any[]> => {
  return Promise.all(firebase.apps().map((app) => app.delete()));
};

export default firebase;
