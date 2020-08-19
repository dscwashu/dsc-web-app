import "./util/customMatchers";
import firebase, {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./util/firebaseHelpers";

let db: firebase.firestore.Firestore;

beforeEach(async () => {
  db = getFirestoreInstance({
    uid: "testUser",
    email: "testUser@gmail.com",
  });
});
afterEach(async () => {
  await clearFirestore();
  await clearApps();
});

describe("Get list", () => {
  it("should allow get list from valid user", async () => {
    await expect(db.collection("lists").doc("skills").get()).toAllow();
  });
  it("should deny get list from invalid user", async () => {
    db = getFirestoreInstance();
    await expect(db.collection("lists").doc("skills").get()).toDeny();
  });
});

describe("List list", () => {
  it("should deny list list", async () => {
    await expect(db.collection("lists").get()).toDeny();
  });
});

describe("Create list", () => {
  it("should deny create list", async () => {
    await expect(
      db.collection("lists").doc("skills").set({
        field: "whatever",
      })
    ).toDeny();
  });
});

describe("Update list", () => {
  beforeEach(async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
      "lists/skills": {
        tags: [],
      },
      "lists/courses": {
        tags: [],
      },
      "lists/industries": {
        tags: [],
      },
      "lists/orgQuestions": {
        isAcceptingApplications: false,
        questions: [],
      },
      "lists/coreTeamQuestions": {
        isAcceptingApplications: false,
        questions: [],
      },
      "lists/projectManagerQuestions": {
        questions: [],
      },
    });
  });
  it("should allow update list if valid tag update", async () => {
    await expect(
      db
        .collection("lists")
        .doc("skills")
        .update({
          tags: ["React.js", "Python", "Machine Learning"],
        })
    ).toAllow();
    await expect(
      db
        .collection("lists")
        .doc("courses")
        .update({
          tags: ["CSE 330", "CSE 247", "ESE 326"],
        })
    ).toAllow();
    await expect(
      db
        .collection("lists")
        .doc("industries")
        .update({
          tags: ["Healthcare", "Education", "Sports"],
        })
    ).toAllow();
  });
  it("should allow update list if valid org or core team questions update", async () => {
    await expect(
      db
        .collection("lists")
        .doc("coreTeamQuestions")
        .update({
          isAcceptingApplications: false,
          questions: ["React.js", "Python", "Machine Learning"],
        })
    ).toAllow();
    await expect(
      db
        .collection("lists")
        .doc("orgQuestions")
        .update({
          isAcceptingApplications: false,
          questions: ["React.js", "Python", "Machine Learning"],
        })
    ).toAllow();
    await expect(
      db
        .collection("lists")
        .doc("coreTeamQuestions")
        .update({
          isAcceptingApplications: true,
          questions: ["React.js", "Python", "Machine Learning"],
        })
    ).toAllow();
  });
  it("should allow update list if valid manager questions update", async () => {
    await expect(
      db
        .collection("lists")
        .doc("projectManagerQuestions")
        .update({
          questions: ["Question 1", "Question 2", "Question 3"],
        })
    ).toAllow();
  });
  it("should deny update list with extraneous fields", async () => {
    await expect(
      db
        .collection("lists")
        .doc("skills")
        .update({
          tags: ["React.js", "Python", "Machine Learning"],
          otherField: "malicious",
        })
    ).toDeny();
  });
});

describe("Delete list", () => {
  it("should deny delete list", async () => {
    await expect(db.collection("lists").doc("skills").delete()).toDeny();
  });
});
