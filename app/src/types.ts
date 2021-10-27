export type Firestore = firebase.firestore.Firestore;

export type Auth = firebase.auth.Auth;

export type Query = firebase.firestore.Query<firebase.firestore.DocumentData>;

export type DocumentData = firebase.firestore.DocumentData;

export type DocumentSnapshot = firebase.firestore.DocumentSnapshot<
  firebase.firestore.DocumentData
>;
export type QuerySnapshot = firebase.firestore.QuerySnapshot<
  firebase.firestore.DocumentData
>;

export type FieldPath = firebase.firestore.FieldPath;

export type WhereFilterOp = firebase.firestore.WhereFilterOp;

export type UserCredential = firebase.auth.UserCredential;

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

export type Credentials = {
  email: string;
  password: string;
};
