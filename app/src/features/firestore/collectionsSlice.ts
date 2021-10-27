import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../app/store";
import {
  QuerySnapshot,
  WhereFilterOp,
  FieldPath,
  Firestore,
  DocumentData,
  Query,
} from "../../types";
import { docSnapshotCache } from "./documentsSlice";

export const querySnapshotCache: Record<string, QuerySnapshot[]> = {};

export type CollectionQuery = {
  collection: string;
  where?: [string | FieldPath, WhereFilterOp, any];
  orderBy?: [string | FieldPath, "asc" | "desc" | undefined];
  limit: number;
};

export type FetchCollectionQuery = {
  firestore: Firestore;
  settings: CollectionQuery;
  expire: number;
  queryName: string;
};

export type ExtendCollectionQuery = {
  firestore: Firestore;
  settings: CollectionQuery;
  queryName: string;
};

export type ReloadCollectionPageQuery = {
  firestore: Firestore;
  settings: CollectionQuery;
  queryName: string;
  page: number;
};

type QuerySnapshotData = {
  status: "pending" | "fulfilled" | "rejected";
  error?: string;
  data?: DocumentData[];
};

interface QueriesState {
  [collection: string]: {
    [queryName: string]: {
      timestamp?: number;
      invalid?: boolean;
      snapshots?: QuerySnapshotData[];
    };
  };
}

const initialState: QueriesState = {};

const collectionsSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    fetchCollectionStart: (
      state,
      action: PayloadAction<{ collection: string; queryName: string }>
    ): void => {
      const { collection, queryName } = action.payload;
      Object.assign(state[collection][queryName].snapshots?.[0], {
        status: "pending",
      });
    },
    fetchCollectionFulfilled: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        data: QuerySnapshot;
      }>
    ): void => {
      const { collection, queryName, data } = action.payload;
      Object.assign(state[collection][queryName], {
        timestamp: Date.now(),
        invalid: false,
      });
      const dataArr: DocumentData[] = [];
      data.forEach((doc) => {
        dataArr.push(doc.data());
      });
      Object.assign(state[collection][queryName].snapshots?.[0], {
        status: "fulfilled",
        data: dataArr,
      });
    },
    fetchCollectionRejected: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        error: string;
      }>
    ): void => {
      const { collection, queryName, error } = action.payload;
      Object.assign(state[collection][queryName].snapshots?.[0], {
        status: "rejected",
        error: error,
      });
    },
    extendCollectionStart: (
      state,
      action: PayloadAction<{ collection: string; queryName: string }>
    ): void => {
      const { collection, queryName } = action.payload;
      const snapshots = state[collection][queryName].snapshots;
      Object.assign(snapshots?.[snapshots.length - 1], {
        status: "pending",
      });
    },
    extendCollectionFulfilled: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        data: QuerySnapshot;
      }>
    ): void => {
      const { collection, queryName, data } = action.payload;
      const snapshots = state[collection][queryName].snapshots;
      const dataArr: DocumentData[] = [];
      data.forEach((doc) => {
        dataArr.push(doc.data());
      });
      Object.assign(snapshots?.[snapshots.length - 1], {
        status: "fulfilled",
        data: dataArr,
      });
    },
    extendCollectionRejected: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        error: string;
      }>
    ): void => {
      const { collection, queryName, error } = action.payload;
      const snapshots = state[collection][queryName].snapshots;
      Object.assign(snapshots?.[snapshots.length - 1], {
        status: "rejected",
        error: error,
      });
    },
    reloadCollectionPageStart: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        page: number;
      }>
    ): void => {
      const { collection, queryName, page } = action.payload;
      const snapshots = state[collection][queryName].snapshots;
      Object.assign(snapshots?.[page], {
        status: "pending",
      });
    },
    reloadCollectionPageFulfilled: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        page: number;
        data: QuerySnapshot;
      }>
    ): void => {
      const { collection, queryName, data, page } = action.payload;
      const snapshots = state[collection][queryName].snapshots;
      const dataArr: DocumentData[] = [];
      data.forEach((doc) => {
        dataArr.push(doc.data());
      });
      Object.assign(snapshots?.[page], {
        status: "fulfilled",
        data: dataArr,
      });
    },
    reloadCollectionPageRejected: (
      state,
      action: PayloadAction<{
        collection: string;
        queryName: string;
        page: number;
        error: string;
      }>
    ): void => {
      const { collection, queryName, error, page } = action.payload;
      const snapshots = state[collection][queryName].snapshots;
      Object.assign(snapshots?.[page], {
        status: "rejected",
        error: error,
      });
    },
    invalidateCollection: (state, action): void => {
      const { collection, doc } = action.payload;
      state[collection][doc].invalid = true;
    },
  },
});

export const {
  fetchCollectionStart,
  fetchCollectionFulfilled,
  fetchCollectionRejected,
  extendCollectionStart,
  extendCollectionFulfilled,
  extendCollectionRejected,
  invalidateCollection,
  reloadCollectionPageStart,
  reloadCollectionPageFulfilled,
  reloadCollectionPageRejected,
} = collectionsSlice.actions;

export const fetchCollection = ({
  firestore,
  settings,
  expire,
  queryName,
}: FetchCollectionQuery): AppThunk => {
  return (dispatch, getState): Promise<QuerySnapshot> => {
    const { collection, where, orderBy, limit } = settings;
    const query = getState().firestore.collections[collection]?.[queryName];
    if (
      query &&
      query.invalid !== true &&
      query.timestamp &&
      query.snapshots &&
      Date.now() - query.timestamp <= expire
    ) {
      const firstSnapshot = query.snapshots?.[0];
      if (firstSnapshot) {
        const { status } = firstSnapshot;
        if (status === "fulfilled") {
          return Promise.resolve(
            querySnapshotCache[`${collection}/${queryName}`][0]
          );
        }
      }
    }
    dispatch(fetchCollectionStart({ collection, queryName }));
    let queryRef: Query = firestore.collection(collection);
    if (where) queryRef = queryRef.where(where[0], where[1], where[2]);
    if (orderBy) queryRef = queryRef.orderBy(orderBy[0], orderBy[1]);
    queryRef = queryRef.limit(limit);
    return queryRef
      .get()
      .then((querySnapshot) => {
        querySnapshotCache[`${collection}/${queryName}`] = [querySnapshot];
        querySnapshot.forEach((doc) => {
          docSnapshotCache[`${collection}/${doc.id}`] = doc;
        });
        dispatch(
          fetchCollectionFulfilled({
            collection,
            queryName,
            data: querySnapshot,
          })
        );
        return Promise.resolve(querySnapshot);
      })
      .catch((error) => {
        dispatch(
          fetchCollectionRejected({
            collection,
            queryName,
            error: error.message,
          })
        );
        return Promise.reject(error.message);
      });
  };
};

export const extendCollection = ({
  firestore,
  settings,
  queryName,
}: ExtendCollectionQuery): AppThunk => {
  return (dispatch, getState): Promise<QuerySnapshot> => {
    const { collection, where, orderBy, limit } = settings;
    const snapshots = getState().firestore.collections[collection]?.[queryName]
      .snapshots;
    if (!snapshots) return Promise.reject("No snapshots available");
    if (snapshots[snapshots.length - 1].status !== "fulfilled")
      return Promise.reject(
        "Cannot extend query if last snapshot unsuccessful"
      );
    dispatch(extendCollectionStart({ collection, queryName }));
    let queryRef: Query = firestore.collection(collection);
    if (where) queryRef = queryRef.where(where[0], where[1], where[2]);
    if (orderBy) queryRef = queryRef.orderBy(orderBy[0], orderBy[1]);
    queryRef = queryRef.limit(limit);
    const lastQueryData = snapshots[snapshots.length - 1].data;
    const lastDocumentData = lastQueryData?.[lastQueryData.length - 1];
    if (!lastDocumentData) return Promise.reject("Reached end of collection");
    queryRef = queryRef.startAt(lastDocumentData);
    return queryRef
      .get()
      .then((querySnapshot) => {
        querySnapshotCache[`${collection}/${queryName}`].push(querySnapshot);
        querySnapshot.forEach((doc) => {
          docSnapshotCache[`${collection}/${doc.id}`] = doc;
        });
        dispatch(
          extendCollectionFulfilled({
            collection,
            queryName,
            data: querySnapshot,
          })
        );
        return Promise.resolve(querySnapshot);
      })
      .catch((error) => {
        dispatch(
          extendCollectionRejected({
            collection,
            queryName,
            error: error.message,
          })
        );
        return Promise.reject(error.message);
      });
  };
};

export const reloadCollectionPage = ({
  firestore,
  settings,
  queryName,
  page,
}: ReloadCollectionPageQuery): AppThunk => {
  return (dispatch, getState): Promise<QuerySnapshot> => {
    const { collection, where, orderBy, limit } = settings;
    const snapshots = getState().firestore.collections[collection]?.[queryName]
      .snapshots;
    if (!snapshots) return Promise.reject("No snapshots available");
    if (page > snapshots.length - 1)
      return Promise.reject("Index out of bounds");
    if (snapshots[page].status !== "rejected")
      return Promise.reject("Page was not rejected and does not need reload");
    dispatch(reloadCollectionPageStart({ collection, queryName, page }));
    let queryRef: Query = firestore.collection(collection);
    if (where) queryRef = queryRef.where(where[0], where[1], where[2]);
    if (orderBy) queryRef = queryRef.orderBy(orderBy[0], orderBy[1]);
    queryRef = queryRef.limit(limit);
    const beforeQueryData = snapshots[page - 1].data;
    const beforeDocumentData = beforeQueryData?.[beforeQueryData.length - 1];
    if (!beforeDocumentData)
      return Promise.reject("No documents in page before index");
    queryRef = queryRef.startAt(beforeDocumentData);
    return queryRef
      .get()
      .then((querySnapshot) => {
        querySnapshotCache[`${collection}/${queryName}`][page] = querySnapshot;
        querySnapshot.forEach((doc) => {
          docSnapshotCache[`${collection}/${doc.id}`] = doc;
        });
        dispatch(
          reloadCollectionPageFulfilled({
            collection,
            queryName,
            page,
            data: querySnapshot,
          })
        );
        return Promise.resolve(querySnapshot);
      })
      .catch((error) => {
        dispatch(
          reloadCollectionPageRejected({
            collection,
            queryName,
            page,
            error: error.message,
          })
        );
        return Promise.reject(error.message);
      });
  };
};

export default collectionsSlice.reducer;
