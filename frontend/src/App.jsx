/* eslint-disable no-unused-vars */
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

    const [filesToUpload, setFilesToUpload] = useState([]);
    const [code, setCode] = useState(`const sum = () => {
  return 1 + 1;
}`);
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCached, setIsCached] = useState(false);
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [copiedFull, setCopiedFull] = useState(false);

    const Backend_URL = import.meta.env.VITE_API_URL;


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
    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 1500);
    };

    // ------------------ FILE UPLOAD ------------------
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFilesToUpload(selectedFiles);

        if (selectedFiles.length === 0) return;

        const readers = selectedFiles.map(
            (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) =>
                        resolve(`\n\n### File: ${file.name} ###\n\n${e.target.result}`);
                    reader.onerror = () =>
                        reject(new Error(`Failed to read ${file.name}`));
                    reader.readAsText(file);
                })
        );

        Promise.all(readers)
            .then((contents) =>
                setCode((prev) => prev + "\n" + contents.join("\n"))
            )
            .catch((err) => setError(`⚠️ ${err.message}`))
            .finally(() => (event.target.value = ""));
    };

    // ------------------ REVIEW CALL ------------------
    async function reviewCode() {
        if (!isLoaded || !userId) {
            setError("⚠️ Please sign in to review code.");
            return;
        }

        try {
            setIsLoading(true);
            setReview("");
            setError("");

            const formData = new FormData();

            if (filesToUpload.length === 0 && code.trim() === "") {
                setError("⚠️ Please upload a file or write code first.");
                return;
            }

            if (filesToUpload.length > 0) {
                filesToUpload.forEach((file) =>
                    formData.append("codeFiles", file)
                );
            } else {
                formData.append("code", code);
            }

            const token = await getToken();
            if (!token) {
                setError("⚠️ Session expired. Please sign in again.");
                return;
            }

            const response = await axios.post(`${Backend_URL}/ai/get-review`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // ✅ FINAL FIX (backend sends `raw`)
            setReview(
                response.data.raw ||
                response.data.rawMarkdown ||
                response.data.reviewContent ||
                ""
            );

            setIsCached(response.data.cached === true);
            setFilesToUpload([]);

        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.error ||
                err.message;

            if (msg?.toLowerCase().includes("expired")) {
                setError("⚠️ Session expired. Please sign in again.");
            } else {
                setError(msg);
            }
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
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        gap: "20px",
                    }}
                >
                    <h1>🔐 AI Code Reviewer</h1>
                    <p>Please sign in to start reviewing your code</p>
                    <SignInButton mode="modal">
                        <button
                            className="app-button"
                            style={{ padding: "12px 24px", fontSize: "16px" }}
                        >
                            Sign In / Sign Up
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>

            {/* ------------------ SIGNED IN ------------------ */}
            <SignedIn>
                <div
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        zIndex: 1000,
                    }}
                >
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            baseTheme: "dark",
                            elements: {
                                userButtonPopoverCard: {
                                    backgroundColor: "#0d1117",
                                    color: "white",
                                },
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

                            <label
                                htmlFor="file-upload"
                                className="app-button upload-label"
                            >
                                {filesToUpload.length > 0
                                    ? `Uploaded ${filesToUpload.length} file(s)`
                                    : `Upload Files (Max 10MB)`}
                            </label>

                            <div
                                onClick={reviewCode}
                                className="app-button review-button"
                            >
                                Review
                            </div>

                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
                            </button>
                        </div>
                    </div>

                    <div className="right">
                        {isCached && (
                            <span className="cached-badge">⚡ Cached Result</span>
                        )}

                        {review && (
                            <div className="copy-full-container">
                                <button
                                    className="copy-btn"
                                    onClick={() => copyText(review)}
                                >
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
