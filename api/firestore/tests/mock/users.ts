import firebase from "../util/firebaseHelpers";

export const mockNewUser = {
  account: {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    email: "testUser@gmail.com",
  },
  profile: {},
  isAdmin: false,
};

export const mockOrgUserProfile = {
  firstName: "Zach",
  lastName: "Young",
  role: "org",
  grade: 0,
  website: "www.google.com",
  bio: "I like food",
  skills: [],
  courses: [],
  isFinishedProfile: true,
};

export const mockStudentUserProfile = {
  firstName: "Zach",
  lastName: "Young",
  role: "student",
  grade: 1,
  website: "www.google.com",
  bio: "I like food",
  skills: ["React.js"],
  courses: ["CSE 330"],
  isFinishedProfile: true,
};
