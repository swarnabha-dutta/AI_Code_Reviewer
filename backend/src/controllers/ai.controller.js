const aiService = require("../services/ai.service.js")
const Review = require("../models/review.model.js");


module.exports.getReview = async (req, res) => {

    let combinedCode = "";
    let fileExtension = 'manual';
    let fileList = [];

    if (req.files && req.files.length > 0) {
        fileList = req.files.map(file => file.originalname);
        fileExtension = 'multi:' + req.files.length;


        console.log(`Processing ${req.files.length} files: ${fileList.join(', ')}`);

        combinedCode = req.files.map((file) => {
            
            return `\n\n### File: ${file.originalname} ###\n\n` + file.buffer.toString('utf8');
        }).join('\n');
    } else if (req.body.code) {
        
        fileList.push('Manual Input');
        combinedCode = req.body.code;
        fileExtension = 'manual';
    } else {
        // Error if no files or code provided
        return res.status(400).send({ error: "Code or file(s) is required for review." });
    }

    try {
        const prompt = `Perform a comprehensive code review for the following code snippet(s), which include the files: ${fileList.join(', ')}. Focus on best practices, security vulnerabilities, and logic flaws. Provide a detailed summary and then specific feedback for each file/snippet.\n\n${combinedCode}`;

        // Assuming aiService handles the call to the Gemini API
        const reviewText = await aiService(prompt);

        // Save review to MongoDB
        const newReview = new Review({
            language: fileExtension,
            fileNames: fileList,
            codeSnippet: combinedCode.substring(0, 490) + (combinedCode.length > 490 ? '...' : ''),
            reviewContent: reviewText,
        });

        await newReview.save();
        console.log(`Review saved to MongoDB.`);
        res.send(reviewText);
    } catch (error) {
        console.error("AI Review or Database Error:", error);
        
        res.status(500).send({ error: "Internal Server Error during AI processing or database operation. Check file size limits." });
    }
}
