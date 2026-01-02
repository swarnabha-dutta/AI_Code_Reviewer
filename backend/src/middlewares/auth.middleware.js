const { verifyToken } = require("@clerk/backend");

module.exports = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "No token" });
        }

        const token = header.replace("Bearer ", "");
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        req.auth = { userId: payload.sub };
        console.log("🔐 Clerk user:", payload.sub);
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: "Auth failed",
            detail: err.message,
        });
    }
};
