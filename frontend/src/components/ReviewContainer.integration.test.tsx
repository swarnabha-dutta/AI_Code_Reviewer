import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewContainer from "./ReviewContainer";

const mockReviewCode = vi.fn();

const mockUseReview = {
    code: "console.log('Hello');",
    setCode: vi.fn(),
    review: "",
    isLoading: false,
    error: "",
    reviewCode: mockReviewCode,
};

vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({
        isLoaded: true,
        userId: "test-user",
        getToken: vi.fn().mockResolvedValue("fake-token"),
    }),
}));

vi.mock("../hooks/useReview", () => ({
    useReview: () => mockUseReview,
}));

describe("ReviewContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseReview.code = "console.log('Hello');";
        mockUseReview.review = "";
        mockUseReview.isLoading = false;
        mockUseReview.error = "";
    });

    it("renders textarea and button", () => {
        render(<ReviewContainer />);

        expect(screen.getByLabelText("code-editor")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /review code/i,
            })
        ).toBeInTheDocument();
    });

    it("calls reviewCode when Review Code button is clicked", async () => {
        const user = userEvent.setup();

        render(<ReviewContainer />);

        await user.click(
            screen.getByRole("button", {
                name: /review code/i,
            })
        );

        expect(mockReviewCode).toHaveBeenCalledTimes(1);
    });

    it("shows loading button text", () => {
        mockUseReview.isLoading = true;

        render(<ReviewContainer />);

        expect(
            screen.getByRole("button")
        ).toHaveTextContent("Reviewing...");
    });

    it("shows error message", () => {
        mockUseReview.error = "Something went wrong";

        render(<ReviewContainer />);

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Something went wrong"
        );
    });

    it("renders review panel when review exists", () => {
        mockUseReview.review = "# AI Review";

        render(<ReviewContainer />);

        expect(screen.getByText(/AI Review/i)).toBeInTheDocument();
    });
});