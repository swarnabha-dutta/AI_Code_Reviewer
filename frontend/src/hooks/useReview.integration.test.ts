import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useReview } from "./useReview";
import { http, HttpResponse, delay } from "msw";
import { server } from "../mocks/server";
import {
    lastAuthorizationHeader,
    lastContentTypeHeader,
    lastRequestBody,
    lastQueryParams,
    resetCapturedRequest,
} from "../mocks/handlers";




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
        resetCapturedRequest();
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


    it("sends Authorization header", async () => {
        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("console.log('Hello')");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(lastAuthorizationHeader).toBe("Bearer mock-token");
        });
    });


    it("sends multipart form-data", async () => {
        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("const a = 10;");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(lastContentTypeHeader).toContain("multipart/form-data");
        });
    });


    it("sends code inside FormData", async () => {
        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("const answer = 42;");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(lastRequestBody?.get("code")).toBe("const answer = 42;");
        });
    });

    it("handles 201 Created response", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async () => {
                return HttpResponse.json(
                    {
                        raw: "Created Successfully",
                        cached: false,
                    },
                    {
                        status: 201,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("console.log('Created')");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        await waitFor(() => {
            expect(result.current.review).toBe("Created Successfully");
        });

        expect(result.current.error).toBe("");
    });

    it("handles 400 Bad Request", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                return HttpResponse.json(
                    {
                        error: "Bad Request",
                    },
                    {
                        status: 400,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("bad code");
        });

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("");
        expect(result.current.error).toBe("Bad Request");
    });

    it("handles 401 Unauthorized", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                return HttpResponse.json(
                    {
                        error: "Unauthorized",
                    },
                    {
                        status: 401,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.error).toBe("Unauthorized");
    });


    it("handles 403 Forbidden", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                return HttpResponse.json(
                    {
                        error: "Forbidden",
                    },
                    {
                        status: 403,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.error).toBe("Forbidden");
    });


    it("handles 404 Not Found", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                return HttpResponse.json(
                    {
                        error: "Not Found",
                    },
                    {
                        status: 404,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("");
        expect(result.current.error).toBe("Not Found");
    });



    it("handles 429 Too Many Requests", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                return HttpResponse.json(
                    {
                        error: "Too Many Requests",
                    },
                    {
                        status: 429,
                    }
                );
            })
        );

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("");
        expect(result.current.error).toBe("Too Many Requests");
    });



    it("handles network error", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, () => {
                return HttpResponse.error();
            })
        );

        const { result } = renderHook(() => useReview());

        await act(async () => {
            await result.current.reviewCode();
        });

        expect(result.current.review).toBe("");
        expect(result.current.error).not.toBe("");
    });



    it("keeps loading during a slow response", async () => {
        server.use(
            http.post(`${import.meta.env.VITE_API_URL}/ai/get-review`, async () => {
                await delay(1500);

                return HttpResponse.json({
                    raw: "Delayed Review",
                    cached: false,
                });
            })
        );

        const { result } = renderHook(() => useReview());

        act(() => {
            result.current.setCode("const slow = true;");
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

        expect(result.current.review).toBe("Delayed Review");
        expect(result.current.isLoading).toBe(false);
    });
});