import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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

vi.mock("../hooks/useReview", () => ({
    useReview: () => reviewHookData,
}));

vi.mock("../hooks/useTheme", () => ({
    useTheme: () => themeHookData,
}));

vi.mock("../components/NavBar", () => ({
    default: ({ theme }: { theme: string }) => (
        <div data-testid="navbar">{theme}</div>
    ),
}));

vi.mock("../components/CodeEditor", () => ({
    default: ({ code }: { code: string }) => (
        <div data-testid="code-editor">{code}</div>
    ),
}));

vi.mock("../components/FileUpload", () => ({
    default: () => <div data-testid="file-upload" />,
}));

vi.mock("../components/ReviewPanel", () => ({
    default: ({
        review,
        isLoading,
        isCached,
    }: {
        review: string;
        isLoading: boolean;
        isCached: boolean;
    }) => (
        <div data-testid="review-panel">
            <p>{review}</p>
            <p>{String(isLoading)}</p>
            <p>{String(isCached)}</p>
        </div>
    ),
}));

describe("SignedInView", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        reviewHookData.code = "const a = 10;";
        reviewHookData.review = "Looks good!";
        reviewHookData.isLoading = false;
        reviewHookData.isCached = true;
        reviewHookData.error = "";
    });

    it("renders all child components", () => {
        render(<SignedInView />);

        expect(screen.getByTestId("navbar")).toBeInTheDocument();
        expect(screen.getByTestId("code-editor")).toBeInTheDocument();
        expect(screen.getByTestId("file-upload")).toBeInTheDocument();
        expect(screen.getByTestId("review-panel")).toBeInTheDocument();
    });

    it("passes theme to NavBar", () => {
        render(<SignedInView />);

        expect(screen.getByTestId("navbar")).toHaveTextContent("light");
    });

    it("passes code to CodeEditor", () => {
        render(<SignedInView />);

        expect(screen.getByTestId("code-editor")).toHaveTextContent(
            "const a = 10;"
        );
    });

    it("passes review props to ReviewPanel", () => {
        render(<SignedInView />);

        expect(screen.getByTestId("review-panel")).toHaveTextContent(
            "Looks good!"
        );

        expect(screen.getByTestId("review-panel")).toHaveTextContent("false");

        expect(screen.getByTestId("review-panel")).toHaveTextContent("true");
    });

    it("renders Review button", () => {
        render(<SignedInView />);

        expect(screen.getByText("Review")).toBeInTheDocument();
    });

    it("calls reviewCode when Review button is clicked", () => {
        render(<SignedInView />);

        fireEvent.click(screen.getByText("Review"));

        expect(mockReviewCode).toHaveBeenCalledOnce();
    });

    it("does not render error toast when there is no error", () => {
        render(<SignedInView />);

        expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });

    it("renders error toast when error exists", () => {
        reviewHookData.error = "Something went wrong";

        render(<SignedInView />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("calls setError when error toast is clicked", () => {
        reviewHookData.error = "Something went wrong";

        render(<SignedInView />);

        fireEvent.click(screen.getByText("Something went wrong"));

        expect(mockSetError).toHaveBeenCalledWith("");
    });

    it("renders loading state correctly", () => {
        reviewHookData.isLoading = true;

        render(<SignedInView />);

        expect(screen.getByTestId("review-panel")).toHaveTextContent("true");
    });

    it("renders uncached state correctly", () => {
        reviewHookData.isCached = false;

        render(<SignedInView />);

        const panel = screen.getByTestId("review-panel");

        expect(panel).toHaveTextContent("false");
    });
});