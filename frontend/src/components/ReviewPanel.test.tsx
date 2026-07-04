import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import ReviewPanel from "./ReviewPanel";
import { act } from "@testing-library/react";


beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
        value: {
            writeText: vi.fn(),
        },
        configurable: true,
    });

});

afterEach(() => {
    vi.restoreAllMocks();
})



describe("ReviewPanel", () => {
    it("renders without crashing", () => {
        const { container } = render(
            <ReviewPanel
                review=""
                isLoading={false}
                isCached={false}
            />
        );

        expect(container.firstChild).toBeInTheDocument();
    });

    it("renders review content when not loading", () => {
        render(
            <ReviewPanel
                review="Hello World"
                isLoading={false}
                isCached={false}
            />
        );
        expect(screen.getByText("Hello World")).toBeInTheDocument();
    });




    it("shows loading message when loading", () => {
        render(
            <ReviewPanel
                review="Hello World"
                isLoading={true}
                isCached={false}
            />
        );

        expect(screen.getByText("⏳ Finding issues...")).toBeInTheDocument();
    });


    it("does not render review content while loading", () => {
        render(
            <ReviewPanel
                review="Hello World"
                isLoading={true}
                isCached={false}
            />
        );

        expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
    });

    it("shows copy button when review exists", () => {
        render(
            <ReviewPanel
                review="Hello World"
                isLoading={false}
                isCached={false}
            />
        );

        expect(screen.getByRole("button", { name: /copy full output/i })
        ).toBeInTheDocument();
    });

    it("does not show copy button when review is empty", () => {
        render(
            <ReviewPanel
                review=""
                isLoading={false}
                isCached={false}
            />
        );
        expect(
            screen.queryByRole("button", { name: /copy full output/i })
        ).not.toBeInTheDocument();
    });

    it("shows cached badge when result is cached", () => {
        render(
            <ReviewPanel
                review="Hello World"
                isLoading={false}
                isCached={true}
            />
        );

        expect(screen.getByText(/cached result/i)).toBeInTheDocument();
    });


    it("does not show cached badge when result is not cached", () => {
        render(
            <ReviewPanel
                review="Hello World"
                isLoading={false}
                isCached={false}
            />
        );

        expect(screen.queryByText(/cached result/i)).not.toBeInTheDocument();
    });


    it("changes button text after copying", async () => {
        const user = userEvent.setup();


        render(
            <ReviewPanel
                review="Hello World"
                isLoading={false}
                isCached={false}
            />
        );

        const button = screen.getByRole("button", {
            name: /copy full output/i,
        });

        await user.click(button);
        expect(
            screen.getByRole("button", {
                name: /copied/i,
            })
        ).toBeInTheDocument();
    });


    it("changes button text back after 1.5 seconds", async () => {
        vi.useFakeTimers();

        render(
            <ReviewPanel
                review="Hello World"
                isLoading={false}
                isCached={false}
            />
        );

        const button = screen.getByRole("button", {
            name: /copy full output/i,
        });

        act(() => {
            button.click();
        });

        expect(
            screen.getByRole("button", {
                name: /copied/i
            })
        ).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        expect(
            screen.getByRole("button", {
                name: /copy full output/i,
            })
        ).toBeInTheDocument();

        vi.useRealTimers();
    })

});