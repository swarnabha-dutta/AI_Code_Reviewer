import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import NavBar from "./NavBar";
import { axe, toHaveNoViolations } from "jest-axe";




// Mock Clerk UserButton
vi.mock("@clerk/clerk-react", () => ({
    UserButton: () => <div data-testid="user-button">Mock UserButton</div>,
}));

describe("NavBar", () => {
    it("renders the theme toggle button", () => {
        render(<NavBar theme="light" onToggleTheme={vi.fn()} />);

        expect(
            screen.getByRole("button", { name: /dark/i })
        ).toBeInTheDocument();
    });

    it("shows '🌙 Dark' when theme is light", () => {
        render(<NavBar theme="light" onToggleTheme={vi.fn()} />);

        expect(screen.getByText("🌙 Dark")).toBeInTheDocument();
    });

    it("shows '🌞 Light' when theme is dark", () => {
        render(<NavBar theme="dark" onToggleTheme={vi.fn()} />);

        expect(screen.getByText("🌞 Light")).toBeInTheDocument();
    });

    it("calls onToggleTheme when button is clicked", async () => {
        const user = userEvent.setup();
        const handleToggle = vi.fn();

        render(<NavBar theme="light" onToggleTheme={handleToggle} />);

        const button = screen.getByRole("button", { name: /dark/i });

        await user.click(button);

        expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it("renders the mocked Clerk UserButton", () => {
        render(<NavBar theme="light" onToggleTheme={vi.fn()} />);

        expect(screen.getByTestId("user-button")).toBeInTheDocument();
    });


    it("renders a navigation landmark", () => {
        render(<NavBar theme="light" onToggleTheme={vi.fn()} />);

        expect(
            screen.getByRole("navigation", {
                name: /application navigation/i,
            })
        ).toBeInTheDocument();
    });


    it("has an accessible theme toggle button", () => {
        render(<NavBar theme="light" onToggleTheme={vi.fn()} />);

        expect(
            screen.getByRole("button", {
                name: /dark/i,
            })
        ).toBeInTheDocument();
    });

    it("has no accessibility violations", async () => {
        expect.extend(toHaveNoViolations);

        const { container } = render(
            <NavBar
                theme="light"
                onToggleTheme={vi.fn()}
            />
        );

        const results = await axe(container);

        expect(results).toHaveNoViolations();
    });
});