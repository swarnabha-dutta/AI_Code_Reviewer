const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: { // 🆕 Track user
        type: String,
        required: true,
        index: true,
    },
    language: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    fileNames: {
        type: [String],
        default: [],
    },
    codeSnippet: {
        type: String,
        required: true,
        maxlength: 500,
    },
    reviewContent: {
        type: String,
        required: true,
    },
    reviewedAt: {
        type: Date,
        default: Date.now,
        index: true,
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;