const aiService = require("../services/ai.service");
const Review = require("../models/review.model");
const redis = require("../utils/redis");
const crypto = require("crypto");

// ------------------ PARSE AI OUTPUT ------------------
function parseMarkdownToJSON(markdown) {
    return {
        raw: markdown,           // ✅ frontend will read this
    };
}

// ================= AUTH ROUTE =================
exports.getReview = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.auth?.sub;

        let combinedCode = "";
        let fileList = [];
        let language = "manual";

        // ---------- FILE UPLOAD ----------
        if (req.files && req.files.length > 0) {
            fileList = req.files.map(f => f.originalname);
            language = req.files.map(f => f.originalname.split(".").pop()).join(",");

            combinedCode = req.files
                .map(f => f.buffer.toString("utf8"))
                .join("\n\n");
        }
        // ---------- TEXT INPUT ----------
        else if (req.body.code) {
            combinedCode = req.body.code.trim();
            fileList.push("Manual Input");
        }

        if (!combinedCode) {
            return res.status(400).json({
                success: false,
                error: "No code provided",
            });
        }

        const hashKey = crypto
            .createHash("sha256")
            .update(combinedCode)
            .digest("hex");

        // ---------- CACHE HIT ----------
        const cached = await redis.get(hashKey);
        if (cached) {
            console.log("⚡ Redis Cache HIT (AUTH)");
            return res.json({
                success: true,
                cached: true,
                ...cached,
            });
        }

        // ---------- AI CALL ----------
        const markdown = await aiService(`Review:\n${combinedCode}`);
        const reviewJSON = parseMarkdownToJSON(markdown);

        // ---------- SAVE TO DB ----------
        const saved = await Review.create({
            userId,
            language,
            fileNames: fileList,
            codeSnippet: combinedCode.slice(0, 500),
            reviewContent: markdown,
        });

        reviewJSON.reviewId = saved._id;

        // ---------- CACHE STORE ----------
        await redis.set(hashKey, reviewJSON, { ex: 3600 });

        return res.json({
            success: true,
            cached: false,
            ...reviewJSON,
        });

    } catch (err) {
        console.error("❌ AUTH REVIEW ERROR:", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

// ================= TEST ROUTE =================
exports.getReviewTest = async (req, res) => {
    try {
        const code = req.body.code?.trim();
        if (!code) {
            return res.status(400).json({
                success: false,
                error: "No code provided",
            });
        }

        const hashKey = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");

        // ---------- CACHE HIT ----------
        const cached = await redis.get(hashKey);
        if (cached) {
            console.log("⚡ Redis Cache HIT (TEST)");
            return res.json({
                success: true,
                cached: true,
                testMode: true,
                ...cached,
            });
        }

        const markdown = await aiService(`Review:\n${code}`);
        const reviewJSON = parseMarkdownToJSON(markdown);

        await redis.set(hashKey, reviewJSON, { ex: 3600 });

        return res.json({
            success: true,
            cached: false,
            testMode: true,
            ...reviewJSON,
        });

    } catch (err) {
        console.error("❌ TEST REVIEW ERROR:", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
