import { useContext } from "react";

import { FirebaseContext } from "./FirebaseProvider";
import { Auth, Firestore } from "../types";

export const useAuth = (): Auth => {
  const context = useContext(FirebaseContext);
  if (context && context.auth) {
    return context.auth;
  } else {
    throw new Error("useAuth called outside of FirebaseProvider");
  }
};

export const useFirestore = (): Firestore => {
  const context = useContext(FirebaseContext);
  if (context && context.firestore) {
    return context.firestore;
  } else {
    throw new Error("useFirestore called outside of FirebaseProvider");
  }
};
