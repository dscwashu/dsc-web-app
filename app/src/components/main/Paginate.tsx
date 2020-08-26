import React, { useState, useEffect, useRef } from "react";
import { ReduxFirestoreQuerySetting } from "react-redux-firebase";
import { useSelector } from "react-redux";
import {
  getQueryName,
  getSnapshotByObject,
} from "redux-firestore/es/utils/query";
import { RootState } from "../../app/rootReducer";
import { Application } from "../../types";

interface RenderProps {
  queries: ReduxFirestoreQuerySetting[];
  queriesNames: string[];
  expand: () => void;
  pageSize: number;
  collapse: () => void;
}

interface PaginateProps {
  baseQuery: ReduxFirestoreQuerySetting;
  pageSize: number;
  render: (props: RenderProps) => React.ReactElement<any, any> | null;
}

const Paginate: React.FC<PaginateProps> = ({ baseQuery, pageSize, render }) => {
  const [queries, setQueries] = useState<ReduxFirestoreQuerySetting[]>([]);
  const [queriesNames, setQueriesNames] = useState<string[]>([]);
  const baseQueryRef = useRef<string>("");

  const { latestQueryData } = useSelector((state: RootState) => ({
    latestQueryData:
      state.firestore.queries[queriesNames[queriesNames.length - 1]]?.data,
  }));

  useEffect(() => {
    if (baseQueryRef.current !== getQueryName(baseQuery)) {
      baseQueryRef.current = getQueryName(baseQuery);
      setQueries([
        {
          ...baseQuery,
          limit: pageSize,
        },
      ]);
    }
  }, [baseQuery, pageSize]);

  useEffect(() => {
    const queriesLength = queries.length;
    if (queriesLength > 0) {
      setQueriesNames((prev) => {
        if (prev.length < queriesLength) {
          const queryName = getQueryName(queries[queriesLength - 1]);
          return [...prev, queryName];
        }
        return prev.slice(0, queriesLength);
      });
    }
  }, [queries]);

  const collapse = (): void => {
    setQueries((prev) => {
      return prev.slice(0, 1);
    });
  };

  const expand = (): void => {
    if (latestQueryData) {
      const latestQueryDataArr: Application[] = Object.values(latestQueryData);
      const latestDocData = latestQueryDataArr.sort((a, b) => {
        if (a.info.createdAt && b.info.createdAt) {
          return b.info.createdAt.seconds - a.info.createdAt.seconds;
        }
        return 1;
      })[latestQueryDataArr.length - 1];
      const latestSnapshot = getSnapshotByObject(latestDocData);
      setQueries((prev) => {
        return [
          ...prev,
          {
            ...baseQuery,
            startAfter: latestSnapshot,
            limit: pageSize,
          },
        ];
      });
    }
  };
  return render({ queries, queriesNames, expand, pageSize, collapse });
};

export default Paginate;
