import firebase from "../util/firebaseHelpers";

export const mockNewProject = {
  finished: false,
  info: {
    title: "Project title",
    description: "",
    github: "",
    industries: [],
    isAcceptingApplications: false,
    platforms: [],
    projectMemberQuestions: [],
    skills: [],
  },
  orgInfo: {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    org: "orgUser",
    type: "nonprofit",
  },
  projectManagerInfo: {
    projectManager: "",
    isAcceptingApplications: true,
  },
  users: [],
};

export const mockProjectInfo = {
  title: "Project title",
  description: "Project description",
  github: "dsc-web-app",
  industries: ["Healthcare", "Education"],
  isAcceptingApplications: true,
  platforms: ["web", "mobile"],
  projectMemberQuestions: ["Question 1", "Question 2", "Question 3"],
  skills: ["React.js"],
};
