import React from 'react';
import NavBar from '../components/NavBar';
import CodeEditor from '../components/CodeEditor';
import FileUpload from '../components/FileUpload';
import ReviewPanel from '../components/ReviewPanel';
import { useReview } from '../hooks/useReview';
import { useTheme } from '../hooks/useTheme';

const SignedInView: React.FC = () => {
    const { code, review, isLoading, isCached, error, filesToUpload, setCode, setError, handleFileChange, reviewCode } = useReview();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            {error && (
                <div className="toast-error" onClick={() => setError("")}>
                    {error}
                </div>
            )}

            <NavBar theme={theme} onToggleTheme={toggleTheme} />

            <main>
                <div className="left">
                    <CodeEditor code={code} onChange={setCode} />
                    <div className="controls">
                        <FileUpload filesToUpload={filesToUpload} onChange={handleFileChange} />
                        <div onClick={reviewCode} className="app-button review-button">
                            Review
                        </div>
                    </div>
                </div>

                <ReviewPanel review={review} isLoading={isLoading} isCached={isCached} />
            </main>
        </>
    );
};

export default SignedInView;