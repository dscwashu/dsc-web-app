import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../app/store";
import {
  fetchCollectionFulfilled,
  extendCollectionFulfilled,
  reloadCollectionPageFulfilled,
} from "./collectionsSlice";
import {
  Firestore,
  DocumentSnapshot,
  DocumentData,
  QuerySnapshot,
} from "../../types";

export const docSnapshotCache: Record<string, DocumentSnapshot> = {};

export type DocumentQuery = {
  collection: string;
  doc: string;
};

export type FetchDocumentQuery = {
  firestore: Firestore;
  settings: DocumentQuery;
  expire: number;
};

interface DocumentsState {
  [collection: string]: {
    [doc: string]: {
      timestamp?: number;
      invalid?: boolean;
      status: "pending" | "fulfilled" | "rejected";
      error?: string;
      data?: DocumentData;
    };
  };
}

const initialState: DocumentsState = {};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    fetchDocumentStart: (state, action: PayloadAction<DocumentQuery>): void => {
      const { collection, doc } = action.payload;
      Object.assign(state[collection][doc], {
        status: "pending",
      });
    },
    fetchDocumentFulfilled: (
      state,
      action: PayloadAction<{
        settings: DocumentQuery;
        data?: DocumentData;
      }>
    ): void => {
      const {
        settings: { collection, doc },
        data,
      } = action.payload;
      Object.assign(state[collection][doc], {
        timestamp: Date.now(),
        invalid: false,
        status: "fulfilled",
        data: data,
      });
    },
    fetchDocumentRejected: (
      state,
      action: PayloadAction<{
        settings: DocumentQuery;
        error: string;
      }>
    ): void => {
      const {
        settings: { collection, doc },
        error,
      } = action.payload;
      Object.assign(state[collection][doc], {
        status: "rejected",
        error: error,
      });
    },
    invalidateDocument: (
      state,
      action: PayloadAction<{ collection: string; doc: string }>
    ): void => {
      const { collection, doc } = action.payload;
      state[collection][doc].invalid = true;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        fetchCollectionFulfilled.type,
        (
          state,
          action: PayloadAction<{
            collection: string;
            queryName: string;
            data: QuerySnapshot;
          }>
        ) => {
          const { collection, data } = action.payload;
          data.forEach((doc) => {
            Object.assign(state[collection][doc.id].data, doc.data());
          });
        }
      )
      .addCase(
        reloadCollectionPageFulfilled.type,
        (
          state,
          action: PayloadAction<{
            collection: string;
            queryName: string;
            page: number;
            data: QuerySnapshot;
          }>
        ) => {
          const { collection, data } = action.payload;
          data.forEach((doc) => {
            Object.assign(state[collection][doc.id].data, doc.data());
          });
        }
      )
      .addCase(
        extendCollectionFulfilled.type,
        (
          state,
          action: PayloadAction<{
            collection: string;
            queryName: string;
            data: QuerySnapshot;
          }>
        ) => {
          const { collection, data } = action.payload;
          data.forEach((doc) => {
            Object.assign(state[collection][doc.id].data, doc.data());
          });
        }
      ),
});

export const {
  fetchDocumentStart,
  fetchDocumentFulfilled,
  fetchDocumentRejected,
  invalidateDocument,
} = documentsSlice.actions;

export const fetchDocument = ({
  firestore,
  settings,
  expire,
}: FetchDocumentQuery): AppThunk => {
  return (dispatch, getState): Promise<DocumentSnapshot> => {
    const { collection, doc } = settings;
    const document = getState().firestore.documents[collection]?.[doc];
    if (
      document &&
      document.invalid !== true &&
      document.timestamp &&
      document.status === "fulfilled" &&
      Date.now() - document.timestamp <= expire
    ) {
      return Promise.resolve(docSnapshotCache[`${collection}/${doc}`]);
    }
    dispatch(fetchDocumentStart(settings));
    return firestore
      .collection(collection)
      .doc(doc)
      .get()
      .then((snapshot) => {
        docSnapshotCache[`${collection}/${doc}`] = snapshot;
        dispatch(fetchDocumentFulfilled({ settings, data: snapshot.data() }));
        return Promise.resolve(snapshot);
      })
      .catch((error) => {
        dispatch(fetchDocumentRejected({ settings, error: error.message }));
        return Promise.reject(error.message);
      });
  };
};

export default documentsSlice.reducer;
