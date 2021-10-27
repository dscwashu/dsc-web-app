import { combineReducers } from "@reduxjs/toolkit";
import documentsReducer from "./documentsSlice";
import collectionsReducer from "./collectionsSlice";

const firestoreReducer = combineReducers({
  collections: collectionsReducer,
  documents: documentsReducer,
});

export default firestoreReducer;
