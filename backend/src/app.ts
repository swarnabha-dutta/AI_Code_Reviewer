import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";
import errorHandler from "./middlewares/errorHandler";
import { stats } from "./controllers/ai.controller";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req: Request, _: Response, next: NextFunction) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});

app.get("/health", (_: Request, res: Response) => {
    res.json({ status: "ok", time: new Date() });
});

app.get("/", (_: Request, res: Response) => {
    res.send("API Running 🚀");
});

app.get("/stats", (_: Request, res: Response) => {
    const hitRate = stats.totalRequests
        ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(1)
        : 0;

    res.json({
        totalRequests: stats.totalRequests,
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        cacheHitRate: hitRate + "%",
        apiCallReduction: hitRate + "%",
        dbLoadReduction: hitRate + "%",
    });
});

app.use("/ai", aiRoutes);
app.use(errorHandler);

export default app;