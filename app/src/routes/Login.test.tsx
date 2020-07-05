import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { useFirebase } from "react-redux-firebase";
jest.mock("react-redux-firebase");

describe("Login validation", () => {
  it("should error on blur with invalid email", () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <Login />
      </Router>
    );
    userEvent.type(getByLabelText("Email"), "invalidemail");
    fireEvent.blur(getByLabelText("Email"));
    expect(getByText("Invalid email")).toBeInTheDocument();
  });
  it("should remove 'Invalid email' on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <Router>
        <Login />
      </Router>
    );
    userEvent.type(getByLabelText("Email"), "invalidemail");
    fireEvent.blur(getByLabelText("Email"));
    expect(getByText("Invalid email")).toBeInTheDocument();
    userEvent.type(getByLabelText("Email"), "typing");
    expect(queryByText("Invalid email")).not.toBeInTheDocument();
  });
  it("should ask to enter email and password on submit", () => {
    const { getByText } = render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter an email")).toBeInTheDocument();
    expect(getByText("Please enter a password")).toBeInTheDocument();
  });
  it("should remove 'please enter' errors on type", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter an email")).toBeInTheDocument();
    expect(getByText("Please enter a password")).toBeInTheDocument();
    userEvent.type(getByLabelText("Email"), "typing");
    userEvent.type(getByLabelText("Password"), "typing");
    expect(queryByText("Please enter an email")).not.toBeInTheDocument();
    expect(queryByText("Please enter a password")).not.toBeInTheDocument();
  });
  it("should show 'Invalid email' on invalid submit", () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <Login />
      </Router>
    );
    userEvent.type(getByLabelText("Email"), "invalidemail");
    userEvent.type(getByLabelText("Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Invalid email")).toBeInTheDocument();
  });
  it("should show 'Invalid email or password' on bad request", async () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <Login />
      </Router>
    );
    (useFirebase as any).mockReturnValue({ login: () => Promise.reject() });
    userEvent.type(getByLabelText("Email"), "asdf@gmail.com");
    userEvent.type(getByLabelText("Password"), "typing");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(getByText("Invalid email or password")).toBeInTheDocument()
    );
  });
  it("should show no error on successful request", async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Router>
        <Login />
      </Router>
    );
    (useFirebase as any).mockReturnValue({
      login: () => Promise.resolve(),
    });
    userEvent.type(getByLabelText("Email"), "asdf@gmail.com");
    userEvent.type(getByLabelText("Password"), "typing");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(queryByText("Invalid email or password")).not.toBeInTheDocument()
    );
  });
});
