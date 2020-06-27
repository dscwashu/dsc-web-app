import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { RootState } from "../app/rootReducer";
import LoadingDashboard from "./LoadingDashboard";

interface PrivateRouteProps {
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  console.log(auth);
  if (!isLoaded(auth)) return <LoadingDashboard />;
  return (
    <Route
      {...rest}
      render={(): React.ReactNode =>
        !isEmpty(auth) ? children : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
