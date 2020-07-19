import "./helpers/customMatchers";
import {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./helpers/helpers";

describe("Profile access", () => {
  let db: firebase.firestore.Firestore;
  beforeEach(async () => {
    db = getFirestoreInstance({
      uid: "testuser",
      email: "testuser@gmail.com",
    });
    await seedData({
      "users/testuser": {
        finishProfile: false,
        security: "external",
      },
    });
  });
  afterAll(async () => {
    await clearFirestore();
  });
  afterEach(async () => {
    await clearApps();
  });
  it("should allow reads from valid user", async () => {
    await expect(db.collection("users").doc("testuser").get()).toAllow();
  });
  it("should deny reads from invalid user", async () => {
    await expect(db.collection("users").doc("wronguser").get()).toDeny();
  });
  it("should allow update with valid format", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "www.google.com",
        bio: "I like food",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toAllow();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toAllow();
  });
  it("should deny update without first and last name", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "",
        website: "www.google.com",
        bio: "I like food",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toDeny();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "",
        lastName: "Young",
        website: "www.google.com",
        bio: "I like food",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toDeny();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "",
        lastName: "",
        website: "www.google.com",
        bio: "I like food",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toDeny();
  });
  it("should deny update with invalid url", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "invalid",
        bio: "I like food",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testuser")
        .update({
          firstName: "Zach",
          lastName: "Young",
          website: "www.g" + "o".repeat(2080) + "gle.com",
          bio: "I like food",
          role: "org",
          grade: 0,
          finishProfile: true,
        })
    ).toDeny();
  });
  it("should deny update with bio > 500 chars", async () => {
    await expect(
      db
        .collection("users")
        .doc("testuser")
        .update({
          firstName: "Zach",
          lastName: "Young",
          website: "",
          bio: "a".repeat(501),
          role: "org",
          grade: 0,
          finishProfile: true,
        })
    ).toDeny();
  });
  it("should verify role based on authentication email", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: 0,
        finishProfile: true,
      })
    ).toAllow();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "student",
        grade: 0,
        finishProfile: true,
      })
    ).toDeny();
    await seedData({
      "users/testuser": {
        finishProfile: false,
        security: "internal",
      },
    });
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "student",
        grade: 0,
        finishProfile: true,
      })
    ).toAllow();
  });
  it("should deny invalid grade", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: -1,
        finishProfile: true,
      })
    ).toDeny();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: 6,
        finishProfile: true,
      })
    ).toDeny();
  });
  it("should deny requests without finishProfile set to true", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: 1,
      })
    ).toDeny();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: 1,
        finishProfile: false,
      })
    ).toDeny();
  });
  it("should deny requests that change security", async () => {
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: 1,
        finishProfile: true,
        security: "internal",
      })
    ).toDeny();
    await expect(
      db.collection("users").doc("testuser").update({
        firstName: "Zach",
        lastName: "Young",
        website: "",
        bio: "I like food",
        role: "org",
        grade: 1,
        finishProfile: true,
        security: "external",
      })
    ).toAllow();
  });
});
