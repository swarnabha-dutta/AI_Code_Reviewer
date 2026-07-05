import { render, screen } from "@testing-library/react";
import ReviewFetcher from "./ReviewFetcher";
import { describe, expect, it } from "vitest";

describe("ReviewFetcher", async () => {
    it("loads review from MSW", async () => {
        render(<ReviewFetcher />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        expect(
            await screen.findByText("MSW Mock Review")
        ).toBeInTheDocument();
    });
});