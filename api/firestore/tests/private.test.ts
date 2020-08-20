import "./util/customMatchers";
import firebase, {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./util/firebaseHelpers";
import { mockNewProject } from "./mock/projects";

let db: firebase.firestore.Firestore;

beforeEach(async () => {
  db = getFirestoreInstance({
    uid: "testUser",
    email: "testUser@gmail.com",
  });
  await seedData({
    "projects/123": {
      projectManagerInfo: {
        projectManager: "testUser",
      },
      users: ["testUser"],
    },
    "projects/123/private/resources": {
      resources: [],
    },
  });
});
afterEach(async () => {
  await clearFirestore();
  await clearApps();
});

describe("Get private resources", () => {
  it("should allow get private resources from project member", async () => {
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .get()
    ).toAllow();
  });
  it("should deny get private resources from project member", async () => {
    db = getFirestoreInstance();
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .get()
    ).toDeny();
  });
});

describe("List private resources", () => {
  it("should deny list private resources", async () => {
    await expect(
      db.collection("projects").doc("123").collection("private").get()
    ).toDeny();
  });
});

const createPrivateResources = async (
  requestData: Record<string, any>,
  isAdmin: boolean
): Promise<void> => {
  await clearFirestore();
  await seedData({
    "users/testUser": {
      isAdmin,
    },
    "users/orgUser": {
      profile: {
        role: "org",
      },
    },
  });
  const batch = db.batch();
  const projectRef = db.collection("projects").doc("123");
  batch.set(projectRef, mockNewProject);
  const privateRef = db
    .collection("projects")
    .doc("123")
    .collection("private")
    .doc("resources");
  batch.set(privateRef, requestData);
  return batch.commit();
};

describe("Create private resources", () => {
  it("should allow create private resources with valid information and admin credentials", async () => {
    await expect(createPrivateResources({ resources: [] }, true)).toAllow();
  });
  it("should deny create private resources with valid information and invalid admin credentials", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: false,
      },
    });
    await expect(createPrivateResources({ resources: [] }, false)).toDeny();
  });
  it("should deny create private resources with invalid information", async () => {
    await expect(
      createPrivateResources({ resources: ["whatever"] }, true)
    ).toDeny();
  });
  it("should deny create private resources with extraneous fields", async () => {
    await expect(
      createPrivateResources({ resources: [], otherField: "malicious" }, true)
    ).toDeny();
  });
});

describe("Update private resources", () => {
  it("should allow update private resources if valid information and credentials", async () => {
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .update({
          resources: ["Resource 1", "Resource 2", "Resource 3"],
        })
    ).toAllow();
  });
  it("should deny private resources if valid information and invalid credentials", async () => {
    await seedData({
      "projects/123": {
        projectManagerInfo: {
          projectManager: "diffUser",
        },
        users: ["diffUser"],
      },
    });
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .update({
          resources: ["Resource 1", "Resource 2", "Resource 3"],
        })
    ).toDeny();
  });
  it("should deny update private resources with extraneous fields", async () => {
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .update({
          resources: ["Resource 1", "Resource 2", "Resource 3"],
          otherField: "extraneous",
        })
    ).toDeny();
  });
  it("should deny update private resources with invalid information", async () => {
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .update({
          resources: "whatever",
        })
    ).toDeny();
  });
});

describe("Delete private resources", () => {
  it("should deny delete private resources", async () => {
    await expect(
      db
        .collection("projects")
        .doc("123")
        .collection("private")
        .doc("resources")
        .delete()
    ).toDeny();
  });
});
