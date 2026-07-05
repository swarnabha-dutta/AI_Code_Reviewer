import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import SignedInView from "./SignedInView";

vi.mock("axios");

vi.mock("@clerk/clerk-react", () => ({
    UserButton: () => <div data-testid="user-button" />,
    useAuth: () => ({
        isLoaded: true,
        userId: "user123",
        getToken: vi.fn().mockResolvedValue("fake-token"),
    }),
}));

const mockedAxios = vi.mocked(axios);

describe("SignedInView Integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });


    it("submits code and displays review", async () => {

        mockedAxios.post.mockResolvedValue({
            data: {
                raw: "Great implementation!",
                cached: false,
            },
        });

        render(<SignedInView />);

        const user = userEvent.setup();

        const editor = screen.getByRole("textbox");

        fireEvent.change(editor, {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(
            screen.getByText("Review")
        );

        expect(await screen.findByText("Great implementation!"))
            .toBeInTheDocument();

        expect(mockedAxios.post).toHaveBeenCalledOnce();

    });


    it("shows loading state while waiting for API response", async () => {
        mockedAxios.post.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                data: {
                                    raw: "Loading finished",
                                    cached: false,
                                },
                            }),
                        100
                    )
                )
        );

        render(<SignedInView />);

        const user = userEvent.setup();

        const editor = screen.getByRole("textbox");

        fireEvent.change(editor, {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            screen.getByText(/finding issues/i)
        ).toBeInTheDocument();

        expect(
            await screen.findByText("Loading finished")
        ).toBeInTheDocument();

        expect(
            screen.queryByText(/finding issues/i)
        ).not.toBeInTheDocument();
    });

    it("shows error message when API request fails", async () => {
        mockedAxios.post.mockRejectedValue({
            response: {
                data: {
                    error: "Server is down",
                },
            },
        });

        render(<SignedInView />);

        const user = userEvent.setup();

        const editor = screen.getByRole("textbox");

        fireEvent.change(editor, {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            await screen.findByText("Server is down")
        ).toBeInTheDocument();

        expect(mockedAxios.post).toHaveBeenCalledOnce();
    });
    it("clears error message when user dismisses it", async () => {
        mockedAxios.post.mockRejectedValue({
            response: {
                data: {
                    error: "Server is down",
                },
            },
        });

        render(<SignedInView />);

        const user = userEvent.setup();

        fireEvent.change(screen.getByRole("textbox"), {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        const error = await screen.findByText("Server is down");

        await user.click(error);

        expect(
            screen.queryByText("Server is down")
        ).not.toBeInTheDocument();
    });


    it("shows cached badge when response is cached", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {
                raw: "Cached review",
                cached: true,
            },
        });

        render(<SignedInView />);

        const user = userEvent.setup();

        fireEvent.change(screen.getByRole("textbox"), {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            await screen.findByText("Cached review")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/cached result/i)
        ).toBeInTheDocument();
    });


    it("shows validation message when editor is empty", async () => {
        render(<SignedInView />);

        const user = userEvent.setup();

        fireEvent.change(screen.getByRole("textbox"), {
            target: {
                value: "",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            await screen.findByText(/write or upload code/i)
        ).toBeInTheDocument();

        expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it("sends request with FormData and authorization header", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {
                raw: "Review completed",
                cached: false,
            },
        });

        render(<SignedInView />);

        const user = userEvent.setup();

        fireEvent.change(screen.getByRole("textbox"), {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);

        const [url, formData, config] = mockedAxios.post.mock.calls[0];

        expect(url).toContain("/ai/get-review");

        expect(formData).toBeInstanceOf(FormData);

        expect(config.headers.Authorization).toContain("Bearer");

        expect(config.headers["Content-Type"]).toBe(
            "multipart/form-data"
        );
    });


    it("does not show cached badge for fresh response", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {
                raw: "Fresh review",
                cached: false,
            },
        });

        render(<SignedInView />);

        const user = userEvent.setup();

        fireEvent.change(screen.getByRole("textbox"), {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            await screen.findByText("Fresh review")
        ).toBeInTheDocument();

        expect(
            screen.queryByText(/cached result/i)
        ).not.toBeInTheDocument();
    });

    it("replaces previous review with new review", async () => {

        mockedAxios.post
            .mockResolvedValueOnce({
                data: {
                    raw: "First Review",
                    cached: false,
                },
            })
            .mockResolvedValueOnce({
                data: {
                    raw: "Second Review",
                    cached: false,
                },
            });

        render(<SignedInView />);

        const user = userEvent.setup();

        const editor = screen.getByRole("textbox");

        fireEvent.change(editor, {
            target: {
                value: "const a = 10;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            await screen.findByText("First Review")
        ).toBeInTheDocument();

        fireEvent.change(editor, {
            target: {
                value: "const b = 20;",
            },
        });

        await user.click(screen.getByText("Review"));

        expect(
            await screen.findByText("Second Review")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("First Review")
        ).not.toBeInTheDocument();
    });


});