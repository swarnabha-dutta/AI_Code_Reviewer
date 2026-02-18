const express = require("express");
const aiController = require("../controllers/ai.controller");
const upload = require("../middlewares/upload.middleware");
const { requireAuth } = require("@clerk/express");
const router = express.Router();

// AUTH REQUIRED
router.post(
    "/get-review",
    requireAuth(),
    upload.any(),
    aiController.getReview
);

// TEST MODE (NO AUTH)
router.post(
    "/get-review-test",
    upload.array("codeFiles", 10),
    aiController.getReviewTest
);

module.exports = router;
