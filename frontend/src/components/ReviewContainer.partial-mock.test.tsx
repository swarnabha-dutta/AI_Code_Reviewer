import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReviewContainer from "./ReviewContainer";

vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({
        isLoaded: true,
        userId: "user_123",
        getToken: vi.fn().mockResolvedValue("token"),
    }),
}));

vi.mock("../hooks/useReview", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../hooks/useReview")>();

    return {
        ...actual,
        useReview: () => ({
            code: "const a = 1;",
            setCode: vi.fn(),
            review: "Partial Mock Review",
            isLoading: false,
            isCached: false,
            error: "",
            reviewCode: vi.fn(),
            setError: vi.fn(),
            setFilesToUpload: vi.fn(),
            handleFileChange: vi.fn(),
            filesToUpload: [],
        }),
    };
});

describe("ReviewContainer - Partial Mock", () => {
    it("renders mocked review", () => {
        render(<ReviewContainer />);

        expect(screen.getByText(/Partial Mock Review/i)).toBeInTheDocument();
    });
});