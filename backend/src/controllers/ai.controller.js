const aiService = require("../services/ai.service.js");
const Review = require("../models/review.model.js");
const redis = require("../utils/redis.js");
const crypto = require("crypto");

function parseMarkdownToJSON(markdown) {
  try {
    return {
      summary: markdown.match(/## Summary([\s\S]*?)(##|$)/)?.[1]?.trim() || "",
      critical: markdown.match(/## Critical Issues([\s\S]*?)(##|$)/)?.[1]?.trim().split("\n").filter(Boolean) || [],
      major: markdown.match(/## Major Concerns([\s\S]*?)(##|$)/)?.[1]?.trim().split("\n").filter(Boolean) || [],
      improvements: markdown.match(/## Improvements([\s\S]*?)(##|$)/)?.[1]?.trim().split("\n").filter(Boolean) || [],
      positive: markdown.match(/## Positive Highlights([\s\S]*?)(##|$)/)?.[1]?.trim().split("\n").filter(Boolean) || [],
      nextSteps: markdown.match(/## Next Steps([\s\S]*?)(##|$)/)?.[1]?.trim() || "",
      rawMarkdown: markdown
    };
  } catch {
    return { rawMarkdown: markdown };
  }
}

module.exports.getReview = async (req, res) => {
  let combinedCode = "";
  let fileExtension = "manual";
  let fileList = [];

  if (req.files && req.files.length > 0) {
    fileList = req.files.map((file) => file.originalname);
    fileExtension = `multi:${req.files.length}`;
    combinedCode = req.files
      .map(
        (file) =>
          `\n\n### File: ${file.originalname} ###\n\n${file.buffer.toString("utf8")}`
      )
      .join("\n");
  } else if (req.body.code) {
    combinedCode = req.body.code;
    fileList.push("Manual Input");
  }

  const hashKey = crypto.createHash("sha256").update(combinedCode).digest("hex");

  // Force refresh — clear cache
  if (req.body.force === "1") {
    await redis.del(hashKey);
    console.log("♻️ Force refresh – cache cleared");
  }

  // 1️⃣ Check Redis Cache
  const cached = await redis.get(hashKey);
  if (cached) {
    console.log("⚡ Redis Cache HIT");
    return res.status(200).json({
      success: true,
      cached: true,
      ...JSON.parse(cached),
    });
  }

  try {
    // 2️⃣ AI Call
    const reviewMarkdown = await aiService(`Perform review: \n${combinedCode}`);
    if (!reviewMarkdown) {
      console.log("⚠️ AI returned null");
      return res.status(429).json({
        success: false,
        error: "Gemini quota exceeded — try again after 1 minute",
        cached: false,
      });
    }

    const reviewJSON = parseMarkdownToJSON(reviewMarkdown);

    // 3️⃣ Save in DB
    const saved = await Review.create({
      language: fileExtension,
      fileNames: fileList,
      codeSnippet: combinedCode.substring(0, 490),
      reviewContent: reviewMarkdown,
    });

    reviewJSON.reviewId = saved._id;

    // 4️⃣ Save Cache – 1 hr
    await redis.set(hashKey, JSON.stringify(reviewJSON), "EX", 3600);
    console.log("💾 Mongo + Redis Saved");

    return res.status(200).json({
      success: true,
      cached: false,
      ...reviewJSON,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};
