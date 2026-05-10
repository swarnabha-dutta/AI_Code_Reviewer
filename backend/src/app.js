const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");
const errorHandler = require("./middlewares/errorHandler");
const { stats } = require("./controllers/ai.controller");

const app = express();

app.use(cors());

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
app.get("/stats",(req,res)=>{
    const hitRate  = stats.totalRequests 
                     ? ((stats.cacheHits/stats.totalRequests) * 100).toFixed(1) 
                     : 0;

    res.json({
        totalRequests:stats.totalRequests,
        cacheHits:stats.cacheHits,
        cacheMisses:stats.cacheMisses,
        cacheHitRate: hitRate +  "%",
        apiCallReduction: hitRate + "%",
        dbLoadReduction:hitRate + "%"
    });                 
});


app.use("/ai", aiRoutes);
app.use(errorHandler);





module.exports = app;
