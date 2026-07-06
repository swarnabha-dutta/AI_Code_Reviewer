import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

/* ---------------- Clerk Mocks ---------------- */

let isSignedIn = true;

vi.mock("@clerk/clerk-react", () => ({
    SignedIn: ({ children }: { children: React.ReactNode }) =>
        isSignedIn ? <>{children}</> : null,

    SignedOut: ({ children }: { children: React.ReactNode }) =>
        !isSignedIn ? <>{children}</> : null,
}));

/* ---------------- Child Component Mocks ---------------- */

vi.mock("./pages/SignedInView", () => ({
    default: () => (
        <div data-testid="signed-in-view">
            Mock SignedIn View
        </div>
    ),
}));

vi.mock("./pages/SignedOutView", () => ({
    default: () => (
        <div data-testid="signed-out-view">
            Mock SignedOut View
        </div>
    ),
}));

describe("App", () => {
    beforeEach(() => {
        isSignedIn = true;
    });

    it("renders SignedInView when user is signed in", () => {
        isSignedIn = true;

        render(<App />);

        expect(
            screen.getByTestId("signed-in-view")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("signed-out-view")
        ).not.toBeInTheDocument();
    });

    it("renders SignedOutView when user is signed out", () => {
        isSignedIn = false;

        render(<App />);

        expect(
            screen.getByTestId("signed-out-view")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("signed-in-view")
        ).not.toBeInTheDocument();
    });

    it("renders exactly one authenticated view", () => {
        isSignedIn = true;

        const { rerender } = render(<App />);

        expect(screen.getAllByTestId(/signed/i)).toHaveLength(1);

        isSignedIn = false;

        rerender(<App />);

        expect(screen.getAllByTestId(/signed/i)).toHaveLength(1);
    });

    it("does not render both views at the same time", () => {
        isSignedIn = true;

        render(<App />);

        expect(
            screen.getByTestId("signed-in-view")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("signed-out-view")
        ).toBeNull();
    });

    it("renders without crashing", () => {
        expect(() => render(<App />)).not.toThrow();
    });
});