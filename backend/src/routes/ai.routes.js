const express = require("express");
const aiController = require("../controllers/ai.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const router = express.Router();

console.log('🔧 AI Routes loaded'); // Debug log

// POST /ai/get-review
router.post("/get-review", 
  upload.array("codeFiles", 10), 
  aiController.getReview
);


// 🔧 DEVELOPMENT/TESTING ROUTE - No Auth Required
router.post("/get-review-test", 
  upload.array("codeFiles", 10), 
  aiController.getReviewTest  // Different controller
);

module.exports = router;