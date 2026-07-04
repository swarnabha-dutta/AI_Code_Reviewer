import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SignedOutView from "./SignedOutView";

const signInButtonMock = vi.fn();

vi.mock("@clerk/clerk-react", () => ({
    SignInButton: ({ children, mode }: any) => {
        signInButtonMock(mode);
        return <div>{children}</div>;
    },
}));

describe("SignedOutView", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the heading", () => {
        render(<SignedOutView />);

        expect(
            screen.getByRole("heading", {
                name: /ai code reviewer/i,
            })
        ).toBeInTheDocument();
    });

    it("renders the description text", () => {
        render(<SignedOutView />);

        expect(
            screen.getByText(/please sign in to start reviewing your code/i)
        ).toBeInTheDocument();
    });

    it("renders the sign in button", () => {
        render(<SignedOutView />);

        expect(
            screen.getByRole("button", {
                name: /sign in \/ sign up/i,
            })
        ).toBeInTheDocument();
    });

    it("passes modal mode to SignInButton", () => {
        render(<SignedOutView />);

        expect(signInButtonMock).toHaveBeenCalledWith("modal");
    });

    it("applies the app-button class to the button", () => {
        render(<SignedOutView />);

        expect(
            screen.getByRole("button", {
                name: /sign in \/ sign up/i,
            })
        ).toHaveClass("app-button");
    });
});