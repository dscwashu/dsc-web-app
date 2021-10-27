import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import firestoreReducer from "../features/firestore";

const rootReducer = combineReducers({
  auth: authReducer,
  firestore: firestoreReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
