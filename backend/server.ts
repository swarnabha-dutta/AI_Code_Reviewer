import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("MongoDB Connected Successfully! 💾");
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    })
    .catch((err: Error) => {
        console.error("MongoDB Error:", err);
        process.exit(1);
    });