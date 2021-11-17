import "./util/customMatchers";
import firebase, {
  getFirestoreInstance,
  seedData,
  clearApps,
  clearFirestore,
} from "./util/firebaseHelpers";
import { mockNewProject, mockProjectInfo } from "./mock/projects";

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

describe("Get project", () => {
  it("should allow get project from valid user", async () => {
    await expect(db.collection("projects").doc("123").get()).toAllow();
  });
  it("should deny get user from invalid user", async () => {
    db = getFirestoreInstance();
    await expect(db.collection("projects").doc("123").get()).toDeny();
  });
});

describe("List project", () => {
  it("should allow list project with valid limit", async () => {
    await expect(db.collection("projects").limit(10).get()).toAllow();
  });
  it("should deny list project with invalid limit", async () => {
    await expect(db.collection("projects").limit(11).get()).toDeny();
  });
});

const createProject = async (
  requestData: Record<string, any>
): Promise<void> => {
  await clearFirestore();
  await seedData({
    "users/testUser": {
      isAdmin: true,
    },
    "users/orgUser": {
      profile: {
        role: "org",
      },
    },
    "lists/industries": {
      tags: ["Healthcare", "Education", "Sports"],
    },
    "lists/skills": {
      tags: ["React.js", "Machine Learning", "Python"],
    },
  });
  const batch = db.batch();
  const projectRef = db.collection("projects").doc("123");
  batch.set(projectRef, requestData);
  const privateRef = db
    .collection("projects")
    .doc("123")
    .collection("private")
    .doc("resources");
  batch.set(privateRef, {
    resources: [],
  });
  return batch.commit();
};

describe("Create project", () => {
  it("should allow create project with valid information and admin credentials", async () => {
    await expect(createProject(mockNewProject)).toAllow();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          description: "Project description",
          github: "dsc-web-app",
          industries: ["Healthcare"],
          platforms: ["web"],
          skills: ["React.js"],
        },
      })
    ).toAllow();
  });
  it("should deny create project with extraneous fields", async () => {
    await expect(
      createProject({ ...mockNewProject, otherField: "malicious" })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          otherField: "malicious",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        orgInfo: {
          ...mockNewProject.orgInfo,
          otherField: "malicious",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        projectManagerInfo: {
          ...mockNewProject.projectManagerInfo,
          otherField: "malicious",
        },
      })
    ).toDeny();
  });
  it("should deny create project with invalid information", async () => {
    await expect(
      createProject({
        ...mockNewProject,
        finished: true,
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        users: "whatever",
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        projectManagerInfo: {
          ...mockNewProject.projectManagerInfo,
          projectManagerInfo: "whatever",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        projectManagerInfo: {
          ...mockNewProject.projectManagerInfo,
          isAcceptingApplications: false,
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        orgInfo: {
          ...mockNewProject.orgInfo,
          createdAt: new Date(),
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        orgInfo: {
          ...mockNewProject.orgInfo,
          org: "diffUser",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        orgInfo: {
          ...mockNewProject.orgInfo,
          type: "whatever",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          title: "",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          title: "a".repeat(101),
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          description: "a".repeat(501),
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          github: "git hub",
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          industries: ["whatever"],
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          isAcceptingApplications: true,
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          platforms: ["whatever"],
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          projectMemberQuestions: ["Question 1", "Question 2", "Question 3"],
        },
      })
    ).toDeny();
    await expect(
      createProject({
        ...mockNewProject,
        info: {
          ...mockNewProject.info,
          skills: ["whatever"],
        },
      })
    ).toDeny();
  });
  it("should deny create project without private resources", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
      "users/orgUser": {
        profile: {
          role: "org",
        },
      },
    });
    await expect(
      db.collection("projects").doc("123").set(mockNewProject)
    ).toDeny();
  });
});

describe("Update project", () => {
  describe("project info", () => {
    beforeEach(async () => {
      await seedData({
        "projects/123": {
          ...mockNewProject,
          projectManagerInfo: {
            projectManager: "testUser",
          },
        },
        "lists/industries": {
          tags: ["Healthcare", "Education", "Sports"],
        },
        "lists/skills": {
          tags: ["React.js", "Machine Learning", "Python"],
        },
      });
    });
    it("should allow update project if valid information and valid credentials", async () => {
      await expect(
        db.collection("projects").doc("123").update({
          info: mockProjectInfo,
        })
      ).toAllow();
    });
    it("should deny update project if valid information and invalid credentials", async () => {
      await seedData({
        "projects/123": {
          ...mockNewProject,
          projectManagerInfo: {
            projectManager: "diffUser",
          },
        },
      });
      await expect(
        db.collection("projects").doc("123").update({
          info: mockProjectInfo,
        })
      ).toDeny();
    });
    it("should deny update project with invalid information", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              title: "a".repeat(101),
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              description: "a".repeat(501),
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              github: "git hub",
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              skills: ["Javascript"],
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              industries: ["Furniture"],
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              isAcceptingApplications: "whatever",
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              platforms: ["whatever"],
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: {
              ...mockProjectInfo,
              projectMemberQuestions: "whatever",
            },
          })
      ).toDeny();
    });
    it("should deny update project that modifies other fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: mockProjectInfo,
            orgInfo: {
              ...mockNewProject.orgInfo,
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: mockProjectInfo,
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: true,
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: mockProjectInfo,
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
          })
      ).toDeny();
      await expect(
        db.collection("projects").doc("123").update({
          info: mockProjectInfo,
          finished: true,
        })
      ).toDeny();
    });
    it("should deny update project with extraneous fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            info: { ...mockProjectInfo, otherField: "malicious" },
          })
      ).toDeny();
      await expect(
        db.collection("projects").doc("123").update({
          info: mockProjectInfo,
          otherField: "malicious",
        })
      ).toDeny();
    });
  });
  describe("project members", () => {
    beforeEach(async () => {
      await seedData({
        "projects/123": {
          ...mockNewProject,
          projectManagerInfo: {
            projectManager: "testUser",
          },
        },
      });
    });
    it("should allow update project if valid information and valid credentials", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
          })
      ).toAllow();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayRemove("whatever"),
          })
      ).toAllow();
    });
    it("should deny update project if valid information and invalid credentials", async () => {
      await seedData({
        "projects/123": {
          ...mockNewProject,
          projectManagerInfo: {
            projectManager: "diffUser",
          },
        },
      });
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
          })
      ).toDeny();
    });
    it("should deny update project with invalid information", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion(
              "whatever1",
              "whatever2"
            ),
          })
      ).toDeny();
      await db
        .collection("projects")
        .doc("123")
        .update({
          users: firebase.firestore.FieldValue.arrayUnion("whatever1"),
        });
      await db
        .collection("projects")
        .doc("123")
        .update({
          users: firebase.firestore.FieldValue.arrayUnion("whatever2"),
        });
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayRemove(
              "whatever1",
              "whatever2"
            ),
          })
      ).toDeny();
    });
    it("should deny update project that modifies other fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
            orgInfo: {
              ...mockNewProject.orgInfo,
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: true,
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
            info: mockProjectInfo,
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
            finished: true,
          })
      ).toDeny();
    });
    it("should deny update project with extraneous fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
            otherField: "malicious",
          })
      ).toDeny();
    });
  });
  describe("project manager", () => {
    beforeEach(async () => {
      await seedData({
        "projects/123": mockNewProject,
        "users/testUser": {
          isAdmin: true,
        },
        "users/diffUser": {
          profile: {
            role: "student",
          },
        },
      });
    });
    it("should allow update project if valid information and valid credentials", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser"],
          })
      ).toAllow();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser", "anotherUser"],
          })
      ).toAllow();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "",
              isAcceptingApplications: true,
            },
            users: [],
          })
      ).toAllow();
    });
    it("should deny update project if valid information and invalid credentials", async () => {
      await seedData({
        "users/testUser": {
          isAdmin: false,
        },
      });
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser"],
          })
      ).toDeny();
    });
    it("should deny update project with invalid information", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: true,
            },
            users: ["diffUser"],
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: true,
            },
            users: [],
          })
      ).toDeny();
    });
    it("should deny update project that modifies other fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser"],
            info: mockProjectInfo,
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser"],
            orgInfo: {
              ...mockNewProject.orgInfo,
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser"],
            finished: true,
          })
      ).toDeny();
    });
    it("should deny update project with extraneous fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
            },
            users: ["diffUser"],
            otherField: "malicious",
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            projectManagerInfo: {
              projectManager: "diffUser",
              isAcceptingApplications: false,
              otherField: "malicious",
            },
            users: ["diffUser"],
          })
      ).toDeny();
    });
  });
  describe("finished status", () => {
    beforeEach(async () => {
      await seedData({
        "projects/123": mockNewProject,
        "users/testUser": {
          isAdmin: true,
        },
      });
    });
    it("should allow update project if valid information and valid credentials", async () => {
      await expect(
        db.collection("projects").doc("123").update({
          finished: true,
        })
      ).toAllow();
      await expect(
        db.collection("projects").doc("123").update({
          finished: false,
        })
      ).toAllow();
    });
    it("should deny update project if valid information and invalid credentials", async () => {
      await seedData({
        "users/testUser": {
          isAdmin: false,
        },
      });
      await expect(
        db.collection("projects").doc("123").update({
          finished: true,
        })
      ).toDeny();
    });
    it("should deny update project with invalid information", async () => {
      await expect(
        db.collection("projects").doc("123").update({
          finished: "whatever",
        })
      ).toDeny();
    });
    it("should deny update project that modifies other fields", async () => {
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            finished: true,
            users: firebase.firestore.FieldValue.arrayUnion("whatever"),
          })
      ).toDeny();
      await expect(
        db.collection("projects").doc("123").update({
          finished: true,
          info: mockProjectInfo,
        })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            finished: true,
            projectManagerInfo: {
              isAcceptingApplications: true,
              projectManager: "diffUser",
            },
          })
      ).toDeny();
      await expect(
        db
          .collection("projects")
          .doc("123")
          .update({
            finished: true,
            orgInfo: { ...mockNewProject.info },
          })
      ).toDeny();
    });
    it("should deny update project with extraneous fields", async () => {
      await expect(
        db.collection("projects").doc("123").update({
          finished: true,
          otherField: "malicious",
        })
      ).toDeny();
    });
  });
});

describe("Delete project", () => {
  it("should allow delete project if admin", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: true,
      },
    });
    await expect(db.collection("projects").doc("123").delete()).toAllow();
  });
  it("should deny delete project if not admin", async () => {
    await seedData({
      "users/testUser": {
        isAdmin: false,
      },
    });
    await expect(db.collection("projects").doc("123").delete()).toDeny();
  });
});
