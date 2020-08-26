import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { RootState } from "../../app/rootReducer";

interface RoleRouteProps {
  role: "student" | "org";
  admin?: boolean;
}

const RoleRoute: React.FC<RoleRouteProps & RouteProps> = ({
  role,
  admin,
  children,
  ...rest
}) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const { role: firestoreRole, isAdmin } = useSelector((state: RootState) => {
    return {
      role: state.firestore.data.users?.[auth.uid]?.profile?.role,
      isAdmin: state.firestore.data.users?.[auth.uid]?.isAdmin,
    };
  });
  if (role === firestoreRole) {
    if (admin) {
      if (isAdmin === true) {
        return <Route {...rest}>{children}</Route>;
      }
      return <Redirect to="/main/dashboard" />;
    }
    return <Route {...rest}>{children}</Route>;
  }
  return <Redirect to="/main/dashboard" />;
};

export default RoleRoute;
