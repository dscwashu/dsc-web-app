import firebase from "firebase/app";

export type SnackbarInfo = {
  open: boolean;
  type: "success" | "error";
  text: string;
};

export type BreadcrumbsItem = {
  text: string;
  link: string;
};

export type ApplicationType =
  | "orgProject"
  | "studentProject"
  | "coreTeam"
  | "projectManager"
  | "projectMember";

export type Application = {
  accepted: boolean;
  pending: boolean;
  info: {
    project: string;
    user: string;
    answers: Answer[];
    createdAt: firebase.firestore.Timestamp;
    type: ApplicationType;
  };
};

export type Answer = {
  question: string;
  answer: string;
};
