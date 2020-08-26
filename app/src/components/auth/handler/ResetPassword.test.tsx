import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "./ResetPassword";
import { useFirebase } from "react-redux-firebase";
jest.mock("react-redux-firebase");

describe("ResetPassword validation", () => {
  it("should error on blur with short password", () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <ResetPassword oobCode="123" setResetState={jest.fn()} />
      </Router>
    );
    userEvent.type(getByLabelText("New Password"), "short");
    fireEvent.blur(getByLabelText("New Password"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
  });
  it("should remove short password errors on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <Router>
        <ResetPassword oobCode="123" setResetState={jest.fn()} />
      </Router>
    );
    userEvent.type(getByLabelText("New Password"), "short");
    fireEvent.blur(getByLabelText("New Password"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
    userEvent.type(getByLabelText("New Password"), "typing");
    expect(
      queryByText("Password is less than 6 characters")
    ).not.toBeInTheDocument();
  });
  it("should show error on password mismatch", () => {
    const { getByLabelText, getByText } = render(
      <Router>
        <ResetPassword oobCode="123" setResetState={jest.fn()} />
      </Router>
    );
    userEvent.type(getByLabelText("New Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.blur(getByLabelText("Confirm Password"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
  });
  it("should remove password mismatch error on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <Router>
        <ResetPassword oobCode="123" setResetState={jest.fn()} />
      </Router>
    );
    userEvent.type(getByLabelText("New Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.blur(getByLabelText("Confirm Password"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.type(getByLabelText("Confirm Password"), "typing");
    expect(queryByText("Passwords don't match")).not.toBeInTheDocument();
    fireEvent.blur(getByLabelText("Confirm Password"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.type(getByLabelText("New Password"), "typing");
    expect(queryByText("Passwords don't match")).not.toBeInTheDocument();
  });
  it("should show error on bad response", async () => {
    (useFirebase as any).mockReturnValue({
      confirmPasswordReset: () => Promise.reject(),
    });
    const { getByText, getByLabelText } = render(
      <Router>
        <ResetPassword oobCode="123" setResetState={jest.fn()} />
      </Router>
    );
    userEvent.type(getByLabelText("New Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(
        getByText("Error resetting password. Please try again later.")
      ).toBeInTheDocument()
    );
  });
  it("should not fire api and show correct errors if not formatted correctly on submit", async () => {
    const confirmPasswordResetMock = jest.fn();
    (useFirebase as any).mockReturnValue({
      confirmPasswordReset: confirmPasswordResetMock,
    });
    const { getByText, getByLabelText } = render(
      <Router>
        <ResetPassword oobCode="123" setResetState={jest.fn()} />
      </Router>
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter a password")).toBeInTheDocument();
    userEvent.type(getByLabelText("New Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Please confirm your password")).toBeInTheDocument();
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.click(getByText("Next"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.clear(getByLabelText("New Password"));
    userEvent.clear(getByLabelText("Confirm Password"));
    userEvent.type(getByLabelText("New Password"), "pass");
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
    expect(confirmPasswordResetMock).not.toHaveBeenCalled();
  });
});
