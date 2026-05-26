import { Request, Response } from "express";
import crypto from "crypto";
import aiService from "../services/ai.service";
import Review from "../models/review.model";
import  redis  from "../utils/redis";

// ================= STATS =================

interface Stats {
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
}

export const stats: Stats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
};

// ================= TYPES =================

interface ReviewJSON {
    raw: string;
    reviewId?: unknown;
}

interface AuthRequest extends Request {
    auth?: { userId: string };
}

// ================= UTIL =================

function parseMarkdownToJSON(markdown: string): ReviewJSON {
    return { raw: markdown };
}

// ================= AUTH ROUTE =================

export const getReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.auth?.userId;
        let combinedCode = "";
        let fileList: string[] = [];
        let language = "manual";

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            fileList = req.files.map(f => f.originalname);
            language = req.files.map(f => f.originalname.split(".").pop() ?? "").join(",");
            combinedCode = req.files.map(f => f.buffer.toString("utf8")).join("\n\n");
        }

        if (!combinedCode && req.body?.code) {
            combinedCode = String(req.body.code).trim();
            fileList.push("Manual Input");
        }

        if (!combinedCode) {
            res.status(400).json({ error: "no code" });
            return;
        }

        const hashKey = crypto.createHash("sha256").update(combinedCode).digest("hex");
        const cached = await redis.get(hashKey);
        stats.totalRequests++;

        if (cached) {
            stats.cacheHits++;
            console.log("cache hit");
            res.json({ success: true, cached: true, ...(cached as object) });
            return;
        }

        stats.cacheMisses++;
        console.log("calling ai...");

        const markdown = await aiService(`Review the following code:\n\n${combinedCode}`);

        if (!markdown) {
            res.status(503).json({ error: "AI busy" });
            return;
        }

        const reviewJSON = parseMarkdownToJSON(markdown);

        const saved = await Review.create({
            userId,
            language,
            fileNames: fileList,
            codeSnippet: combinedCode.slice(0, 500),
            reviewContent: markdown,
        });

        reviewJSON.reviewId = saved._id;
        await redis.set(hashKey, reviewJSON, { ex: 3600 });

        res.json({ success: true, cached: false, ...reviewJSON });

    } catch (err) {
        const error = err as Error;
        console.log("backend error", error);
        res.status(500).json({ error: error.message });
    }
};

// ================= TEST ROUTE =================

export const getReviewTest = async (req: Request, res: Response): Promise<void> => {
    try {
        const code = req.body.code?.trim();

        if (!code || code.length < 3) {
            res.status(400).json({ success: false, error: "No valid code provided" });
            return;
        }

        const hashKey = crypto.createHash("sha256").update(code).digest("hex");
        const cached = await redis.get(hashKey);
        stats.totalRequests++;

        if (cached) {
            console.log("⚡ Redis Cache HIT (TEST)");
            stats.cacheHits++;
            res.json({ success: true, cached: true, testMode: true, ...(cached as object) });
            return;
        }

        stats.cacheMisses++;
        console.log("🤖 Calling AI (TEST)...");

        const markdown = await aiService(`Review the following code:\n\n${code}`);

        if (!markdown || typeof markdown !== "string") {
            res.status(503).json({ success: false, error: "AI busy, try again" });
            return;
        }

        const reviewJSON = parseMarkdownToJSON(markdown);
        await redis.set(hashKey, reviewJSON, { ex: 3600 });

        res.json({ success: true, cached: false, testMode: true, ...reviewJSON });

    } catch (err) {
        const error = err as Error;
        console.error("❌ TEST REVIEW ERROR:", error);
        res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
};

export default { getReview, getReviewTest, stats };