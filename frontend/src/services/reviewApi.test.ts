import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { reviewApi } from "./reviewApi";

vi.mock("axios");

const mockedAxios = vi.mocked(axios);

describe("reviewApi", () => {
    const backendUrl = "http://localhost:5000";
    const token = "mock-token";

    let formData: FormData;

    beforeEach(() => {
        vi.clearAllMocks();

        formData = new FormData();
        formData.append("code", "console.log('Hello')");
    });

    it("calls axios.post with correct URL", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {
                raw: "Review Success",
                cached: false,
            },
        });

        await reviewApi({
            backendUrl,
            token,
            formData,
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            `${backendUrl}/ai/get-review`,
            formData,
            expect.any(Object)
        );
    });

    it("sends Authorization header", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {},
        });

        await reviewApi({
            backendUrl,
            token,
            formData,
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(FormData),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${token}`,
                }),
            })
        );
    });

    it("sends multipart/form-data header", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {},
        });

        await reviewApi({
            backendUrl,
            token,
            formData,
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(FormData),
            expect.objectContaining({
                headers: expect.objectContaining({
                    "Content-Type": "multipart/form-data",
                }),
            })
        );
    });

    it("returns response data", async () => {
        mockedAxios.post.mockResolvedValue({
            data: {
                raw: "AI Review",
                cached: true,
            },
        });

        const result = await reviewApi({
            backendUrl,
            token,
            formData,
        });

        expect(result).toEqual({
            raw: "AI Review",
            cached: true,
        });
    });

    it("throws axios error", async () => {
        mockedAxios.post.mockRejectedValue(
            new Error("Network Error")
        );

        await expect(
            reviewApi({
                backendUrl,
                token,
                formData,
            })
        ).rejects.toThrow("Network Error");
    });
});