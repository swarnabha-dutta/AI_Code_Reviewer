const express = require("express");
const aiController = require("../controllers/ai.controller");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// AUTH REQUIRED
router.post(
    "/get-review",
    authMiddleware,
    upload.array("codeFiles", 10),
    aiController.getReview
);

// TEST MODE (NO AUTH)
router.post(
    "/get-review-test",
    upload.array("codeFiles", 10),
    aiController.getReviewTest
);

module.exports = router;
