import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoaded, isEmpty, useFirestoreConnect } from "react-redux-firebase";

import { RootState } from "../app/rootReducer";
import LoadingScreen from "./LoadingScreen";

interface ExclusiveRouteProps {
  path: string;
  type: "public" | "private";
}

// Refactor this
let number = 0;

const ExclusiveRoute: React.FC<ExclusiveRouteProps> = ({
  children,
  type,
  ...rest
}) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const userStorageId = "users/" + auth.uid + number;
  useFirestoreConnect([
    { collection: "users", doc: auth.uid, storeAs: userStorageId },
  ]);
  const { status, finishProfile } = useSelector((state: RootState) => {
    return {
      status: state.firestore.status.requesting[userStorageId],
      finishProfile: state.firestore.data[userStorageId]?.finishProfile,
    };
  });
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
        if (finishProfile === undefined || status === true) {
          return <LoadingScreen />;
        }
        if (finishProfile === false) {
          number++;
          return (
            <Redirect
              to={{ pathname: "/register", state: { from: "dashboard" } }}
            />
          );
        }
        return children;
      }}
    />
  );
};

export default ExclusiveRoute;
