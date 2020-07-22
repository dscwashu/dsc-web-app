import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  isLoaded,
  isEmpty,
  FirebaseReducer,
  useFirestoreConnect,
  useFirebase,
} from "react-redux-firebase";

import MaterialLink from "@material-ui/core/Link";

import DialogLayout from "./DialogLayout";
import { RootState } from "../app/rootReducer";
import LoadingScreen from "./LoadingScreen";

interface FinishProfileCheckerProps {
  auth: FirebaseReducer.AuthState;
}

enum ProfileState {
  Loading,
  Retry,
  Redirect,
  VerifyEmail,
  Valid,
}

export const FinishProfileChecker: React.FC<FinishProfileCheckerProps> = ({
  auth,
  children,
}) => {
  const history = useHistory();
  const [profileState, setProfileState] = useState<ProfileState>(
    ProfileState.Loading
  );
  const firebase = useFirebase();
  useFirestoreConnect([{ collection: "users", doc: auth.uid }]);
  const { emailVerified, requested, finishProfile, role } = useSelector(
    (state: RootState) => {
      return {
        emailVerified: state.firebase.auth.emailVerified,
        requested: state.firestore.status.requested["users/" + auth.uid],
        finishProfile: state.firestore.data.users?.[auth.uid]?.finishProfile,
        role: state.firestore.data.users?.[auth.uid]?.role,
      };
    }
  );
  useEffect(() => {
    if (requested === true) {
      if (finishProfile === true) {
        if (role === "student" && !emailVerified) {
          firebase.auth().currentUser?.sendEmailVerification();
          setProfileState(ProfileState.VerifyEmail);
        } else {
          setProfileState(ProfileState.Valid);
        }
      } else {
        setProfileState(ProfileState.Redirect);
      }
    }
  }, [requested, finishProfile, emailVerified, role, firebase]);
  useEffect(() => {
    if (profileState === ProfileState.Retry) {
      history.push("/register", { from: "main" });
    }
  }, [profileState, history]);
  switch (profileState) {
    case ProfileState.Valid:
      return <React.Fragment>{children}</React.Fragment>;
    case ProfileState.VerifyEmail:
      return (
        <DialogLayout
          title="Verify Your Email"
          body={
            <>
              {
                "Check your email for a link to verify your status as a student. Click "
              }
              <MaterialLink
                style={{ cursor: "pointer" }}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
                  e.preventDefault();
                  firebase.auth().currentUser?.sendEmailVerification();
                }}
              >
                here
              </MaterialLink>
              {
                " to resend verification email. The email may take a while to arrive."
              }
            </>
          }
          buttonOptions={{
            path: "/main",
            text: "Sign Out",
            onClick: (): void => {
              firebase.logout();
            },
          }}
        />
      );
    case ProfileState.Redirect:
      setProfileState(ProfileState.Retry);
      break;
  }
  return <LoadingScreen />;
};

interface ExclusiveRouteProps {
  path: string;
  type: "public" | "private";
}

const ExclusiveRoute: React.FC<ExclusiveRouteProps> = ({
  children,
  type,
  ...rest
}) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  if (!isLoaded(auth)) return <LoadingScreen />;
  return (
    <Route
      {...rest}
      render={(): React.ReactNode => {
        if (type === "public") {
          return isEmpty(auth) ? children : <Redirect to="/main" />;
        }
        if (isEmpty(auth)) {
          return <Redirect to="/login" />;
        }
        return (
          <React.Fragment>
            <FinishProfileChecker auth={auth}>{children}</FinishProfileChecker>
            <Redirect to="/main/dashboard" />
          </React.Fragment>
        );
      }}
    />
  );
};

export default ExclusiveRoute;
