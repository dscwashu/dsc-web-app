import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPassword from "./ForgotPassword";
import { useFirebase } from "react-redux-firebase";
jest.mock("react-redux-firebase");

describe("ForgotPassword validation", () => {
  it("should error on blur with invalid email", () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    userEvent.type(getByLabelText("Email"), "invalidemail");
    fireEvent.blur(getByLabelText("Email"));
    expect(getByText("Invalid email")).toBeInTheDocument();
  });
  it("should remove 'Invalid email' on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    userEvent.type(getByLabelText("Email"), "invalidemail");
    fireEvent.blur(getByLabelText("Email"));
    expect(getByText("Invalid email")).toBeInTheDocument();
    userEvent.type(getByLabelText("Email"), "typing");
    expect(queryByText("Invalid email")).not.toBeInTheDocument();
  });
  it("should ask to enter  email on submit", () => {
    const { getByText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter an email")).toBeInTheDocument();
  });
  it("should remove 'please enter' error on type", () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter an email")).toBeInTheDocument();
    userEvent.type(getByLabelText("Email"), "typing");
    expect(queryByText("Please enter an email")).not.toBeInTheDocument();
  });
  it("should show 'Invalid email' on invalid submit", () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    userEvent.type(getByLabelText("Email"), "invalidemail");
    fireEvent.click(getByText("Next"));
    expect(getByText("Invalid email")).toBeInTheDocument();
  });
  it("should show 'Invalid email or password' on bad request", async () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    (useFirebase as any).mockReturnValue({
      resetPassword: () => Promise.reject(),
    });
    userEvent.type(getByLabelText("Email"), "asdf@gmail.com");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(getByText("Email not found")).toBeInTheDocument()
    );
  });
  it("should go to next dialog after successful request", async () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    (useFirebase as any).mockReturnValue({
      resetPassword: () => Promise.resolve(),
    });
    userEvent.type(getByLabelText("Email"), "asdf@gmail.com");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(getByText("Check Your Email")).toBeInTheDocument()
    );
  });
});
