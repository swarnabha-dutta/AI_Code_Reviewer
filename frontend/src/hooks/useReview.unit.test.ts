import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReview } from "./useReview";
import { reviewApi } from "../services/reviewApi";

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({
        isLoaded: true,
        userId: "user_123",
        getToken: vi.fn().mockResolvedValue("mock-token"),
    }),
}));

// Mock reviewApi
vi.mock("../services/reviewApi", () => ({
    reviewApi: vi.fn(),
}));

const mockedReviewApi = vi.mocked(reviewApi);

describe("useReview Unit", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls reviewApi successfully", async () => {
        mockedReviewApi.mockResolvedValue({
            raw: "Unit Test Review",
            cached: false,
        });

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("console.log('Hello')");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(mockedReviewApi).toHaveBeenCalledTimes(1);
    });

    it("sets review on success", async () => {
        mockedReviewApi.mockResolvedValue({
            raw: "Excellent Code",
            cached: false,
        });

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("const a = 10;");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("Excellent Code");
        expect(result.current.error).toBe("");
    });

    it("sets cached state", async () => {
        mockedReviewApi.mockResolvedValue({
            raw: "Cached Review",
            cached: true,
        });

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.isCached).toBe(true);
    });

    it("handles reviewApi error", async () => {
        mockedReviewApi.mockRejectedValue(
            new Error("Network Failed")
        );

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.error).toBe("Network Failed");
    });

    it("sets loading correctly", async () => {
        mockedReviewApi.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                raw: "Delayed Review",
                                cached: false,
                            }),
                        200
                    )
                )
        );

        const { result } = renderHook(() => useReview());

        let promise: Promise<void>;

        act(() => {
            promise = result.current.reviewCode();
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
        });

        await act(async () => {
            await promise;
        });

        expect(result.current.isLoading).toBe(false);
    });
});