import mongoose, {Document , Schema } from "mongoose";

export interface IReview extends Document{
    userId: string;
    language: string;
    fileNames: string[];
    codeSnippet: string;
    reviewContent: string;
    reviewedAt: Date;
}

const reviewSchema = new Schema<IReview>({
    userId: { type: String, required: true, index: true },
    language: { type: String, required: true, trim: true, index: true },
    fileNames: { type: [String], default: [] },
    codeSnippet: { type: String, required: true, maxlength: 500 },
    reviewContent: { type: String, required: true },
    reviewedAt: { type: Date, default: Date.now, index: true },
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;