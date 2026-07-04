import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CodeEditor from "./CodeEditor";
import userEvent from "@testing-library/user-event";
import { useState } from "react";



describe("CodeEditor", () => {
    it("render the textarea", () => {
        render(<CodeEditor code="" onChange={vi.fn()} />);
        const textarea = screen.getByRole("textbox");

        expect(textarea).toBeInTheDocument();
    });


    it("renders the initial code", () => {
        const initialCode = "console.log('Hello World')";
        render(
            <CodeEditor
                code={initialCode}
                onChange={vi.fn()}
            />
        );

        const textarea = screen.getByRole("textbox");

        expect(textarea).toHaveValue(initialCode);
    });


    it("updates the textarea value as the user types", async () => {
        const user = userEvent.setup();

        function Wrapper() {
            const [code, setCode] = useState("");

            return <CodeEditor code={code} onChange={setCode} />
        }
        render(<Wrapper />);

        const textarea = screen.getByRole("textbox");

        await user.type(textarea, "Hello");
        expect(textarea).toHaveValue("Hello");

    });

    it("has the correct css class", () => {
        render(<CodeEditor code="" onChange={vi.fn()} />);
        const textarea = screen.getByRole("textbox");

        expect(textarea).toHaveClass("code-editor");
    });


    it("has the correct title attribute", () => {
        render(<CodeEditor code="" onChange={vi.fn()} />);

        const textarea = screen.getByRole("textbox");

        expect(textarea).toHaveAttribute("title", "Code editor");
    })
});





