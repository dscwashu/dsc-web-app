import firebase from "../util/firebaseHelpers";

export const mockNewApplication = {
  info: {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    user: "testUser",
    type: "coreTeam",
    project: "",
    answers: ["Answer 1", "Answer 2", "Answer 3"],
  },
  accepted: false,
  pending: true,
};
