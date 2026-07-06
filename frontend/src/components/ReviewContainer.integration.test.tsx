import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";

import { server } from "../mocks/server";
import ReviewContainer from "./ReviewContainer";
import { axe, toHaveNoViolations } from "jest-axe";



vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({
        isLoaded: true,
        userId: "test-user",
        getToken: vi.fn().mockResolvedValue("fake-token"),
    }),
}));

describe("ReviewContainer - Real Hook + MSW Integration", () => {
    it("renders textarea and review button", () => {
        render(<ReviewContainer />);

        expect(screen.getByLabelText("code-editor")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /review code/i,
            })
        ).toBeInTheDocument();
    });

    it("shows review returned from MSW", async () => {
        const user = userEvent.setup();

        render(<ReviewContainer />);

        await user.click(
            screen.getByRole("button", {
                name: /review code/i,
            })
        );

        expect(
            await screen.findByText(/MSW Mock Review/i)
        ).toBeInTheDocument();
    });

    it("disables button while reviewing", async () => {
        const user = userEvent.setup();

        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/ai/get-review`,
                async () => {
                    await new Promise((resolve) => setTimeout(resolve, 300));

                    return HttpResponse.json({
                        raw: "Delayed Review",
                        cached: false,
                    });
                }
            )
        );

        render(<ReviewContainer />);

        const button = screen.getByRole("button", {
            name: /review code/i,
        });

        await user.click(button);

        expect(button).toBeDisabled();

        expect(button).toHaveTextContent(/reviewing/i);

        expect(
            await screen.findByText(/Delayed Review/i)
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(button).not.toBeDisabled();
            expect(button).toHaveTextContent(/review code/i);
        });
    });

    it("shows server error", async () => {
        const user = userEvent.setup();

        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/ai/get-review`,
                () => {
                    return HttpResponse.json(
                        {
                            error: "Internal Server Error",
                        },
                        {
                            status: 500,
                        }
                    );
                }
            )
        );

        render(<ReviewContainer />);

        await user.click(
            screen.getByRole("button", {
                name: /review code/i,
            })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Internal Server Error");
    });

    it("keeps the review button accessible", () => {
        render(<ReviewContainer />);

        expect(
            screen.getByRole("button", {
                name: /review code/i,
            })
        ).toBeEnabled();
    });

    it("has no accessibility violations", async () => {
        expect.extend(toHaveNoViolations);

        const { container } = render(<ReviewContainer />);

        const results = await axe(container);

        expect(results).toHaveNoViolations();
    });


});