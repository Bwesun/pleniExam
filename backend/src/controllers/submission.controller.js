const Submission = require('../models/Submission');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Start an exam
// @route   POST /api/submissions/start
// @access  Private/Candidate
const startExam = async (req, res) => {
  try {
    const { examId } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId).populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if exam is active
    if (!exam.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This exam is not currently active'
      });
    }

    // Check if exam is scheduled
    if (exam.scheduledStart && new Date() < exam.scheduledStart) {
      return res.status(400).json({
        success: false,
        message: 'Exam has not started yet'
      });
    }

    if (exam.scheduledEnd && new Date() > exam.scheduledEnd) {
      return res.status(400).json({
        success: false,
        message: 'Exam has ended'
      });
    }

    // Check if candidate has already taken this exam
    const existingSubmission = await Submission.findOne({
      exam: examId,
      candidate: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already taken this exam'
      });
    }

    // Initialize answers array
    const answers = exam.questions.map(q => ({
      question: q._id,
      answer: '',
      isCorrect: null,
      marksObtained: 0
    }));

    // Create submission
    const submission = await Submission.create({
      exam: examId,
      candidate: req.user._id,
      answers,
      status: 'in-progress'
    });

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('exam')
      .populate('candidate', 'username email firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Exam started successfully',
      data: populatedSubmission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save answer for a question
// @route   PUT /api/submissions/:id/answer
// @access  Private/Candidate
const saveAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if submission belongs to current user
    if (submission.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this submission'
      });
    }

    // Check if submission is still in progress
    if (submission.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a submitted exam'
      });
    }

    // Find and update the answer
    const answerIndex = submission.answers.findIndex(
      a => a.question.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in this submission'
      });
    }

    submission.answers[answerIndex].answer = answer;
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Answer saved successfully',
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit exam
// @route   POST /api/submissions/:id/submit
// @access  Private/Candidate
const submitExam = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('exam')
      .populate('answers.question');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if submission belongs to current user
    if (submission.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this exam'
      });
    }

    // Check if already submitted
    if (submission.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Exam already submitted'
      });
    }

    // Grade MCQ and True/False questions automatically
    let totalScore = 0;
    let hasEssayQuestions = false;

    for (let i = 0; i < submission.answers.length; i++) {
      const answer = submission.answers[i];
      const question = answer.question;

      if (question.questionType === 'essay') {
        hasEssayQuestions = true;
        answer.isCorrect = null; // Will be graded manually
        answer.marksObtained = 0;
      } else {
        // Auto-grade MCQ and True/False
        const isCorrect = answer.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        answer.isCorrect = isCorrect;
        answer.marksObtained = isCorrect ? question.marks : 0;
        totalScore += answer.marksObtained;
      }
    }

    submission.totalScore = totalScore;
    submission.percentage = (totalScore / submission.exam.totalMarks) * 100;
    submission.status = hasEssayQuestions ? 'submitted' : 'graded';
    submission.submittedAt = new Date();

    if (!hasEssayQuestions) {
      submission.gradedAt = new Date();
    }

    await submission.save();

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('exam')
      .populate('candidate', 'username email firstName lastName')
      .populate('answers.question');

    res.status(200).json({
      success: true,
      message: 'Exam submitted successfully',
      data: populatedSubmission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get candidate's exam results
// @route   GET /api/submissions/my-results
// @access  Private/Candidate
const getMyResults = async (req, res) => {
  try {
    const submissions = await Submission.find({ candidate: req.user._id })
      .populate('exam', 'title subject totalMarks passingPercentage')
      .populate('candidate', 'username email firstName lastName')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all submissions for an exam
// @route   GET /api/submissions/exam/:examId
// @access  Private/Instructor/Admin
const getExamSubmissions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check permissions
    if (req.user.role === 'instructor' && exam.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view submissions for this exam'
      });
    }

    const submissions = await Submission.find({ exam: req.params.examId })
      .populate('candidate', 'username email firstName lastName')
      .populate('exam', 'title subject totalMarks passingPercentage')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Grade essay question
// @route   PUT /api/submissions/:id/grade
// @access  Private/Instructor/Admin
const gradeEssay = async (req, res) => {
  try {
    const { questionId, marksObtained } = req.body;

    const submission = await Submission.findById(req.params.id)
      .populate('exam')
      .populate('answers.question');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check permissions
    if (req.user.role === 'instructor') {
      const exam = await Exam.findById(submission.exam._id);
      if (exam.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to grade this submission'
        });
      }
    }

    // Find the answer
    const answerIndex = submission.answers.findIndex(
      a => a.question._id.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in this submission'
      });
    }

    const answer = submission.answers[answerIndex];
    const question = answer.question;

    // Validate marks
    if (marksObtained < 0 || marksObtained > question.marks) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${question.marks}`
      });
    }

    // Update answer
    answer.marksObtained = marksObtained;
    answer.isCorrect = marksObtained === question.marks;

    // Recalculate total score
    submission.totalScore = submission.answers.reduce((sum, ans) => sum + ans.marksObtained, 0);
    submission.percentage = (submission.totalScore / submission.exam.totalMarks) * 100;

    // Check if all essay questions are graded
    const allGraded = submission.answers.every(ans => 
      ans.question.questionType !== 'essay' || ans.isCorrect !== null
    );

    if (allGraded) {
      submission.status = 'graded';
      submission.gradedBy = req.user._id;
      submission.gradedAt = new Date();
    }

    await submission.save();

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('exam')
      .populate('candidate', 'username email firstName lastName')
      .populate('answers.question')
      .populate('gradedBy', 'username email firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Essay graded successfully',
      data: populatedSubmission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('exam')
      .populate('candidate', 'username email firstName lastName')
      .populate('answers.question')
      .populate('gradedBy', 'username email firstName lastName');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check permissions
    if (req.user.role === 'candidate' && submission.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this submission'
      });
    }

    if (req.user.role === 'instructor') {
      const exam = await Exam.findById(submission.exam._id);
      if (exam.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this submission'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  startExam,
  saveAnswer,
  submitExam,
  getMyResults,
  getExamSubmissions,
  gradeEssay,
  getSubmissionById
};
