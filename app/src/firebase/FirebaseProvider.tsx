import React, { createContext, useMemo, useCallback } from "react";
import firebase from "firebase/app";
import { useAppDispatch } from "../app/store";
import { Credentials, UserCredential } from "../types";
import { login as reduxLogin } from "../features/authSlice";

interface FirebaseContextProps {
  auth: firebase.auth.Auth;
  firestore: firebase.firestore.Firestore;
  login: (credentials: Credentials) => Promise<UserCredential>;
}

export const FirebaseContext = createContext<Partial<FirebaseContextProps>>({
  login: () => {
    throw new Error("login used outside of FirebaseProvider");
  },
});

const FirebaseProvider: React.FC = ({ children }) => {
  const auth = useMemo(() => firebase.auth(), []);
  const firestore = useMemo(() => firebase.firestore(), []);
  const dispatch = useAppDispatch();
  const login = useCallback((credentials: Credentials): Promise<
    UserCredential
  > => {
    return dispatch(reduxLogin({ auth, ...credentials }));
  }, []);
  return (
    <FirebaseContext.Provider value={{ auth, firestore, login }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
