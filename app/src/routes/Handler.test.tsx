import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, waitFor, fireEvent } from "@testing-library/react";
import Handler from "./Handler";
import userEvent from "@testing-library/user-event";
import { useFirebase } from "react-redux-firebase";
jest.mock("react-redux-firebase");

describe("Handler", () => {
  const testSearches = [
    "",
    " ",
    "?",
    "oobCode=123&mode=resetPassword",
    "&oobCode=123",
  ];
  testSearches.forEach((search) => {
    it("should recognize invalid links", () => {
      const { getByText } = render(
        <MemoryRouter initialEntries={[search]}>
          <Handler />
        </MemoryRouter>
      );
      expect(getByText("Invalid Link")).toBeInTheDocument();
    });
  });
  it("should go to 'Verification Succesful' dialog on valid verifyEmail link", async () => {
    (useFirebase as any).mockReturnValue({
      auth: () => {
        return {
          applyActionCode: (): Promise<void> => Promise.resolve(),
        };
      },
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["?oobCode=123&mode=verifyEmail"]}>
        <Handler />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(getByText("Verification Successful")).toBeInTheDocument()
    );
  });
  it("should show 'Expired Link' dialog on expired verifyEmail link", async () => {
    (useFirebase as any).mockReturnValue({
      auth: () => {
        return {
          applyActionCode: (): Promise<void> => Promise.reject(),
        };
      },
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["?oobCode=123&mode=verifyEmail"]}>
        <Handler />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Expired Link")).toBeInTheDocument());
  });
  it("should go to 'Password Succesful' dialog on valid verifyEmail link", async () => {
    (useFirebase as any).mockReturnValue({
      verifyPasswordResetCode: (): Promise<void> => Promise.resolve(),
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["?oobCode=123&mode=resetPassword"]}>
        <Handler />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(getByText("Reset Your Password")).toBeInTheDocument()
    );
  });
  it("should show 'Password Successfully Reset' dialog on valid resetPassword link", async () => {
    (useFirebase as any).mockReturnValue({
      verifyPasswordResetCode: (): Promise<void> => Promise.resolve(),
      confirmPasswordReset: () => Promise.resolve(),
    });
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={["?oobCode=123&mode=resetPassword"]}>
        <Handler />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(getByText("Reset Your Password")).toBeInTheDocument()
    );
    userEvent.type(getByLabelText("New Password"), "password");
    userEvent.type(getByLabelText("Confirm Password"), "password");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(getByText("Password Successfully Reset")).toBeInTheDocument()
    );
  });
  it("should show 'Expired Link' dialog on expired resetPassword link", async () => {
    (useFirebase as any).mockReturnValue({
      verifyPasswordResetCode: (): Promise<void> => Promise.reject(),
    });
    const { getByText } = render(
      <MemoryRouter initialEntries={["?oobCode=123&mode=resetPassword"]}>
        <Handler />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Expired Link")).toBeInTheDocument());
  });
  it("should show loading screen for async events", async () => {
    (useFirebase as any).mockReturnValue({
      verifyPasswordResetCode: (): Promise<void> => Promise.reject(),
    });
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["?oobCode=123&mode=resetPassword"]}>
        <Handler />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByTestId("skeleton")).toBeInTheDocument());
  });
});
