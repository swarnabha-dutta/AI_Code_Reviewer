import { useReview } from "../hooks/useReview";
import ReviewPanel from "./ReviewPanel";

const ReviewContainer = () => {
    const {
        code,
        setCode,
        review,
        isLoading,
        error,
        reviewCode,
    } = useReview();

    const handleReview = async () => {
        if (!code.trim()) return;
        await reviewCode();
    };

    return (
        <div>
            <textarea
                aria-label="code-editor"
                placeholder="Paste your code..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <button onClick={handleReview} disabled={isLoading}>
                {isLoading ? "Reviewing..." : "Review Code"}
            </button>

            {error && <p role="alert">{error}</p>}

            {review && (
                <ReviewPanel
                    review={review}
                    isLoading={isLoading}
                    isCached={false}
                />
            )}
        </div>
    );
};

export default ReviewContainer;