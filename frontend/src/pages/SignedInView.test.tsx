import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import SignedInView from "./SignedInView";

const mockSetCode = vi.fn();
const mockSetError = vi.fn();
const mockHandleFileChange = vi.fn();
const mockReviewCode = vi.fn();
const mockToggleTheme = vi.fn();

const reviewHookData = {
    code: "const a = 10;",
    review: "Looks good!",
    isLoading: false,
    isCached: true,
    error: "",
    filesToUpload: [],
    setCode: mockSetCode,
    setError: mockSetError,
    handleFileChange: mockHandleFileChange,
    reviewCode: mockReviewCode,
};

const themeHookData = {
    theme: "light",
    toggleTheme: mockToggleTheme,
};

vi.mock("@clerk/clerk-react", () => ({
    UserButton: () => <div data-testid="user-button" />,
}));

vi.mock("../hooks/useReview", () => ({
    useReview: () => reviewHookData,
}));

vi.mock("../hooks/useTheme", () => ({
    useTheme: () => themeHookData,
}));

describe("SignedInView Integration", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        reviewHookData.code = "const a = 10;";
        reviewHookData.review = "Looks good!";
        reviewHookData.isLoading = false;
        reviewHookData.isCached = true;
        reviewHookData.error = "";
        reviewHookData.filesToUpload = [];
    });

    it("renders all real child components", () => {
        render(<SignedInView />);

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(
            screen.getByText("Upload Files (Max 10MB)")
        ).toBeInTheDocument();
        expect(screen.getByText("Review")).toBeInTheDocument();
        expect(screen.getByTestId("user-button")).toBeInTheDocument();
    });

    it("shows initial code inside editor", () => {
        render(<SignedInView />);

        expect(screen.getByRole("textbox")).toHaveValue("const a = 10;");
    });

    it("calls setCode when user types", async () => {
        const user = userEvent.setup();

        render(<SignedInView />);

        const editor = screen.getByRole("textbox");

        await user.type(editor, "Hello");

        expect(mockSetCode).toHaveBeenCalled();
    });

    it("renders review output", () => {
        render(<SignedInView />);

        expect(screen.getByText("Looks good!")).toBeInTheDocument();
    });

    it("shows cached badge", () => {
        render(<SignedInView />);

        expect(screen.getByText(/cached result/i)).toBeInTheDocument();
    });

    it("does not show loading message initially", () => {
        render(<SignedInView />);

        expect(
            screen.queryByText(/finding issues/i)
        ).not.toBeInTheDocument();
    });

    it("shows loading state", () => {
        reviewHookData.isLoading = true;

        render(<SignedInView />);

        expect(
            screen.getByText(/finding issues/i)
        ).toBeInTheDocument();
    });

    it("calls reviewCode when Review button is clicked", () => {
        render(<SignedInView />);

        fireEvent.click(screen.getByText("Review"));

        expect(mockReviewCode).toHaveBeenCalledOnce();
    });

    it("does not render error toast initially", () => {
        render(<SignedInView />);

        expect(
            screen.queryByText("Something went wrong")
        ).not.toBeInTheDocument();
    });

    it("renders error toast", () => {
        reviewHookData.error = "Something went wrong";

        render(<SignedInView />);

        expect(
            screen.getByText("Something went wrong")
        ).toBeInTheDocument();
    });

    it("dismisses error toast", () => {
        reviewHookData.error = "Something went wrong";

        render(<SignedInView />);

        fireEvent.click(screen.getByText("Something went wrong"));

        expect(mockSetError).toHaveBeenCalledWith("");
    });

    it("shows uploaded file count", () => {
        reviewHookData.filesToUpload = [
            new File(["a"], "a.ts"),
            new File(["b"], "b.ts"),
        ];

        render(<SignedInView />);

        expect(
            screen.getByText("Uploaded 2 file(s)")
        ).toBeInTheDocument();
    });

    it("toggles theme", () => {
        render(<SignedInView />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /dark/i,
            })
        );

        expect(mockToggleTheme).toHaveBeenCalledOnce();
    });
});