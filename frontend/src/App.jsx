/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import axios from 'axios';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Markdown from 'react-markdown';
import './App.css';

function App() {

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [code, setCode] = useState(`const sum = () => {
  return 1 + 1;
}`);
  const [review, setReview] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [copiedFull, setCopiedFull] = useState(false);

  const Backend_URL = "http://localhost:5000/ai/get-review";  

  useEffect(() => prism.highlightAll());
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => prev === "dark" ? "light" : "dark");

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 1500);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFilesToUpload(selectedFiles);

    if (selectedFiles.length === 0) return;

    const readers = selectedFiles.map(file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(`\n\n### File: ${file.name} ###\n\n${e.target.result}`);
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsText(file);
      })
    );

    Promise.all(readers)
      .then(contents => setCode((prev) => prev + "\n" + contents.join("\n")))
      .catch(err => setError(`⚠️ ${err.message}`))
      .finally(() => (event.target.value = ""));
  };

  async function reviewCode() {
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
        filesToUpload.forEach(file => formData.append("codeFiles", file));
      } else {
        formData.append("code", code);
      }

      const response = await axios.post(Backend_URL, formData);
      setReview(response.data.rawMarkdown);
      setIsCached(response.data.cached === true);
      setFilesToUpload([]);

    } catch (err) {
      setError(err.response?.data?.error || "⚠️ Something went wrong.");
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

      <main>
        <div className="left">
          <textarea
            className="code-editor"
            value={code}
            onChange={e => setCode(e.target.value)}
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
                : `Upload Files (Max 10MB)` }
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
    </>
  );
}

export default App;