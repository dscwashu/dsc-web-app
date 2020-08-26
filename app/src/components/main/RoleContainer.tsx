import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/rootReducer";

interface RoleContainerProps {
  role: "student" | "org";
  admin?: boolean;
}

const RoleContainer: React.FC<RoleContainerProps> = ({
  role,
  admin,
  children,
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
        return <React.Fragment>{children}</React.Fragment>;
      }
      return null;
    }
    return <React.Fragment>{children}</React.Fragment>;
  }
  return null;
};

export default RoleContainer;
