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
  console.log('✅ Controller executing!');

  // 🆕 Get authenticated user ID from Clerk
  // const userId = req.auth?.()?.userId;
  const userId = req.auth?.()?.userId || null;

  // Check if authenticated
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please sign in."
    });
  }

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

  // 1️⃣ Check Redis Cache FIRST (No rate limit for cached)
  const cached = await redis.get(hashKey);
  if (cached) {
    console.log("⚡ Redis Cache HIT - No rate limit applied");
    return res.status(200).json({
      success: true,
      cached: true,
      ...JSON.parse(cached),
    });
  }

  // 🆕 2️⃣ Per-User Rate Limiting (Only for NEW API calls)
  const rateLimitKey = `ratelimit:${userId}`;
  const requestCount = await redis.get(rateLimitKey);
  const limit = 10; // 10 requests per hour per user

  if (requestCount && parseInt(requestCount) >= limit) {
    const ttl = await redis.ttl(rateLimitKey);
    return res.status(429).json({
      success: false,
      error: `Rate limit exceeded. Try again in ${Math.ceil(ttl / 60)} minutes.`,
      remainingTime: ttl,
      limit: limit
    });
  }

  try {
    // 3️⃣ Increment rate limit counter (Only for NEW requests)
    await redis.incr(rateLimitKey);
    await redis.expire(rateLimitKey, 3600); // 1 hour TTL
    
    const remaining = limit - (parseInt(requestCount || 0) + 1);
    console.log(`🔢 User ${userId}: ${remaining} requests remaining`);

    // 4️⃣ AI Call
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

    // 5️⃣ Save in DB with userId
    const saved = await Review.create({
      userId: userId, // 🆕 Track which user made the request
      language: fileExtension,
      fileNames: fileList,
      codeSnippet: combinedCode.substring(0, 490),
      reviewContent: reviewMarkdown,
    });

    reviewJSON.reviewId = saved._id;

    // 6️⃣ Save Cache – 1 hr
    await redis.set(hashKey, JSON.stringify(reviewJSON), "EX", 3600);
    console.log("💾 Mongo + Redis Saved");

    return res.status(200).json({
      success: true,
      cached: false,
      remainingRequests: remaining,
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

module.exports.getReviewTest = async (req, res) => {
  console.log('✅ TEST Controller executing!');

  // 🔧 Mock userId for testing
  const userId = "test-user-postman-demo";

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

  // Force refresh
  if (req.body.force === "1") {
    await redis.del(hashKey);
    console.log("♻️ Force refresh – cache cleared");
  }

  // Check Redis Cache
  const cached = await redis.get(hashKey);
  if (cached) {
    console.log("⚡ Redis Cache HIT - No rate limit applied");
    return res.status(200).json({
      success: true,
      cached: true,
      testMode: true, // 🔧 Indicate test mode
      ...JSON.parse(cached),
    });
  }

  // Per-User Rate Limiting
  const rateLimitKey = `ratelimit:${userId}`;
  const requestCount = await redis.get(rateLimitKey);
  const limit = 10;

  if (requestCount && parseInt(requestCount) >= limit) {
    const ttl = await redis.ttl(rateLimitKey);
    return res.status(429).json({
      success: false,
      error: `Rate limit exceeded. Try again in ${Math.ceil(ttl / 60)} minutes.`,
      remainingTime: ttl,
      limit: limit,
      testMode: true
    });
  }

  try {
    await redis.incr(rateLimitKey);
    await redis.expire(rateLimitKey, 3600);
    
    const remaining = limit - (parseInt(requestCount || 0) + 1);
    console.log(`🔢 TEST User ${userId}: ${remaining} requests remaining`);

    const reviewMarkdown = await aiService(`Perform review: \n${combinedCode}`);
    if (!reviewMarkdown) {
      console.log("⚠️ AI returned null");
      return res.status(429).json({
        success: false,
        error: "Gemini quota exceeded — try again after 1 minute",
        cached: false,
        testMode: true
      });
    }

    const reviewJSON = parseMarkdownToJSON(reviewMarkdown);

    const saved = await Review.create({
      userId: userId,
      language: fileExtension,
      fileNames: fileList,
      codeSnippet: combinedCode.substring(0, 490),
      reviewContent: reviewMarkdown,
    });

    reviewJSON.reviewId = saved._id;
    await redis.set(hashKey, JSON.stringify(reviewJSON), "EX", 3600);
    console.log("💾 Mongo + Redis Saved");

    return res.status(200).json({
      success: true,
      cached: false,
      remainingRequests: remaining,
      testMode: true, // 🔧 Indicate test mode
      ...reviewJSON,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).send({
      success: false,
      error: "Internal Server Error",
      testMode: true
    });
  }
};