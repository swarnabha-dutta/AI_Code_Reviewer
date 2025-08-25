/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor'
import "prismjs/themes/prism-tomorrow.css";
import prism from "prismjs";
import axios from 'axios';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; 
import Markdown from 'react-markdown';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState(`const sum = () => {
      return 1 + 1;
}
`);
  const [review, setReview] = useState(``);
  const [isLoading, setIsLoading] = useState(false); // <-- loading state

  useEffect(() => {
    prism.highlightAll();
  });

  async function reviewCode() {
    try {
      setIsLoading(true);      // start loading
      setReview("");           // clear old review
      const response = await axios.post('https://ai-code-reviewer-backend-5yi3.onrender.com/ai/get-review', { code });
      setReview(response.data); // set new review
    } catch (error) {
      setReview("⚠️ Error fetching review. Please try again.");
    } finally {
      setIsLoading(false);     // stop loading
    }
  };
  
  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid green",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className="review">Review</div>
        </div>
        <div className="right">
          {isLoading ? (
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "yellow" }}>
              ⏳ Finding the issues...
            </div>
          ) : (
            <Markdown rehypePlugins={[ rehypeHighlight ]}>
              {review}
            </Markdown>
          )}
        </div>
      </main>
    </>
  )
}

export default App;
