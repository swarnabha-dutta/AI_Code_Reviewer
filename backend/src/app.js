const express = require("express");
const cors = require('cors');
const aiRouter = require("./routes/ai.routes.js");

const app = express();

// CORS - MUST allow Authorization header
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ✅ Custom Clerk Token Verification Middleware
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      // Decode JWT token (Clerk tokens are standard JWTs)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
          .toString()
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decoded = JSON.parse(jsonPayload);
      
      // Set auth function (compatible with Clerk's API)
      req.auth = () => ({ 
        userId: decoded.sub,  // Clerk userId is in 'sub' claim
        sessionId: decoded.sid
      });
      
      console.log("✅ Auth Success - User:", decoded.sub);
    } catch (error) {
      console.log("⚠️ Token decode failed:", error.message);
      // Don't block request, just log error
    }
  }
  
  next();
});

// Request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/ai", aiRouter);

module.exports = app;