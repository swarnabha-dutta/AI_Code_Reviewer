import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import FileUpload from "./FileUpload";

describe("FileUpload", () => {
    it("renders the upload label when no files are selected", () => {
        render(<FileUpload filesToUpload={[]} onChange={vi.fn()} />);

        expect(
            screen.getByText("Upload Files (Max 10MB)")
        ).toBeInTheDocument();
    });

    it("shows uploaded file count", () => {
        const files = [
            new File(["hello"], "hello.ts", {
                type: "text/typescript",
            }),
            new File(["world"], "world.js", {
                type: "text/javascript",
            }),
        ];

        render(<FileUpload filesToUpload={files} onChange={vi.fn()} />);

        expect(screen.getByText("Uploaded 2 file(s)")).toBeInTheDocument();
    });

    it("renders a hidden file input", () => {
        render(<FileUpload filesToUpload={[]} onChange={vi.fn()} />);

        const input = document.getElementById("file-upload");

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "file");
    });

    it("supports selecting multiple files", () => {
        render(<FileUpload filesToUpload={[]} onChange={vi.fn()} />);

        const input = document.getElementById("file-upload");

        expect(input).toHaveAttribute("multiple");
    });

    it("accepts only supported file extensions", () => {
        render(<FileUpload filesToUpload={[]} onChange={vi.fn()} />);

        const input = document.getElementById("file-upload");

        expect(input).toHaveAttribute(
            "accept",
            ".js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css,.json"
        );
    });

    it("calls onChange when files are selected", async () => {
        const user = userEvent.setup();

        const handleChange = vi.fn();

        render(
            <FileUpload
                filesToUpload={[]}
                onChange={handleChange}
            />
        );

        const input = document.getElementById(
            "file-upload"
        ) as HTMLInputElement;

        const file = new File(
            ["console.log('Hello')"],
            "hello.ts",
            {
                type: "text/typescript",
            }
        );

        await user.upload(input, file);

        expect(handleChange).toHaveBeenCalledTimes(1);

        expect(input.files).toHaveLength(1);

        expect(input.files?.[0].name).toBe("hello.ts");
    });

    it("supports uploading multiple files", async () => {
        const user = userEvent.setup();

        render(
            <FileUpload
                filesToUpload={[]}
                onChange={vi.fn()}
            />
        );

        const input = document.getElementById(
            "file-upload"
        ) as HTMLInputElement;

        const files = [
            new File(["1"], "a.ts", {
                type: "text/typescript",
            }),
            new File(["2"], "b.js", {
                type: "text/javascript",
            }),
        ];

        await user.upload(input, files);

        expect(input.files).toHaveLength(2);

        expect(input.files?.[0].name).toBe("a.ts");
        expect(input.files?.[1].name).toBe("b.js");
    });

    it("associates the label with the file input", () => {
        render(<FileUpload filesToUpload={[]} onChange={vi.fn()} />);

        const label = screen.getByText("Upload Files (Max 10MB)");

        expect(label.tagName).toBe("LABEL");
        expect(label).toHaveAttribute("for", "file-upload");
    });

    it("keeps the correct id on the input", () => {
        render(<FileUpload filesToUpload={[]} onChange={vi.fn()} />);

        const input = document.getElementById("file-upload");

        expect(input).toHaveAttribute("id", "file-upload");
    });

    it("updates the label when exactly one file exists", () => {
        const files = [
            new File(["abc"], "index.ts", {
                type: "text/typescript",
            }),
        ];

        render(<FileUpload filesToUpload={files} onChange={vi.fn()} />);

        expect(screen.getByText("Uploaded 1 file(s)")).toBeInTheDocument();
    });
});