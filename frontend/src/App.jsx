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
  // for applying multiple files upload 
  const [filesToUpload, setFilesToUpload] = useState([]);

  const [code, setCode] = useState(`const sum = () => {
      return 1 + 1;
}
`);
  const [review, setReview] = useState(``);
  const [isLoading, setIsLoading] = useState(false); // <-- loading state
  const Backend_URL = 'http://localhost:5000/ai/get-review';


  useEffect(() => {
    prism.highlightAll();
  });

  // replace your current handleFileChange with this:
const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files || []);
  
  setFilesToUpload(selectedFiles);

  if (selectedFiles.length > 0) {
    // create a reader Promise per file
    const readers = selectedFiles.map(file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // add a clear separator/name so user can see file boundaries
          resolve(`\n\n### File: ${file.name} ###\n\n${e.target.result}`);
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsText(file);
      })
    );

    Promise.all(readers)
      .then(contents => {
        // ✅ Instead of replacing, append new content to existing code
      setCode((prevCode) => prevCode + '\n' + contents.join('\n'));
      })
      .catch(err => {
        console.error("Error reading files:", err);
        setReview(`⚠️ Error reading files: ${err.message}`);
      })
      .finally(() => {
        // reset input so selecting same files again will fire onChange
        if (event && event.target) event.target.value = '';
      });
  } else {
    setCode(''); // or default snippet
    if (event && event.target) event.target.value = '';
  }
};

  async function reviewCode() {
    try {
      setIsLoading(true);      // start loading

      setReview("");           // clear old review
      
      const formData = new FormData();

      console.log(`formData:${formData}`);
      if (filesToUpload.length === 0 && code.trim() === '') {
          setReview("Please provide at least one file or some code to review.");
          return; 
      }


      if (filesToUpload.length > 0) {
        filesToUpload.forEach(file => {
          formData.append('codeFiles', file);
        });
      } else {
        formData.append('code', code);
      }
      const response = await axios.post(Backend_URL, formData);


      setReview(response.data); // set new review
      setFilesToUpload([]);
    
    } catch (error) {

      const errorMessage = error.response?.data?.error || "⚠️ Error fetching review. Please check file size (Max 10MB total) and try again.";
      setReview(errorMessage);
    } finally {
      setIsLoading(false);     // stop loading
    }
  };
  
  return (
    <>
      <main
          style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh", // Full viewport height for split screen
          color: "#ffffff",
          backgroundColor: "#0d1117",
        }}
      >
        <div className="left">
          <div className="code"
            style={{
            flex: 1, // Takes up 50% width
            display: "flex",
            flexDirection: "column", // STACK CHILDREN VERTICALLY (Editor, then Buttons)
            height: "100vh",
            borderRight: "1px solid #30363d",
            padding: "1rem", // Add padding here for better spacing
          }}
          >
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #30363d", 
                borderRadius: "0.7rem",
                height: "100%", // Crucial: Textarea fills its parent height
                width: "100%",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
                backgroundColor: "#1e1e1e",
                color: "#ffffff",
                padding: '10px',
                resize: 'none' // Prevent manual resizing
              }}
            />
          </div>
          <div className="controls">
            {/* file Inputs  */}
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept=".js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.html,.css,.json"
              multiple
              style={{ display: "none" }} // hide default input button
            />
            
             {/* ✅ Custom upload button that triggers hidden input */}
              <label
                htmlFor="file-upload"
                className="upload-label"
                style={{
                  display: "inline-block",
                  backgroundColor: "#15e7faff",
                  color: "#000",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
              {
                filesToUpload.length > 0 ? `Uploaded${filesToUpload.length} file(s)`
                :`Upload Files (Max 10MB)`  
              }
            </label>
          </div>
          <div
            onClick={reviewCode}
            className="review"
            style={{
                  display: "inline-block",
                  backgroundColor: "#15e7faff",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "0.2s",
                }}  
          >Review</div>
        </div>
        <div className="right"
          style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                backgroundColor: "#0e1117",
                color: "#ffffff",
          }}
        >
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
