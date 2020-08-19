import "./util/customMatchers";
import firebase, {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./util/firebaseHelpers";
import { mockNewEvent } from "./mock/events";

let db: firebase.firestore.Firestore;

beforeEach(async () => {
  db = getFirestoreInstance({
    uid: "testUser",
    email: "testUser@gmail.com",
    email_verified: true,
  });
});
afterEach(async () => {
  await clearFirestore();
  await clearApps();
});

describe("Get event", () => {
  it("should allow get event from valid user", async () => {
    await expect(db.collection("events").doc("test").get()).toAllow();
  });
  it("should deny get event from invalid user", async () => {
    db = getFirestoreInstance();
    await expect(db.collection("events").doc("test").get()).toDeny();
  });
});

describe("List event", () => {
  it("should allow list event with valid limit", async () => {
    await expect(db.collection("events").limit(10).get()).toAllow();
  });
  it("should deny list event with invalid limit", async () => {
    await expect(db.collection("events").limit(11).get()).toDeny();
  });
});

describe("Create event", () => {
  beforeEach(async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
    });
  });
  it("should allow create event with valid information and admin credentials", async () => {
    await expect(
      db.collection("events").doc("test").set(mockNewEvent)
    ).toAllow();
  });
  it("should deny create event with valid information and invalid credentials", async () => {
    db = getFirestoreInstance();
    await expect(
      db.collection("events").doc("test").set(mockNewEvent)
    ).toDeny();
  });
  it("should deny create event with extraneous fields", async () => {
    await expect(
      db
        .collection("events")
        .doc("test")
        .set({
          ...mockNewEvent,
          otherField: "malicious",
        })
    ).toDeny();
    await expect(
      db
        .collection("events")
        .doc("test")
        .set({
          ...mockNewEvent,
          info: {
            ...mockNewEvent.info,
            otherField: "malicious",
          },
        })
    ).toDeny();
  });
  it("should deny create event with invalid information", async () => {
    await expect(
      db
        .collection("events")
        .doc("test")
        .set({
          ...mockNewEvent,
          info: {
            ...mockNewEvent.info,
            title: "a".repeat(101),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("events")
        .doc("test")
        .set({
          ...mockNewEvent,
          info: {
            ...mockNewEvent.info,
            description: "a".repeat(501),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("events")
        .doc("test")
        .set({
          ...mockNewEvent,
          info: {
            ...mockNewEvent.info,
            startTime: new Date("2020-08-02T03:00:00"),
            endTime: new Date("2020-08-01T04:00:00"),
          },
        })
    ).toDeny();
    await expect(
      db
        .collection("events")
        .doc("test")
        .set({
          ...mockNewEvent,
          info: {
            ...mockNewEvent.info,
            location: "a".repeat(101),
          },
        })
    ).toDeny();
  });
});

describe("Update event", () => {
  beforeEach(async () => {
    await seedData({
      "users/testUser": {
        profile: {
          role: "student",
        },
      },
      "events/test": mockNewEvent,
    });
  });
  it("should allow update event if valid information with student credentials", async () => {
    await expect(
      db
        .collection("events")
        .doc("test")
        .update({
          users: firebase.firestore.FieldValue.arrayUnion("testUser"),
        })
    ).toAllow();
  });
  it("should deny update event if valid information with invalid student credentials", async () => {
    await seedData({
      "users/testUser": {
        profile: {
          role: "org",
        },
      },
    });
    await expect(
      db
        .collection("events")
        .doc("test")
        .update({
          users: firebase.firestore.FieldValue.arrayUnion("testUser"),
        })
    ).toDeny();
  });
  it("should deny update event that modifies info", async () => {
    await expect(
      db
        .collection("events")
        .doc("test")
        .update({
          info: {
            field: "whatever",
          },
          users: ["testUser"],
        })
    ).toDeny();
  });
  it("should deny update event with extraneous fields", async () => {
    await expect(
      db
        .collection("events")
        .doc("test")
        .update({
          users: ["testUser"],
          otherField: "malicious",
        })
    ).toDeny();
  });
});

describe("Delete event", () => {
  it("should allow delete event with admin credentials", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
    });
    await expect(db.collection("events").doc("test").delete()).toAllow();
  });
  it("should deny delete event with invalid admin credentials", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: false,
      },
    });
    await expect(db.collection("events").doc("test").delete()).toDeny();
  });
});
