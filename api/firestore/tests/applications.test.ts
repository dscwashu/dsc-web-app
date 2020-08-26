import "./util/customMatchers";
import firebase, {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./util/firebaseHelpers";
import { mockNewApplication } from "./mock/applications";

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

describe("Get application", () => {
  it("should allow get application from owner", async () => {
    await seedData({
      "applications/123": {
        info: {
          user: "testUser",
        },
      },
    });
    await expect(db.collection("applications").doc("123").get()).toAllow();
  });
  it("should allow get application from admin", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
    });
    await expect(db.collection("applications").doc("123").get()).toAllow();
  });
  it("should allow get application from project manager", async () => {
    await seedData({
      "applications/123": {
        info: {
          user: "diffUser",
          type: "projectMember",
          project: "123",
        },
      },
      "projects/123": {
        projectManagerInfo: {
          projectManager: "testUser",
        },
      },
    });
    await expect(db.collection("applications").doc("123").get()).toAllow();
  });
  it("should deny get list from invalid user", async () => {
    await seedData({
      "applications/123": {
        info: {
          user: "diffUser",
        },
      },
    });
    await expect(db.collection("applications").doc("123").get()).toDeny();
  });
});

describe("List application", () => {
  it("should allow list application from owner with valid limit", async () => {
    await seedData({
      "applications/1": {
        info: {
          user: "testUser",
        },
      },
      "applications/2": {
        info: {
          user: "testUser",
        },
      },
      "applications/3": {
        info: {
          user: "testUser",
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .where("info.user", "==", "testUser")
        .limit(10)
        .get()
    ).toAllow();
  });
  it("should allow list application from admin with valid limit", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
    });
    await expect(db.collection("applications").limit(10).get()).toAllow();
  });
  it("should allow list application from project manager with valid limit", async () => {
    await seedData({
      "applications/123": {
        info: {
          user: "diffUser",
          type: "projectMember",
          project: "123",
        },
      },
      "projects/123": {
        projectManagerInfo: {
          projectManager: "testUser",
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .where("info.type", "==", "projectMember")
        .where("info.project", "==", "123")
        .limit(10)
        .get()
    ).toAllow();
  });
  it("should deny list application with invalid limit", async () => {
    await seedData({
      "applications/1": {
        info: {
          user: "testUser",
        },
      },
      "applications/2": {
        info: {
          user: "testUser",
        },
      },
      "applications/3": {
        info: {
          user: "testUser",
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .where("info.user", "==", "testUser")
        .limit(11)
        .get()
    ).toDeny();
  });
});

describe("Create application", () => {
  it("should allow create application for non-projects if valid information", async () => {
    await seedData({
      "lists/coreTeamQuestions": {
        isAcceptingApplications: true,
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "coreTeam",
            project: "",
          },
        })
    ).toAllow();
    clearFirestore();
    db = getFirestoreInstance({
      uid: "testUser",
      email: "testUser@gmail.com",
      email_verified: true,
    });
    await seedData({
      "users/testUser": {
        profile: {
          role: "student",
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "studentProject",
            project: "",
          },
        })
    ).toAllow();
    await clearFirestore();
    await seedData({
      "users/testUser": {
        profile: {
          role: "org",
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "orgProject",
            project: "",
          },
        })
    ).toAllow();
  });
  it("should allow create application for projects if valid information", async () => {
    db = getFirestoreInstance({
      uid: "testUser",
      email: "testUser@gmail.com",
      email_verified: true,
    });
    await seedData({
      "users/testUser": {
        profile: {
          role: "student",
        },
      },
      "projects/123": {
        projectManagerInfo: {
          isAcceptingApplications: true,
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "projectManager",
            project: "123",
          },
        })
    ).toAllow();
    await clearFirestore();
    await seedData({
      "users/testUser": {
        profile: {
          role: "student",
        },
      },
      "projects/123": {
        info: {
          isAcceptingApplications: true,
        },
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "projectMember",
            project: "123",
          },
        })
    ).toAllow();
  });
  it("should deny create application for projects if not signed in", async () => {
    db = getFirestoreInstance();
    await seedData({
      "lists/coreTeamQuestions": {
        isAcceptingApplications: true,
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "coreTeam",
            project: "",
          },
        })
    ).toDeny();
  });
  it("should deny create list with extraneous fields", async () => {
    await seedData({
      "lists/coreTeamQuestions": {
        isAcceptingApplications: true,
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            otherField: "malicious",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
          },
          otherField: "malicious",
        })
    ).toDeny();
  });
  it("should deny create list with invalid information", async () => {
    await seedData({
      "lists/coreTeamQuestions": {
        isAcceptingApplications: true,
      },
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
          },
          accepted: true,
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
          },
          pending: false,
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            createdAt: new Date(),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            user: "diffUser",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            type: "whatever",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            project: "xyz",
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("applications")
        .doc("123")
        .set({
          ...mockNewApplication,
          info: {
            ...mockNewApplication.info,
            answers: "whatever",
          },
        })
    ).toDeny();
  });
});

describe("Update application", () => {
  it("should allow update application if valid information and valid credentials", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
      "applications/123": mockNewApplication,
    });
    await expect(
      db.collection("applications").doc("123").update({
        accepted: true,
        pending: false,
      })
    ).toAllow();
    await seedData({
      "projects/123": {
        projectManagerInfo: {
          projectManager: "testUser",
        },
      },
      "users/testUser": {
        isAdmin: false,
      },
      "applications/123": {
        ...mockNewApplication,
        info: {
          ...mockNewApplication.info,
          type: "projectMember",
          project: "123",
        },
      },
    });
    await expect(
      db.collection("applications").doc("123").update({
        accepted: true,
        pending: false,
      })
    ).toAllow();
  });
  it("should deny update application if valid information and invalid credentials", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: false,
      },
      "applications/123": mockNewApplication,
    });
    await expect(
      db.collection("applications").doc("123").update({
        accepted: true,
        pending: false,
      })
    ).toDeny();
    await seedData({
      "projects/123": {
        projectManagerInfo: {
          projectManager: "diffUser",
        },
      },
      "users/testUser": {
        isAdmin: false,
      },
      "applications/123": {
        ...mockNewApplication,
        info: {
          ...mockNewApplication.info,
          type: "projectMember",
          project: "123",
        },
      },
    });
    await expect(
      db.collection("applications").doc("123").update({
        accepted: true,
        pending: false,
      })
    ).toDeny();
  });
  it("should deny update application with invalid information", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
      "applications/123": mockNewApplication,
    });
    await expect(
      db.collection("applications").doc("123").update({
        accepted: true,
        pending: true,
      })
    ).toDeny();
  });
  it("should deny update application that modifies info", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
      "applications/123": mockNewApplication,
    });
    await expect(
      db
        .collection("applications")
        .doc("123")
        .update({
          accepted: true,
          pending: false,
          info: {
            field: "whatever",
          },
        })
    ).toDeny();
  });
  it("should deny update application with extraneous fields", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
      "applications/123": mockNewApplication,
    });
    await expect(
      db.collection("applications").doc("123").update({
        accepted: true,
        pending: false,
        otherField: "malicious",
      })
    ).toDeny();
  });
});

describe("Delete application", () => {
  it("should allow delete list if owner", async () => {
    await seedData({
      "applications/123": {
        info: {
          user: "testUser",
        },
      },
    });
    await expect(db.collection("applications").doc("123").delete()).toAllow();
  });
  it("should deny delete list if not owner", async () => {
    await seedData({
      "applications/123": {
        info: {
          user: "diffUser",
        },
      },
    });
    await expect(db.collection("applications").doc("123").delete()).toDeny();
  });
});
