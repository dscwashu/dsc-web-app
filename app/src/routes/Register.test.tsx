import React from "react";
import { render } from "@testing-library/react";
import Register from "./Register";
import { useSelector } from "react-redux";
import { useLocation, BrowserRouter as Router } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as Record<string, any>),
  useLocation: jest.fn(),
}));

jest.mock("react-redux");
describe("Register redirect", () => {
  it("should go to edit profile when coming from main push", () => {
    (useSelector as any).mockReturnValue({
      isLoaded: true,
      isEmpty: true,
    });
    (useLocation as any).mockReturnValue({
      state: {
        from: "main",
      },
    });
    const { getByText } = render(
      <Router>
        <Register />
      </Router>
    );
    expect(getByText("Tell Us About Yourself")).toBeInTheDocument();
  });
});
