import React, { useState } from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Switch, Redirect } from "react-router-dom";
import { Location } from "history";
import ExclusiveRoute, { FinishProfileChecker } from "./ExclusiveRoute";
import * as redux from "react-redux";
import { useSelector, Provider } from "react-redux";
import rootReducer from "../app/rootReducer";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import * as rrf from "react-redux-firebase";
jest.spyOn(redux, "useSelector").mockImplementation(jest.fn());
jest.spyOn(rrf, "useFirestoreConnect").mockImplementation(jest.fn());

describe("Exclusive route handling", () => {
  it("should show loading screen if auth is loading", () => {
    (useSelector as any).mockReturnValue({
      isLoaded: false,
      isEmpty: false,
    });
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ExclusiveRoute path="/dashboard" type="private" />
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
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Switch>
          <ExclusiveRoute path="/dashboard" type="private" />
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
  it("should redirect to dashboard if auth is not empty and route is public", async () => {
    (useSelector as any).mockReturnValue({
      isLoaded: true,
      isEmpty: false,
    });
    let redirectLocation: Location;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Switch>
          <ExclusiveRoute path="/login" type="public" />
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
    await waitFor(() =>
      expect(redirectLocation.pathname).toEqual("/dashboard")
    );
  });
  it("should return children if auth is empty and route is public", async () => {
    (useSelector as any).mockReturnValue({
      isLoaded: true,
      isEmpty: true,
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <ExclusiveRoute path="/login" type="public">
          <div>Hello</div>
        </ExclusiveRoute>
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Hello")).toBeInTheDocument());
  });
  it("should show loading screen if profile is loading", async () => {
    (useSelector as any).mockReturnValue({
      requested: false,
      finishProfile: undefined,
    });
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Route
          path="/dashboard"
          render={(): React.ReactNode => {
            return (
              <FinishProfileChecker
                auth={{} as rrf.FirebaseReducer.AuthState}
              />
            );
          }}
        />
      </MemoryRouter>
    );
    expect(getByTestId("progress")).toBeInTheDocument();
  });
  it("should redirect to register edit profile if profile loaded and finishProfile is false", async () => {
    (useSelector as any).mockReturnValue({
      requested: true,
      finishProfile: false,
    });
    let redirectLocation: Location;
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Switch>
          <Route
            path="/dashboard"
            render={(): React.ReactNode => {
              return (
                <FinishProfileChecker
                  auth={{} as rrf.FirebaseReducer.AuthState}
                />
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
  it("should return children if profile loaded and finishProfile is true", async () => {
    (useSelector as any).mockReturnValue({
      requested: true,
      finishProfile: true,
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Route
          path="/dashboard"
          render={(): React.ReactNode => {
            return (
              <FinishProfileChecker auth={{} as rrf.FirebaseReducer.AuthState}>
                <div>Hello</div>
              </FinishProfileChecker>
            );
          }}
        />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Hello")).toBeInTheDocument());
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
    store.dispatch({
      type: "@@reduxFirestore/LISTENER_RESPONSE",
      meta: {
        collection: "users",
        doc: "testuser",
      },
      payload: {
        data: {
          testuser: {
            finishProfile: false,
          },
        },
        order: [
          {
            id: "testuser",
            finishProfile: false,
          },
        ],
      },
      merge: {
        docs: true,
        collections: true,
      },
    });
    const EditProfileMock: React.FC = () => {
      const [redirect, setRedirect] = useState(false);
      if (redirect) return <Redirect to="/dashboard" />;
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
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Switch>
            <Route
              path="/dashboard"
              render={(): React.ReactNode => {
                return (
                  <FinishProfileChecker
                    auth={{ uid: "testuser" } as rrf.FirebaseReducer.AuthState}
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
    fireEvent.click(getByText("Redirect"));
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
    store.dispatch({
      type: "@@reduxFirestore/LISTENER_RESPONSE",
      meta: {
        collection: "users",
        doc: "testuser",
      },
      payload: {
        data: {
          testuser: {
            finishProfile: false,
          },
        },
        order: [
          {
            id: "testuser",
            finishProfile: false,
          },
        ],
      },
      merge: {
        docs: true,
        collections: true,
      },
    });
    await waitFor(() => expect(queryByText("Hello")).not.toBeInTheDocument());
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
    fireEvent.click(getByText("Redirect"));
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
    store.dispatch({
      type: "@@reduxFirestore/LISTENER_RESPONSE",
      meta: {
        collection: "users",
        doc: "testuser",
      },
      payload: {
        data: {
          testuser: {
            finishProfile: true,
          },
        },
        order: [
          {
            id: "testuser",
            finishProfile: true,
          },
        ],
      },
      merge: {
        docs: true,
        collections: true,
      },
    });
    await waitFor(() => expect(getByText("Hello")).toBeInTheDocument());
  });
});
