const express      = require("express");
const {protect}  = require("../middlewares/authMiddleware");
const upload       = require("../middlewares/multerConfig");

const {
  createMockInterview,
  transcribeVideo,
  analyzeTranscript,
  getInterviewResult,
  getInterviewStatus,
} = require("../controllers/mockInterview");

const MockInterview = require("../models/mockInterview");

const router = express.Router();

/* ---------- routes ---------- */
router.post("/create", protect, createMockInterview);

router.get("/mymock-sessions", protect, async (req, res) => {
  try {
    const user = req.user._id;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const rows = await MockInterview.find({ user })
      .select("createdAt questions.summary questions.rating")
      .sort({ createdAt: -1 });

    res.json({ success: true, interviews: rows });
  } catch (err) {
    console.error("my-interviews route error:", err);
    res.status(500).json({ error: "DB error" });
  }
});



router.get("/:id/status", protect, getInterviewStatus);

router.post(
  "/:id/transcribe",
  protect,
  upload.single("video"),
  transcribeVideo
);

router.post("/:id/analyze", protect, analyzeTranscript);
router.get("/:id/result",  protect, getInterviewResult);

// ✅ Get single interview summary
router.get("/:id", protect, async (req, res) => {
  try {
    const interview = await MockInterview.findById(req.params.id);
    if (!interview) return res.status(403).json({ error: "Unauthorized" });
    res.json({ interview });
  } catch (err) {
    console.error("[GET /:id]", err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// ❌ Delete interview
router.delete("/:id", protect, async (req, res) => {
  try {
    const interview = await MockInterview.findById(req.params.id);
    if (!interview || interview.userId !== req.user.uid) return res.status(403).json({ error: "Unauthorized" });
    await interview.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("[DELETE /:id]", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;