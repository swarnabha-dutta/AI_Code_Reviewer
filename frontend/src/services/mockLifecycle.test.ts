import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

describe("Mock Lifecycle", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("clearAllMocks clears call history", async () => {
        const spy = vi.spyOn(axios, "post").mockResolvedValue({
            data: {},
        });

        await axios.post("/api");
        await axios.post("/api");

        expect(spy).toHaveBeenCalledTimes(2);

        vi.clearAllMocks();

        expect(spy).toHaveBeenCalledTimes(0);
    });

    it("resetAllMocks resets implementation", async () => {
        const spy = vi.spyOn(axios, "post").mockResolvedValue({
            data: {
                message: "Mock",
            },
        });

        expect((await axios.post("/api")).data.message).toBe("Mock");

        vi.resetAllMocks();

        expect(spy.getMockImplementation()).toBeUndefined();
    });

    it("restoreAllMocks restores original function", () => {
        const spy = vi.spyOn(axios, "post");

        expect(spy).toBeDefined();

        vi.restoreAllMocks();

        expect(spy.getMockImplementation()).toBeUndefined();
    });
});