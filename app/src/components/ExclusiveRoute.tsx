import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  isLoaded,
  isEmpty,
  FirebaseReducer,
  useFirestoreConnect,
} from "react-redux-firebase";

import { RootState } from "../app/rootReducer";
import LoadingScreen from "./LoadingScreen";

interface FinishProfileCheckerProps {
  auth: FirebaseReducer.AuthState;
}

enum ProfileState {
  Loading,
  Retry,
  Redirect,
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
  useFirestoreConnect([{ collection: "users", doc: auth.uid }]);
  const { requested, finishProfile } = useSelector((state: RootState) => {
    return {
      requested: state.firestore.status.requested["users/" + auth.uid],
      finishProfile: state.firestore.data.users?.[auth.uid]?.finishProfile,
    };
  });
  useEffect(() => {
    if (requested === true) {
      if (finishProfile === true) {
        setProfileState(ProfileState.Valid);
      } else {
        setProfileState(ProfileState.Redirect);
      }
    }
  }, [requested, finishProfile]);
  useEffect(() => {
    if (profileState === ProfileState.Retry) {
      history.push("/register", { from: "dashboard" });
    }
  }, [profileState, history]);
  switch (profileState) {
    case ProfileState.Valid:
      return <React.Fragment>{children}</React.Fragment>;
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
          return isEmpty(auth) ? children : <Redirect to="/dashboard" />;
        }
        if (isEmpty(auth)) {
          return <Redirect to="/login" />;
        }
        return (
          <FinishProfileChecker auth={auth}>{children}</FinishProfileChecker>
        );
      }}
    />
  );
};

export default ExclusiveRoute;
