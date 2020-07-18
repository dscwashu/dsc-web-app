import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateAccount from "./CreateAccount";
import { useFirebase } from "react-redux-firebase";
jest.mock("react-redux-firebase");

describe("CreateAccount validation", () => {
  it("should error on blur with short password", () => {
    const { getByLabelText, getByText } = render(
      <CreateAccount handleBack={jest.fn()} handleNext={jest.fn()} role="" />
    );
    userEvent.type(getByLabelText("Password"), "short");
    fireEvent.blur(getByLabelText("Password"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
  });
  it("should remove 'short password' errors on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <CreateAccount handleBack={jest.fn()} handleNext={jest.fn()} role="" />
    );
    userEvent.type(getByLabelText("Password"), "short");
    fireEvent.blur(getByLabelText("Password"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
    userEvent.type(getByLabelText("Password"), "typing");
    expect(
      queryByText("Password is less than 6 characters")
    ).not.toBeInTheDocument();
  });
  it("should show error on password mismatch", () => {
    const { getByLabelText, getByText } = render(
      <CreateAccount handleBack={jest.fn()} handleNext={jest.fn()} role="" />
    );
    userEvent.type(getByLabelText("Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.blur(getByLabelText("Confirm Password"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
  });
  it("should remove 'password mismatch' error on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <CreateAccount handleBack={jest.fn()} handleNext={jest.fn()} role="" />
    );
    userEvent.type(getByLabelText("Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.blur(getByLabelText("Confirm Password"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.type(getByLabelText("Confirm Password"), "typing");
    expect(queryByText("Passwords don't match")).not.toBeInTheDocument();
    fireEvent.blur(getByLabelText("Confirm Password"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.type(getByLabelText("Password"), "typing");
    expect(queryByText("Passwords don't match")).not.toBeInTheDocument();
  });
  it("should show error on bad formatted email (WUSTL Email)", async () => {
    const { getByLabelText, getByText } = render(
      <CreateAccount
        handleBack={jest.fn()}
        handleNext={jest.fn()}
        role="student"
      />
    );
    userEvent.type(getByLabelText("WUSTL Email"), "bademail");
    fireEvent.blur(getByLabelText("WUSTL Email"));
    expect(getByText("Invalid @wustl.edu email")).toBeInTheDocument();
  });
  it("should show error on bad formatted email (Any Email)", async () => {
    const { getByLabelText, getByText } = render(
      <CreateAccount handleBack={jest.fn()} handleNext={jest.fn()} role="org" />
    );
    userEvent.type(getByLabelText("Email"), "bademail");
    fireEvent.blur(getByLabelText("Email"));
    expect(getByText("Invalid email")).toBeInTheDocument();
  });
  it("should show error on bad response", async () => {
    (useFirebase as any).mockReturnValue({
      createUser: () => Promise.reject({ message: "Error placeholder" }),
    });
    const { getByText, getByLabelText } = render(
      <CreateAccount
        handleBack={jest.fn()}
        handleNext={jest.fn()}
        role="student"
      />
    );
    userEvent.type(getByLabelText("WUSTL Email"), "test@wustl.edu");
    userEvent.type(getByLabelText("Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(getByText("Error placeholder")).toBeInTheDocument()
    );
  });
  it("should not fire api if not formatted correctly (WUSTL Email)", () => {
    const createUserMock = jest.fn();
    (useFirebase as any).mockReturnValue({
      createUser: createUserMock,
    });
    const { getByText, getByLabelText } = render(
      <CreateAccount
        handleBack={jest.fn()}
        handleNext={jest.fn()}
        role="student"
      />
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter an email")).toBeInTheDocument();
    expect(getByText("Please enter a password")).toBeInTheDocument();
    userEvent.type(getByLabelText("WUSTL Email"), "test");
    userEvent.type(getByLabelText("Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Please confirm your password")).toBeInTheDocument();
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Invalid @wustl.edu email")).toBeInTheDocument();
    userEvent.clear(getByLabelText("WUSTL Email"));
    userEvent.clear(getByLabelText("Password"));
    userEvent.clear(getByLabelText("Confirm Password"));
    userEvent.type(getByLabelText("WUSTL Email"), "test@wustl.edu");
    userEvent.type(getByLabelText("Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.click(getByText("Next"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.clear(getByLabelText("WUSTL Email"));
    userEvent.clear(getByLabelText("Password"));
    userEvent.clear(getByLabelText("Confirm Password"));
    userEvent.type(getByLabelText("WUSTL Email"), "test@wustl.edu");
    userEvent.type(getByLabelText("Password"), "pass");
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
    expect(createUserMock).not.toHaveBeenCalled();
  });
  it("should not fire api if not formatted correctly (Any Email)", () => {
    const createUserMock = jest.fn();
    (useFirebase as any).mockReturnValue({
      createUser: createUserMock,
    });
    const { getByText, getByLabelText } = render(
      <CreateAccount handleBack={jest.fn()} handleNext={jest.fn()} role="org" />
    );
    fireEvent.click(getByText("Next"));
    expect(getByText("Please enter an email")).toBeInTheDocument();
    expect(getByText("Please enter a password")).toBeInTheDocument();
    userEvent.type(getByLabelText("Email"), "test");
    userEvent.type(getByLabelText("Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Please confirm your password")).toBeInTheDocument();
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Invalid email")).toBeInTheDocument();
    userEvent.clear(getByLabelText("Email"));
    userEvent.clear(getByLabelText("Password"));
    userEvent.clear(getByLabelText("Confirm Password"));
    userEvent.type(getByLabelText("Email"), "test@gmail.com");
    userEvent.type(getByLabelText("Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "mismatch");
    fireEvent.click(getByText("Next"));
    expect(getByText("Passwords don't match")).toBeInTheDocument();
    userEvent.clear(getByLabelText("Email"));
    userEvent.clear(getByLabelText("Password"));
    userEvent.clear(getByLabelText("Confirm Password"));
    userEvent.type(getByLabelText("Email"), "test@gmail.com");
    userEvent.type(getByLabelText("Password"), "pass");
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    expect(getByText("Password is less than 6 characters")).toBeInTheDocument();
    expect(createUserMock).not.toHaveBeenCalled();
  });
});
