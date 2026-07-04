import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import App from "./App";

// Mock Clerk Components
vi.mock("@clerk/clerk-react", () => ({
    SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Pages
vi.mock("./pages/SignedInView", () => ({
    default: () => <div>Mock SignedIn View</div>,
}));

vi.mock("./pages/SignedOutView", () => ({
    default: () => <div>Mock SignedOut View</div>,
}));

describe("App", () => {
    test("renders both mocked views", () => {
        render(<App />);

        expect(screen.getByText("Mock SignedIn View")).toBeInTheDocument();
        expect(screen.getByText("Mock SignedOut View")).toBeInTheDocument();
    });
});