const express = require("express");
const cors = require('cors'); 
const aiRouter = require("./routes/ai.routes.js");

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Routes
app.use("/ai", aiRouter); 

module.exports = app;
