import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";

import { server } from "../mocks/server";
import ReviewContainer from "./ReviewContainer";
import { axe, toHaveNoViolations } from "jest-axe";
import { useReview } from "../hooks/useReview";



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

    it("updates the UI with the latest review after sequential requests", async () => {
        const user = userEvent.setup();

        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/ai/get-review`,
                async ({ request }) => {
                    const formData = await request.formData();

                    const code = formData.get("code");

                    if (code === "first review") {
                        return HttpResponse.json({
                            raw: "First Result",
                            cached: false,
                        });
                    }

                    return HttpResponse.json({
                        raw: "Second Result",
                        cached: false,
                    });
                }
            )
        );

        render(<ReviewContainer />);

        const textarea = screen.getByLabelText("code-editor");

        await user.clear(textarea);

        await user.type(textarea, "first review");

        await user.click(
            screen.getByRole("button", {
                name: /review code/i,
            })
        );

        expect(
            await screen.findByText("First Result")
        ).toBeInTheDocument();

        await user.clear(textarea);

        await user.type(textarea, "second review");

        await user.click(
            screen.getByRole("button", {
                name: /review code/i,
            })
        );

        expect(
            await screen.findByText("Second Result")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("First Result")
        ).not.toBeInTheDocument();
    });


    it("prevents duplicate submissions during rapid clicks", async () => {
        const user = userEvent.setup();

        let requestCount = 0;

        server.use(
            http.post(
                `${import.meta.env.VITE_API_URL}/ai/get-review`,
                async () => {
                    requestCount++;

                    await new Promise((resolve) => setTimeout(resolve, 300));

                    return HttpResponse.json({
                        raw: "Only One Review",
                        cached: false,
                    });
                }
            )
        );

        render(<ReviewContainer />);

        const button = screen.getByRole("button", {
            name: /review code/i,
        });

        await user.dblClick(button);

        expect(button).toBeDisabled();

        expect(
            await screen.findByText("Only One Review")
        ).toBeInTheDocument();

        expect(requestCount).toBe(1);

        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });

    it("keeps the latest review after multiple sequential review requests", async () => {
        let requestNumber = 0;

        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async () => {
                requestNumber++;

                return HttpResponse.json({
                    raw: `Review ${requestNumber}`,
                    cached: false,
                });
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("first");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("Review 1");

        act(() => {
            result.current.setCode("second");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("Review 2");
        expect(result.current.error).toBe("");
        expect(result.current.isLoading).toBe(false);
    });

    it("recovers correctly after a failed request followed by a successful request", async () => {
        let requestCount = 0;

        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                requestCount++;

                if (requestCount === 1) {
                    return HttpResponse.json(
                        {
                            error: "Internal Server Error",
                        },
                        {
                            status: 500,
                        }
                    );
                }

                return HttpResponse.json({
                    raw: "Recovered Review",
                    cached: false,
                });
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("console.log('retry')");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("");
        expect(result.current.error).toBe("Internal Server Error");

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("Recovered Review");
        expect(result.current.error).toBe("");
        expect(result.current.isLoading).toBe(false);
    });

    it("maintains consistent async state across repeated review requests", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async ({ request }) => {
                const formData = await request.formData();

                return HttpResponse.json({
                    raw: `Reviewed: ${formData.get("code")}`,
                    cached: false,
                });
            })
        );

        const { result } = renderHook(() => useReview());

        for (let i = 1; i <= 3; i++) {
            act(() => {
                result.current.setCode(`code-${i}`);
            });

            await act(async () => {
                await result.current.reviewCode();
            });

            expect(result.current.review).toBe(`Reviewed: code-${i}`);
            expect(result.current.error).toBe("");
            expect(result.current.isLoading).toBe(false);
        }
    });
});