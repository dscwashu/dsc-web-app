import React, { useState } from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Switch, Redirect } from "react-router-dom";
import { Location } from "history";
import AuthRoute, { FinishProfileChecker } from "./AuthRoute";
import * as redux from "react-redux";
import { useSelector, Provider } from "react-redux";
import rootReducer from "../../app/rootReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useFirebase, FirebaseReducer } from "react-redux-firebase";
jest.spyOn(redux, "useSelector").mockImplementation(jest.fn());
jest.mock("react-redux-firebase", () => ({
  ...(jest.requireActual("react-redux-firebase") as Record<string, any>),
  useFirestoreConnect: jest.fn(),
  useFirebase: jest.fn(),
}));

describe("Exclusive route handling", () => {
  it("should show loading screen if auth is loading", () => {
    (useSelector as any).mockReturnValue({
      isLoaded: false,
      isEmpty: false,
    });
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/main"]}>
        <AuthRoute path="/main" type="private" />
      </MemoryRouter>
    );
    expect(getByTestId("progress")).toBeInTheDocument();
  });
  it("should redirect to login if auth is empty and route is private", async () => {
    (useSelector as any).mockReturnValue({
      isLoaded: true,
      isEmpty: true,
    });
    let redirectLocation: Location;
    render(
      <MemoryRouter initialEntries={["/main"]}>
        <Switch>
          <AuthRoute path="/main" type="private" />
          <Route
            path="*"
            render={({ location }): null => {
              redirectLocation = location;
              return null;
            }}
          />
        </Switch>
      </MemoryRouter>
    );
    await waitFor(() => expect(redirectLocation.pathname).toEqual("/login"));
  });
  it("should redirect to main if auth is not empty and route is public", async () => {
    (useSelector as any).mockReturnValue({
      isLoaded: true,
      isEmpty: false,
    });
    let redirectLocation: Location;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Switch>
          <AuthRoute path="/login" type="public" />
          <Route
            path="*"
            render={({ location }): null => {
              redirectLocation = location;
              return null;
            }}
          />
        </Switch>
      </MemoryRouter>
    );
    await waitFor(() => expect(redirectLocation.pathname).toEqual("/main"));
  });
  it("should return children if auth is empty and route is public", async () => {
    (useSelector as any).mockReturnValue({
      isLoaded: true,
      isEmpty: true,
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthRoute path="/login" type="public">
          <div>Hello</div>
        </AuthRoute>
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Hello")).toBeInTheDocument());
  });
  it("should show loading screen if profile is loading", async () => {
    (useSelector as any).mockReturnValue({
      requested: false,
      role: undefined,
    });
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/main"]}>
        <Route
          path="/main"
          render={(): React.ReactNode => {
            return (
              <FinishProfileChecker auth={{} as FirebaseReducer.AuthState} />
            );
          }}
        />
      </MemoryRouter>
    );
    expect(getByTestId("progress")).toBeInTheDocument();
  });
  it("should redirect to register edit profile if profile loaded and role is undefined", async () => {
    (useSelector as any).mockReturnValue({
      requested: true,
      role: undefined,
    });
    let redirectLocation: Location;
    render(
      <MemoryRouter initialEntries={["/main"]}>
        <Switch>
          <Route
            path="/main"
            render={(): React.ReactNode => {
              return (
                <FinishProfileChecker auth={{} as FirebaseReducer.AuthState} />
              );
            }}
          />
          <Route
            path="*"
            render={({ location }): null => {
              redirectLocation = location;
              return null;
            }}
          />
        </Switch>
      </MemoryRouter>
    );
    await waitFor(() => expect(redirectLocation.pathname).toEqual("/register"));
  });
  it("should return children if profile loaded and verified student/org", async () => {
    (useSelector as any).mockReturnValue({
      requested: true,
      role: "student",
      emailVerified: true,
    });
    (useFirebase as any).mockReturnValue({
      auth: () => {
        return {
          currentUser: null,
        };
      },
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["/main"]}>
        <Route
          path="/main"
          render={(): React.ReactNode => {
            return (
              <FinishProfileChecker auth={{} as FirebaseReducer.AuthState}>
                <div>Hello</div>
              </FinishProfileChecker>
            );
          }}
        />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Hello")).toBeInTheDocument());
    (useSelector as any).mockReturnValue({
      requested: true,
      role: "org",
      emailVerified: false,
    });
  });
  it("should return 'verify email' dialog if profile loaded and unverified student", async () => {
    (useSelector as any).mockReturnValue({
      requested: true,
      role: "student",
      emailVerified: false,
    });
    (useFirebase as any).mockReturnValue({
      auth: () => {
        return {
          currentUser: null,
        };
      },
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["/main"]}>
        <Route
          path="/main"
          render={(): React.ReactNode => {
            return (
              <FinishProfileChecker auth={{} as FirebaseReducer.AuthState}>
                <div>Hello</div>
              </FinishProfileChecker>
            );
          }}
        />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(getByText("Verify Your Email")).toBeInTheDocument()
    );
  });
  it("should be able to redirect back and forth if profile already loaded before", async () => {
    jest.restoreAllMocks();
    const store = configureStore({
      reducer: rootReducer,
      middleware: getDefaultMiddleware({
        serializableCheck: false,
      }),
    });
    store.dispatch({
      type: "@@reactReduxFirebase/AUTHENTICATION_INIT_STARTED",
    });
    store.dispatch({
      type: "@@reactReduxFirebase/AUTHENTICATION_INIT_FINISHED",
    });
    store.dispatch({
      type: "@@reactReduxFirebase/LOGIN",
      auth: {
        uid: "testuser",
      },
    });
    const setListenerMock = (): void => {
      store.dispatch({
        type: "@@reduxFirestore/SET_LISTENER",
        meta: {
          collection: "users",
          doc: "testuser",
        },
        payload: {
          name: "users/testuser",
        },
      });
    };
    const unsetListenerMock = (): void => {
      store.dispatch({
        type: "@@reduxFirestore/UNSET_LISTENER",
        meta: {
          collection: "users",
          doc: "testuser",
        },
        payload: {
          name: "users/testuser",
        },
      });
    };
    const listenerResponseMock = (isFinishedProfile: boolean): void => {
      store.dispatch({
        type: "@@reduxFirestore/LISTENER_RESPONSE",
        meta: {
          collection: "users",
          doc: "testuser",
        },
        payload: {
          data: {
            testuser: {
              profile: {
                role: isFinishedProfile ? "org" : undefined,
              },
            },
          },
          order: [
            {
              id: "testuser",
              profile: {
                role: isFinishedProfile ? "org" : undefined,
              },
            },
          ],
        },
        merge: {
          docs: true,
          collections: true,
        },
      });
    };
    setListenerMock();
    unsetListenerMock();
    listenerResponseMock(false);
    const EditProfileMock: React.FC = () => {
      const [redirect, setRedirect] = useState(false);
      if (redirect) return <Redirect to="/main" />;
      return (
        <button
          onClick={(): void => {
            setRedirect(true);
          }}
        >
          Redirect
        </button>
      );
    };
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Switch>
            <Route
              path="/main"
              render={(): React.ReactNode => {
                return (
                  <FinishProfileChecker
                    auth={{ uid: "testuser" } as FirebaseReducer.AuthState}
                  >
                    <div>Hello</div>
                  </FinishProfileChecker>
                );
              }}
            />
            <Route
              path="/register"
              render={(): React.ReactNode => {
                return <EditProfileMock />;
              }}
            />
          </Switch>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(getByText("Redirect")).toBeInTheDocument());
    unsetListenerMock();
    fireEvent.click(getByText("Redirect"));
    setListenerMock();
    listenerResponseMock(false);
    await waitFor(() => expect(queryByText("Hello")).not.toBeInTheDocument());
    unsetListenerMock();
    fireEvent.click(getByText("Redirect"));
    setListenerMock();
    listenerResponseMock(true);
    await waitFor(() => expect(getByText("Hello")).toBeInTheDocument());
  });
});
