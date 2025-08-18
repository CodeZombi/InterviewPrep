const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   

    questions: [
      {
        text: String,
        category: String,

        transcription: { type: String, default: "" },
        summary:       { type: String, default: "" },
        rating:        { type: Number, default: null },

        
        analysis: {
          speech:     { type: mongoose.Schema.Types.Mixed, default: {} }, 
          video:      { type: mongoose.Schema.Types.Mixed, default: {} },
          voiceCoach: { type: mongoose.Schema.Types.Mixed, default: {} }, 
        },
      },
    ],

    videoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);