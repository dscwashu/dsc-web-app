import "./util/customMatchers";
import firebase, {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./util/firebaseHelpers";
import {
  mockNewUser,
  mockOrgUserProfile,
  mockStudentUserProfile,
} from "./mock/users";

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

describe("Get user", () => {
  it("should allow get user from valid user", async () => {
    await expect(db.collection("users").doc("testUser").get()).toAllow();
    await expect(db.collection("users").doc("diffUser").get()).toAllow();
  });
  it("should deny get user from invalid user", async () => {
    db = getFirestoreInstance();
    await expect(db.collection("users").doc("testUser").get()).toDeny();
  });
});

describe("List user", () => {
  it("should allow list user with valid limit", async () => {
    await expect(db.collection("users").limit(10).get()).toAllow();
  });
  it("should deny list user with invalid limit", async () => {
    await expect(db.collection("users").limit(11).get()).toDeny();
  });
});

describe("Create user", () => {
  it("should allow create user if valid information", async () => {
    await expect(
      db.collection("users").doc("testUser").set(mockNewUser)
    ).toAllow();
  });
  it("should deny create user if invalid information", async () => {
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          account: {
            ...mockNewUser.account,
            email: "diffUser@gmail.com",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          account: {
            ...mockNewUser.account,
            createdAt: new Date(),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          isAdmin: true,
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            firstName: "a".repeat(36),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            lastName: "a".repeat(36),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            role: "student",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            grade: 1,
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            website: "google",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            bio: "a".repeat(501),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            skills: ["React.js"],
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            courses: ["CSE 330"],
          },
        })
    ).toDeny();
  });
  it("should deny create user withe extraneous fields", async () => {
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          account: {
            ...mockNewUser.account,
            otherField: "malicious",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            ...mockNewUser.profile,
            otherField: "malicious",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          otherField: "malicious",
        })
    ).toDeny();
    await expect(
      db
        .collection("users")
        .doc("testUser")
        .set({
          ...mockNewUser,
          profile: {
            otherField: "malicious",
          },
        })
    ).toDeny();
  });
});

describe("Update user", () => {
  describe("profile", () => {
    beforeEach(async () => {
      await seedData({
        "users/testUser": mockNewUser,
        "lists/courses": {
          tags: ["CSE 330", "CSE 247", "CSE 417"],
        },
        "lists/skills": {
          tags: ["React.js", "Python", "Machine Learning"],
        },
      });
    });
    it("should allow updates with valid information", async () => {
      await expect(
        db.collection("users").doc("testUser").update({
          profile: mockOrgUserProfile,
        })
      ).toAllow();
      db = getFirestoreInstance({
        uid: "testUser",
        email: "testUser@wustl.edu",
      });
      await expect(
        db.collection("users").doc("testUser").update({
          profile: mockStudentUserProfile,
        })
      ).toAllow();
    });
    it("should deny updates that modify account or admin status", async () => {
      await expect(
        db.collection("users").doc("testUser").update({
          profile: mockOrgUserProfile,
          isAdmin: true,
        })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: mockOrgUserProfile,
            account: {
              createdAt: new Date(),
              email: "testUser@gmail.com",
            },
          })
      ).toDeny();
    });
    it("should deny updates with extraneous fields", async () => {
      await expect(
        db.collection("users").doc("testUser").update({
          profile: mockOrgUserProfile,
          otherField: "malicious",
        })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              otherField: "malicious",
            },
          })
      ).toDeny();
    });
    it("should deny updates with invalid information", async () => {
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              firstName: "a".repeat(36),
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              lastName: "a".repeat(36),
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              role: "student",
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              grade: 1,
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              website: "google",
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockOrgUserProfile,
              bio: "a".repeat(501),
            },
          })
      ).toDeny();
      await expect(
        db.collection("users").doc("testUser").update({
          profile: mockStudentUserProfile,
        })
      ).toDeny();
      db = getFirestoreInstance({
        uid: "testUser",
        email: "testUser@wustl.edu",
      });
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockStudentUserProfile,
              skills: ["Javascript"],
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("users")
          .doc("testUser")
          .update({
            profile: {
              ...mockStudentUserProfile,
              courses: ["CHEM 300"],
            },
          })
      ).toDeny();
    });
  });
  describe("admin status", () => {
    beforeEach(async () => {
      await seedData({
        "users/testUser": mockNewUser,
        "users/adminUser": {
          isAdmin: true,
        },
      });
    });
    it("should allow updates with valid information and admin credentials", async () => {
      db = getFirestoreInstance({
        uid: "adminUser",
        email: "adminUser@gmail.com",
      });
      await expect(
        db.collection("users").doc("testUser").update({
          isAdmin: true,
        })
      ).toAllow();
      await expect(
        db.collection("users").doc("testUser").update({
          isAdmin: false,
        })
      ).toAllow();
    });
    it("should deny updates with valid information and invalid admin credentials", async () => {
      await expect(
        db.collection("users").doc("testUser").update({
          isAdmin: true,
        })
      ).toDeny();
    });
    it("should deny updates with extraneous fields", async () => {
      db = getFirestoreInstance({
        uid: "adminUser",
        email: "adminUser@gmail.com",
      });
      await expect(
        db.collection("users").doc("testUser").update({
          isAdmin: true,
          otherField: "malicious",
        })
      ).toDeny();
    });
  });
});

describe("Delete user", () => {
  it("should allow delete user if owner", async () => {
    await expect(db.collection("users").doc("testUser").delete()).toAllow();
  });
  it("should deny delete user if owner", async () => {
    await expect(db.collection("users").doc("diffUser").delete()).toDeny();
  });
});
