import { describe, it, expect, vi, afterEach } from "vitest";
import axios from "axios";
import { reviewApi } from "./reviewApi";

describe("reviewApi - spyOn()", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("calls axios.post with correct arguments", async () => {
        const fakeResponse = {
            data: {
                raw: "Spy Review",
                cached: false,
            },
        };

        const postSpy = vi
            .spyOn(axios, "post")
            .mockResolvedValue(fakeResponse);

        const formData = new FormData();
        formData.append("code", "console.log('hello')");

        const result = await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "abc123",
            formData,
        });

        expect(postSpy).toHaveBeenCalledTimes(1);

        expect(postSpy).toHaveBeenCalledWith(
            "http://localhost:5000/ai/get-review",
            formData,
            {
                headers: {
                    Authorization: "Bearer abc123",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        expect(result.raw).toBe("Spy Review");
    });

    it("returns different response using mockResolvedValueOnce()", async () => {
        vi.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                raw: "First Response",
                cached: true,
            },
        });

        const formData = new FormData();
        formData.append("code", "let a = 10");

        const result = await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "token123",
            formData,
        });

        expect(result.raw).toBe("First Response");
        expect(result.cached).toBe(true);
    });


    it("throws when axios.post fails", async () => {
        vi.spyOn(axios, "post").mockRejectedValueOnce(
            new Error("Server Error")
        );

        const formData = new FormData();
        formData.append("code", "const x = 5");

        await expect(
            reviewApi({
                backendUrl: "http://localhost:5000",
                token: "abc123",
                formData,
            })
        ).rejects.toThrow("Server Error");
    });

    it("handles different responses on sequential calls", async () => {
        const postSpy = vi.spyOn(axios, "post");

        postSpy
            .mockImplementationOnce(async () => ({
                data: {
                    raw: "First Review",
                    cached: false,
                },
            }))
            .mockImplementationOnce(async () => {
                throw new Error("Server Error");
            })
            .mockImplementationOnce(async () => ({
                data: {
                    raw: "Third Review",
                    cached: true,
                },
            }));

        const formData = new FormData();
        formData.append("code", "console.log('Hello')");

        const first = await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "abc",
            formData,
        });

        expect(first.raw).toBe("First Review");

        await expect(
            reviewApi({
                backendUrl: "http://localhost:5000",
                token: "abc",
                formData,
            })
        ).rejects.toThrow("Server Error");

        const third = await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "abc",
            formData,
        });

        expect(third.raw).toBe("Third Review");
        expect(third.cached).toBe(true);

        expect(postSpy).toHaveBeenCalledTimes(3);
    });

    it("verifies each axios.post call arguments", async () => {
        const postSpy = vi.spyOn(axios, "post");

        postSpy
            .mockResolvedValueOnce({
                data: {
                    raw: "Review 1",
                    cached: false,
                },
            })
            .mockResolvedValueOnce({
                data: {
                    raw: "Review 2",
                    cached: true,
                },
            });

        const formData1 = new FormData();
        formData1.append("code", "const a = 1;");

        const formData2 = new FormData();
        formData2.append("code", "const b = 2;");

        await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "token1",
            formData: formData1,
        });

        await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "token2",
            formData: formData2,
        });

        expect(postSpy).toHaveBeenCalledTimes(2);

        expect(postSpy).toHaveBeenNthCalledWith(
            1,
            "http://localhost:5000/ai/get-review",
            formData1,
            {
                headers: {
                    Authorization: "Bearer token1",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        expect(postSpy).toHaveBeenNthCalledWith(
            2,
            "http://localhost:5000/ai/get-review",
            formData2,
            {
                headers: {
                    Authorization: "Bearer token2",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        expect(postSpy).toHaveBeenLastCalledWith(
            "http://localhost:5000/ai/get-review",
            formData2,
            {
                headers: {
                    Authorization: "Bearer token2",
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    });

    it("sends query parameters correctly", async () => {
        const postSpy = vi.spyOn(axios, "post").mockResolvedValue({
            data: {
                raw: "Filtered Review",
                cached: false,
            },
        });

        const formData = new FormData();
        formData.append("code", "const x = 10;");

        await reviewApi({
            backendUrl: "http://localhost:5000",
            token: "abc123",
            formData,
            query: "?language=javascript",
        });

        expect(postSpy).toHaveBeenCalledWith(
            "http://localhost:5000/ai/get-review?language=javascript",
            formData,
            {
                headers: {
                    Authorization: "Bearer abc123",
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    });
});