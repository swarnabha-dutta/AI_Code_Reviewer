import express from "express";
import aiController from "../controllers/ai.controller";
import upload from "../middlewares/upload.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();


// AUTH REQUIRED
router.post(
    "/get-review",
    authMiddleware,
    upload.any(),
    aiController.getReview
);


// TEST MODE (NO AUTH)
router.post(
    "/get-review-test",
    upload.array("codeFiles", 10),
    aiController.getReviewTest
);


export default router;
