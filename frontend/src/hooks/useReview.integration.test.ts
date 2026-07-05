import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReview } from "./useReview";
import { http, HttpResponse, delay } from "msw";
import { server } from "../mocks/server";


// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
    useAuth: () => ({
        isLoaded: true,
        userId: "user_123",
        getToken: vi.fn().mockResolvedValue("mock-token"),
    }),
}));

describe("useReview Integration (MSW)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("reviews code successfully using MSW", async () => {
        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("function add(a,b){ return a+b; }");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe("");
        expect(result.current.review).toContain("MSW Mock Review");
    });


    it("sets loading while request is in progress", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async () => {
                await delay(300);

                return HttpResponse.json({
                    raw: "MSW Mock Review",
                    cached: false,
                });
            })
        );


        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("console.log('Hello')");
        });

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
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
    });


    it("handles API error correctly", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async () => {
                await delay(300);

                return HttpResponse.json(
                    {
                        error: "Internal Server Error",
                    },
                    {
                        status: 500,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("console.log('Hello')");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.review).toBe("");
        expect(result.current.error).toBe("Internal Server Error");
    });

    it("handles cached response correctly", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async () => {
                await delay(300);

                return HttpResponse.json({
                    raw: "MSW Cached Review",
                    cached: true,
                });
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("const sum = (a,b) => a+b;");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe("");

        expect(result.current.review).toContain("MSW Cached Review");

        expect(result.current.isCached).toBe(true);
    });

});