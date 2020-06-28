import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";

import { RootState } from "../app/rootReducer";
import LoadingScreen from "./LoadingScreen";

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
        return !isEmpty(auth) ? children : <Redirect to="/login" />;
      }}
    />
  );
};

export default ExclusiveRoute;
