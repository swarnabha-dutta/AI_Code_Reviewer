import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import axios from 'axios';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Markdown from 'react-markdown';
import './App.css';

function App() {
    const { getToken, isLoaded, userId } = useAuth();

    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [code, setCode] = useState<string>(`const sum = () => {
    return 1 + 1;
}`);
    const [review, setReview] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCached, setIsCached] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") ?? "dark");
    const [copiedFull, setCopiedFull] = useState<boolean>(false);

    const Backend_URL: string = import.meta.env.VITE_API_URL as string;

    // ------------------ SYNTAX HIGHLIGHT ------------------
    useEffect(() => {
        prism.highlightAll();
    }, [review]);

    // ------------------ THEME ------------------
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    // ------------------ COPY ------------------
    const copyText = (text: string): void => {
        navigator.clipboard.writeText(text);
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 1500);
    };

    // ------------------ FILE UPLOAD ------------------
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFiles = Array.from(event.target.files ?? []);
        setFilesToUpload(selectedFiles);

        if (selectedFiles.length === 0) return;

        const readers = selectedFiles.map(
            (file) =>
                new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                        resolve(`\n\n### File: ${file.name} ###\n\n${e.target?.result}`);
                    reader.onerror = () =>
                        reject(new Error(`Failed to read ${file.name}`));
                    reader.readAsText(file);
                })
        );

        Promise.all(readers)
            .then((contents) =>
                setCode((prev) => prev + "\n" + contents.join("\n"))
            )
            .catch((err: Error) => setError(`⚠️ ${err.message}`))
            .finally(() => (event.target.value = ""));
    };

    // ------------------ REVIEW CALL ------------------
    async function reviewCode(): Promise<void> {
        if (!isLoaded || !userId) {
            setError("⚠️ Please sign in first");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            setReview("");

            if (filesToUpload.length === 0 && code.trim() === "") {
                setError("⚠️ write or upload code");
                return;
            }

            const formData = new FormData();

            if (filesToUpload.length > 0) {
                filesToUpload.forEach(file => {
                    formData.append("codeFiles", file);
                });
            } else {
                formData.append("code", code.trim());
            }

            const token = await getToken();

            const response = await axios.post(
                `${Backend_URL}/ai/get-review`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setReview(response.data.raw ?? "");
            setIsCached(response.data.cached === true);
            setFilesToUpload([]);

        } catch (err) {
            console.log("frontend error", err);
            const axiosError = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
            const msg =
                axiosError?.response?.data?.error ||
                axiosError?.response?.data?.message ||
                axiosError.message ||
                "Server error";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {error && (
                <div className="toast-error" onClick={() => setError("")}>
                    {error}
                </div>
            )}

            {/* ------------------ SIGNED OUT ------------------ */}
            <SignedOut>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    gap: "20px",
                    textAlign: "center"
                }}>
                    <h1>🔐 AI Code Reviewer</h1>
                    <p>Please sign in to start reviewing your code</p>
                    <SignInButton mode="modal">
                        <button className="app-button" style={{ padding: "12px 24px", fontSize: "16px" }}>
                            Sign In / Sign Up
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>

            {/* ------------------ SIGNED IN ------------------ */}
            <SignedIn>
                <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 1000 }}>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            baseTheme: "dark",
                            elements: {
                                userButtonPopoverCard: { backgroundColor: "#0d1117", color: "white" },
                                userButtonPopoverActionButton: { color: "white" },
                                userButtonPopoverActionButtonIcon: { color: "white" },
                                userButtonPopoverFooter: { color: "white" },
                                userButtonPopoverHeaderTitle: { color: "white" },
                                userButtonPopoverHeaderSubtitle: { color: "#cfcfcf" },
                            },
                        }}
                    />
                </div>

                <main>
                    <div className="left">
                        <textarea
                            className="code-editor"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <div className="controls">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                onChange={handleFileChange}
                                accept=".js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css,.json"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="file-upload" className="app-button upload-label">
                                {filesToUpload.length > 0
                                    ? `Uploaded ${filesToUpload.length} file(s)`
                                    : `Upload Files (Max 10MB)`}
                            </label>
                            <div onClick={reviewCode} className="app-button review-button">
                                Review
                            </div>
                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
                            </button>
                        </div>
                    </div>

                    <div className="right">
                        {isCached && <span className="cached-badge">⚡ Cached Result</span>}
                        {review && (
                            <div className="copy-full-container">
                                <button className="copy-btn" onClick={() => copyText(review)}>
                                    {copiedFull ? "✔ Copied!" : "📋 Copy Full Output"}
                                </button>
                            </div>
                        )}
                        {isLoading ? (
                            <div className="loading-message">⏳ Finding issues...</div>
                        ) : (
                            <Markdown rehypePlugins={[rehypeHighlight]}>
                                {review}
                            </Markdown>
                        )}
                    </div>
                </main>
            </SignedIn>
        </>
    );
}

export default App;