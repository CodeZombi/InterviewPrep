const express = require('express');
const { createInterview, getInterviewById, getMyInterviews, deleteInterview } = require('../controllers/InterviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', protect, createInterview);
router.get('/my-interviews', protect, getMyInterviews);
router.get('/:id', protect, getInterviewById);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
