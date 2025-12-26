const express = require("express");
const aiController = require("../controllers/ai.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const router = express.Router();

// Correct multer usage
router.post("/get-review", upload.array("codeFiles", 10), aiController.getReview);

module.exports = router;
