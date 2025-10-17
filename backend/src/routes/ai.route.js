const express = require('express');
const aiController = require("../controllers/ai.controller.js");
const uploadMiddleware = require("../middlewares/upload.middleware.js");

const router = express.Router();


router.post("/get-review", uploadMiddleware, aiController.getReview);


module.exports = router; 
