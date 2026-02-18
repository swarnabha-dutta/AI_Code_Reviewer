const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// log
app.use((req, _, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

app.get("/health", (_, res) => {
    res.json({ status: "ok", time: new Date() });
});

app.get("/", (_, res) => {
    res.send("API Running 🚀");
});

app.use("/ai", aiRoutes);

app.use(errorHandler);

module.exports = app;
