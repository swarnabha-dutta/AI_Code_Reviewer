require('dotenv').config();

const mongoose = require("mongoose");
const app = require("./src/app.js"); 

const port = process.env.PORT || 3000; 

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fileUploadCodeReview";
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`MongoDB Connected Successfully! 💾`);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    })
