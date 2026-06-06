import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";



const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const header = req.headers.authorization;
        console.log("HEADER:", header);
        console.log("SECRET:", process.env.CLERK_SECRET_KEY);

        if (!header?.startsWith("Bearer ")) {
            res.status(401).json({ success: false, error: "No token" });
            return;
        }

        const token = header.replace("Bearer ", "");
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY ?? "",
            audience: "https://ai-code-reviewer-frontend-feb.onrender.com", 
        });

        (req as any).auth = { userId: payload.sub };
        console.log("🔐 Clerk user:", payload.sub);
        next();
    } catch (err) {
        const error = err as Error;
        res.status(401).json({
            success: false,
            error: "Auth Failed",
            detail: error.message
        })
    }
};

export default authMiddleware;
