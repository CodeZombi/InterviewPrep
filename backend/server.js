require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const fs = require("fs");


const authRoutes = require('./routes/authRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require("./middlewares/authMiddleware");
const analyzeRoute = require("./routes/analyzeResumePdf");
const interviewRoutes = require("./routes/interviewRoutes");
const mockInterviewRoutes = require("./routes/mockInterview"); 

const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

const tempUploadDir = path.join(__dirname, "tempUploads");
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir);
  console.log("📂 Created tempUploads directory:", tempUploadDir);
}

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB()

// Middleware
app.use(express.json());
app.use(analyzeRoute);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/mockInterview", mockInterviewRoutes);

// AI routes
app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);



// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


