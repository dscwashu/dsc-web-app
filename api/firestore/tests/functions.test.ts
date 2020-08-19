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

describe("validateTrimmedString", () => {
  it("should allow writes if valid", async () => {
    await expect(
      db.collection("validateTrimmedString").doc("allowEmpty").set({
        field: "",
      })
    ).toAllow();
    await expect(
      db.collection("validateTrimmedString").doc("dontAllowEmpty").set({
        field: "word",
      })
    ).toAllow();
  });
  it("should deny writes if not trimmed", async () => {
    await expect(
      db.collection("validateTrimmedString").doc("allowEmpty").set({
        field: " word",
      })
    ).toDeny();
    await expect(
      db.collection("validateTrimmedString").doc("allowEmpty").set({
        field: "word ",
      })
    ).toDeny();
  });
  it("should deny writes if empty", async () => {
    await expect(
      db.collection("validateTrimmedString").doc("dontAllowEmpty").set({
        field: "",
      })
    ).toDeny();
  });
  it("should deny writes if too large", async () => {
    await expect(
      db
        .collection("validateTrimmedString")
        .doc("allowEmpty")
        .set({
          field: "a".repeat(11),
        })
    ).toDeny();
  });
});

describe("isUnmodified", () => {
  beforeEach(async () => {
    await seedData({
      "isUnmodified/general": {
        field: "Zach",
      },
    });
  });
  it("should allow writes if unmodified", async () => {
    await expect(
      db.collection("isUnmodified").doc("general").update({
        otherField: "whatever",
      })
    ).toAllow();
  });
  it("should deny writes if modified", async () => {
    await expect(
      db.collection("isUnmodified").doc("general").update({
        field: "Young",
      })
    ).toDeny();
  });
});

describe("isAdmin", () => {
  it("should allow writes if admin", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
    });
    await expect(
      db.collection("isAdmin").doc("general").set({
        field: "whatever",
      })
    ).toAllow();
  });
  it("should deny writes if not admin", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: false,
      },
    });
    await expect(
      db.collection("isAdmin").doc("general").set({
        field: "whatever",
      })
    ).toDeny();
  });
});

describe("isStudent", () => {
  it("should allow writes if student", async () => {
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
      db.collection("isStudent").doc("general").set({
        field: "whatever",
      })
    ).toAllow();
  });
  it("should deny writes if not student", async () => {
    db = getFirestoreInstance({
      uid: "testUser",
      email: "testUser@gmail.com",
      email_verified: true,
    });
    await seedData({
      "users/testUser": {
        profile: {
          role: "org",
        },
      },
    });
    await expect(
      db.collection("isStudent").doc("general").set({
        field: "whatever",
      })
    ).toDeny();
  });
  it("should allow writes if student but not verified", async () => {
    db = getFirestoreInstance({
      uid: "testUser",
      email: "testUser@gmail.com",
      email_verified: false,
    });
    await seedData({
      "users/testUser": {
        profile: {
          role: "student",
        },
      },
    });
    await expect(
      db.collection("isStudent").doc("general").set({
        field: "whatever",
      })
    ).toDeny();
  });
});

describe("isProjectMember", () => {
  it("should allow writes if project member", async () => {
    await seedData({
      "projects/123": {
        users: ["testUser"],
      },
    });
    await expect(
      db.collection("isProjectMember").doc("general").set({
        field: "whatever",
      })
    ).toAllow();
  });
  it("should deny writes if not project member", async () => {
    await seedData({
      "projects/123": {
        users: ["diffUser"],
      },
    });
    await expect(
      db.collection("isProjectMember").doc("general").set({
        field: "whatever",
      })
    ).toDeny();
  });
});

describe("isProjectManager", () => {
  it("should allow writes if project member", async () => {
    await seedData({
      "projects/123": {
        projectManagerInfo: {
          projectManager: "testUser",
        },
      },
    });
    await expect(
      db.collection("isProjectManager").doc("general").set({
        field: "whatever",
      })
    ).toAllow();
  });
  it("should deny writes if not project member", async () => {
    await seedData({
      "projects/123": {
        projectManagerInfo: {
          projectManager: "diffUser",
        },
      },
    });
    await expect(
      db.collection("isProjectManager").doc("general").set({
        field: "whatever",
      })
    ).toDeny();
  });
});

describe("validateCreatedAt", () => {
  it("should allow writes if valid", async () => {
    await expect(
      db.collection("validateCreatedAt").doc("general").set({
        field: firebase.firestore.FieldValue.serverTimestamp(),
      })
    ).toAllow();
  });
  it("should deny writes if not valid", async () => {
    await expect(
      db.collection("validateCreatedAt").doc("general").set({
        field: new Date(),
      })
    ).toDeny();
  });
});

describe("validateUrl", () => {
  it("should allow writes if valid", async () => {
    await expect(
      db.collection("validateUrl").doc("allowEmpty").set({
        field: "",
      })
    ).toAllow();
    await expect(
      db.collection("validateUrl").doc("dontAllowEmpty").set({
        field: "www.google.com",
      })
    ).toAllow();
  });
  it("should deny writes if not trimmed", async () => {
    await expect(
      db.collection("validateUrl").doc("allowEmpty").set({
        field: " www.google.com",
      })
    ).toDeny();
    await expect(
      db.collection("validateUrl").doc("allowEmpty").set({
        field: "www.google.com ",
      })
    ).toDeny();
  });
  it("should deny writes if empty", async () => {
    await expect(
      db.collection("validateUrl").doc("dontAllowEmpty").set({
        field: "",
      })
    ).toDeny();
  });
  it("should deny writes if too large", async () => {
    await expect(
      db
        .collection("validateUrl")
        .doc("allowEmpty")
        .set({
          field: "www.g" + "o".repeat(2085) + "gle.com",
        })
    ).toDeny();
  });
});

describe("hasValidTags", () => {
  beforeEach(async () => {
    await seedData({
      "lists/skills": {
        tags: ["React.js", "Python", "Machine Learning"],
      },
    });
  });
  it("should allow writes if valid tags", async () => {
    await expect(
      db
        .collection("hasValidTags")
        .doc("general")
        .set({
          field: ["React.js", "Python"],
        })
    ).toAllow();
  });
  it("should deny writes if invalid tags", async () => {
    await expect(
      db
        .collection("hasValidTags")
        .doc("general")
        .set({
          field: ["React.js", "Javascript"],
        })
    ).toDeny();
  });
});
