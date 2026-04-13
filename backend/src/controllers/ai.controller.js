const aiService = require("../services/ai.service");
const Review = require("../models/review.model");
const redis = require("../utils/redis");
const crypto = require("crypto");


// ------------------ PARSE AI OUTPUT ------------------

function parseMarkdownToJSON(markdown) {

    return {

        raw: markdown

    };

}



// ================= AUTH ROUTE =================

exports.getReview = async (req, res) => {

    try {

        const userId = req.auth?.userId || req.auth?.sub;

        let combinedCode = "";

        let fileList = [];

        let language = "manual";



        // files

        if (req.files && req.files.length > 0) {

            fileList = req.files.map(f => f.originalname);

            language = req.files

                .map(f => f.originalname.split(".").pop())

                .join(",");



            combinedCode = req.files

                .map(f => f.buffer.toString("utf8"))

                .join("\n\n");

        }



        // text

        if (!combinedCode && req.body?.code) {

            combinedCode = String(req.body.code).trim();

            fileList.push("Manual Input");

        }



        if (!combinedCode) {

            return res.status(400).json({

                error: "no code"

            });

        }



        // cache key

        const hashKey = crypto

            .createHash("sha256")

            .update(combinedCode)

            .digest("hex");



        // redis

        const cached = await redis.get(hashKey);



        if (cached) {

            console.log("cache hit");

            return res.json({

                success: true,

                cached: true,

                ...cached

            });

        }



        console.log("calling ai...");



        const markdown = await aiService(

            `Review the following code:\n\n${combinedCode}`

        );



        if (!markdown) {

            return res.status(503).json({

                error: "AI busy"

            });

        }



        const reviewJSON = parseMarkdownToJSON(markdown);



        // save

        const saved = await Review.create({

            userId,

            language,

            fileNames: fileList,

            codeSnippet: combinedCode.slice(0, 500),

            reviewContent: markdown

        });



        reviewJSON.reviewId = saved._id;



        // cache save

        await redis.set(

            hashKey,

            reviewJSON,

            { ex: 3600 }

        );



        return res.json({

            success: true,

            cached: false,

            ...reviewJSON

        });

    }

    catch (err) {

        console.log("backend error", err);



        return res.status(500).json({

            error: err.message

        });

    }

};




// ================= TEST ROUTE =================


exports.getReviewTest = async (req, res) => {

    try {

        const code = req.body.code?.trim();



        if (!code || code.length < 3) {

            return res.status(400).json({

                success: false,

                error: "No valid code provided"

            });

        }



        const hashKey = crypto

            .createHash("sha256")

            .update(code)

            .digest("hex");



        const cached = await redis.get(hashKey);



        if (cached) {

            console.log("⚡ Redis Cache HIT (TEST)");


            return res.json({

                success: true,

                cached: true,

                testMode: true,

                ...cached

            });

        }



        console.log("🤖 Calling AI (TEST)...");



        const markdown = await aiService(

            `Review the following code:\n\n${code}`

        );



        if (!markdown || typeof markdown !== "string") {

            return res.status(503).json({

                success: false,

                error: "AI busy, try again"

            });

        }



        const reviewJSON = parseMarkdownToJSON(markdown);



        await redis.set(

            hashKey,

            reviewJSON,

            { ex: 3600 }

        );



        return res.json({

            success: true,

            cached: false,

            testMode: true,

            ...reviewJSON

        });



    } catch (err) {

        console.error("❌ TEST REVIEW ERROR:", err);


        return res.status(500).json({

            success: false,

            error: err.message || "Internal server error"

        });

    }

};