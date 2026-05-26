import React, { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ReviewPanelProps {
    review: string;
    isLoading: boolean;
    isCached: boolean;
}

const ReviewPanel: React.FC<ReviewPanelProps> = ({ review, isLoading, isCached }) => {
    const [copiedFull, setCopiedFull] = useState<boolean>(false);

    const copyText = (text: string): void => {
        navigator.clipboard.writeText(text);
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 1500);
    };

    return (
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
    );
};

export default ReviewPanel;