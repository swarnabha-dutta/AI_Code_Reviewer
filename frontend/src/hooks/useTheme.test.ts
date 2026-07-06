import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute("data-theme");
    });

    it("should use dark theme by default", () => {
        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe("dark");
    });

    it("should read theme from localStorage", () => {
        localStorage.setItem("theme", "light");

        const { result } = renderHook(() => useTheme());

        expect(result.current.theme).toBe("light");
    });

    it("should set data-theme attribute on document", () => {
        const { result } = renderHook(() => useTheme());

        expect(document.documentElement.getAttribute("data-theme")).toBe(
            result.current.theme
        );
    });

    it("should save theme to localStorage", () => {
        renderHook(() => useTheme());

        expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("should toggle theme from dark to light", () => {
        const { result } = renderHook(() => useTheme());

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe("light");
        expect(localStorage.getItem("theme")).toBe("light");
        expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });

    it("should toggle theme from light to dark", () => {
        localStorage.setItem("theme", "light");

        const { result } = renderHook(() => useTheme());

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    });
});