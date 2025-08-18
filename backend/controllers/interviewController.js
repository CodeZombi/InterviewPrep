const Interview = require("../models/Interview");
const Question = require("../models/Question");
const MockInterview = require("../models/mockInterview");
// @desc    Create a new interview and linked questions
// @route   POST /api/interviews/create
// @access  Private
exports.createInterview = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;
    const userId = req.user._id; // Assuming you have a middleware setting req.user

    const interview = await Interview.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          interview: interview._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    interview.questions = questionDocs;
    await interview.save();

    res.status(201).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get all interviews for the logged-in user
// @route   GET /api/interviews/my-interviews
// @access  Private
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions");
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a interview by ID with populated questions
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec();

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "interview not found" });
    }

    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a interview and its questions
// @route   DELETE /api/interviews/:id
// @access  Private
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Check if the logged-in user owns this interview
    if (interview.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this interview" });
    }

    // First, delete all questions linked to this interview
    await MockInterview.deleteMany({ user: interview._id });

    // Then, delete the interview
    await Interview.deleteOne();

    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
