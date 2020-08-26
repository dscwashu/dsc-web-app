declare module "redux-firestore/es/utils/query" {
  export function getQueryName(
    query: import("react-redux-firebase").ReduxFirestoreQuerySetting
  ): string;
  export function getSnapshotByObject(object: any): any;
}
