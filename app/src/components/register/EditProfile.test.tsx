import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProfile from "./EditProfile";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
jest.mock("react-redux-firebase");
jest.mock("react-redux");
(useSelector as any).mockReturnValue(123);

describe("EditProfile validation", () => {
  it("should hide grade field for orgs", () => {
    const { queryByLabelText } = render(<EditProfile role="orgs" />);
    expect(queryByLabelText("Grade")).not.toBeInTheDocument();
    const { getByLabelText } = render(<EditProfile role="student" />);
    expect(getByLabelText("Grade")).toBeInTheDocument();
  });
  it("should validate URL on blur", () => {
    const { getByLabelText, getByText } = render(
      <EditProfile role="student" />
    );
    userEvent.type(getByLabelText("Website"), "test");
    fireEvent.blur(getByLabelText("Website"));
    expect(getByText("Invalid URL")).toBeInTheDocument();
  });
  it("should remove validate URL error on type", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <EditProfile role="student" />
    );
    userEvent.type(getByLabelText("Website"), "test");
    fireEvent.blur(getByLabelText("Website"));
    expect(getByText("Invalid URL")).toBeInTheDocument();
    userEvent.type(getByLabelText("Website"), "typing");
    expect(queryByText("Invalid URL")).not.toBeInTheDocument();
  });
  it("should respect bio character limit", () => {
    const { getByLabelText } = render(<EditProfile role="student" />);
    const testString = "a".repeat(501);
    userEvent.type(getByLabelText("Short Bio"), testString);
    expect(getByLabelText("Short Bio").textContent?.length).toEqual(500);
  });
  it("should show error on bad response", async () => {
    (useFirestore as any).mockReturnValue({
      collection: () => ({
        doc: (): Record<string, any> => ({
          update: (): Promise<never> =>
            Promise.reject({ message: "Error placeholder" }),
        }),
      }),
    });
    const { getByText, getByLabelText } = render(
      <EditProfile role="student" />
    );
    userEvent.type(getByLabelText("First Name", { exact: false }), "Zach");
    userEvent.type(getByLabelText("Last Name", { exact: false }), "Young");
    fireEvent.click(getByText("Next"));
    await waitFor(() =>
      expect(getByText("Error placeholder")).toBeInTheDocument()
    );
  });
  it("should not fire api if not formatted correctly", () => {
    const collectionMock = jest.fn();
    (useFirestore as any).mockReturnValue({
      collection: collectionMock,
    });
    const { getAllByText, getByText } = render(<EditProfile role="student" />);
    fireEvent.click(getByText("Next"));
    expect(getAllByText("This is a required field").length).toEqual(2);
    expect(collectionMock).not.toHaveBeenCalled();
  });
});
