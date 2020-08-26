import React, { useState, createContext, useCallback } from "react";
import {
  useFirestoreConnect,
  ReduxFirestoreQuerySetting,
  useFirestore,
} from "react-redux-firebase";
import { getQueryName } from "redux-firestore/es/utils/query";

import { Link } from "react-router-dom";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import { DocumentSnapshot } from "@firebase/firestore-types";
import { BreadcrumbsItem, SnackbarInfo } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      position: "relative",
    },
    breadcrumbs: {
      padding: theme.spacing(3),
      zIndex: 100,
    },
    content: {
      flexGrow: 1,
    },
    footer: {
      display: "flex",
      padding: theme.spacing(3),
      flexDirection: "row",
    },
    copyright: {
      flexGrow: 1,
    },
    terms: {
      marginLeft: theme.spacing(3),
    },
  })
);

export const MainLayoutContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSnackbarOpen: (type: "error" | "success", text: string): void => {
    console.error("handleSnackbarOpen was used outside of MainLayoutContext");
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setBreadcrumbs: (breadcrumbs: BreadcrumbsItem[]) => {
    console.error("setBreadcrumbs was used outside of MainLayoutContext");
  },
  addListeners: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    newListeners: ReduxFirestoreQuerySetting[] | undefined
  ): void => {
    console.error("addListeners was used outside of MainLayoutContext");
  },
  removeListeners: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    newListeners: ReduxFirestoreQuerySetting[] | undefined
  ): void => {
    console.error("removeListeners was used outside of MainLayoutContext");
  },
  getCache: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    newQueries: ReduxFirestoreQuerySetting[] | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expire: number
  ): Promise<DocumentSnapshot>[] | void => {
    console.error("getCache was used outside of MainLayoutContext");
  },
});

const MainLayout: React.FC = ({ children }) => {
  const classes = useStyles();

  const [listeners, setListeners] = useState<
    Record<string, ReduxFirestoreQuerySetting>
  >({});
  const [queries, setQueries] = useState<Record<string, number>>({});
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>({
    open: false,
    type: "error",
    text: "",
  });
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsItem[]>([]);

  const firestore = useFirestore();

  const handleSnackbarOpen = (
    type: "error" | "success",
    text: string
  ): void => {
    setSnackbarInfo({
      open: true,
      type,
      text,
    });
  };

  const handleSnackbarClose = (): void => {
    setSnackbarInfo((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const addListeners = useCallback(
    (newListeners: ReduxFirestoreQuerySetting[] | undefined): void => {
      setListeners((prev) => {
        if (!newListeners) return prev;
        const listenersClone = Object.assign({}, prev);
        for (let i = 0; i < newListeners.length; i++) {
          const queryName = getQueryName(newListeners[i]);
          if (queryName in prev) continue;
          listenersClone[queryName] = newListeners[i];
        }
        return listenersClone;
      });
    },
    []
  );

  // useEffect(() => {
  //   console.log("listeners", listeners);
  // }, [listeners]);

  // useEffect(() => {
  //   console.log("queries", queries);
  // }, [queries]);

  const removeListeners = useCallback(
    (newListeners: ReduxFirestoreQuerySetting[] | undefined): void => {
      setListeners((prev) => {
        if (!newListeners) return prev;
        const listenersClone = Object.assign({}, prev);
        for (let i = 0; i < newListeners.length; i++) {
          const queryName = getQueryName(newListeners[i]);
          if (queryName in prev) {
            delete listenersClone[queryName];
          }
        }
        return listenersClone;
      });
    },
    []
  );

  const getCache = useCallback(
    (
      newQueries: ReduxFirestoreQuerySetting[] | undefined,
      expire: number
    ): Promise<DocumentSnapshot>[] | void => {
      const queriesResponses: Promise<DocumentSnapshot>[] = [];
      if (!newQueries) return;
      const queriesClone = Object.assign({}, queries);
      for (let i = 0; i < newQueries.length; i++) {
        const queryName = getQueryName(newQueries[i]);
        if (queryName in queriesClone) {
          if (Date.now() - queriesClone[queryName] > expire) {
            queriesClone[queryName] = Date.now();
            queriesResponses.push(firestore.get(newQueries[i]));
          } else {
            continue;
          }
        } else {
          queriesClone[queryName] = Date.now();
          queriesResponses.push(firestore.get(newQueries[i]));
        }
      }
      setQueries(queriesClone);
      return queriesResponses;
    },
    [firestore, queries]
  );

  useFirestoreConnect(Object.values(listeners));

  return (
    <MainLayoutContext.Provider
      value={{
        handleSnackbarOpen,
        setBreadcrumbs,
        addListeners,
        removeListeners,
        getCache,
      }}
    >
      <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          {breadcrumbs.map((element: BreadcrumbsItem, index: number) =>
            index === breadcrumbs.length - 1 ? (
              <Typography key={index} color="textPrimary">
                {element.text}
              </Typography>
            ) : (
              <MaterialLink
                key={index}
                component={Link}
                color="textSecondary"
                to={element.link}
              >
                {element.text}
              </MaterialLink>
            )
          )}
        </Breadcrumbs>
        <div className={classes.content}>{children}</div>
        <footer className={classes.footer}>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.copyright}
          >
            &copy;2020 DSC WashU. All rights reserved.
          </Typography>
          <MaterialLink
            color="textSecondary"
            variant="caption"
            href="https://www.dscwashu.com/privacy"
          >
            Privacy
          </MaterialLink>
          <MaterialLink
            color="textSecondary"
            variant="caption"
            href="https://www.dscwashu.com/termsandconditions"
            className={classes.terms}
          >
            Terms
          </MaterialLink>
        </footer>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={snackbarInfo.open}
          onClose={handleSnackbarClose}
          autoHideDuration={8000}
        >
          <Alert
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarInfo.type}
          >
            {snackbarInfo.text}
          </Alert>
        </Snackbar>
      </div>
    </MainLayoutContext.Provider>
  );
};

export default MainLayout;
