const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  startExam,
  saveAnswer,
  submitExam,
  getMyResults,
  getExamSubmissions,
  gradeEssay,
  getSubmissionById
} = require('../controllers/submission.controller');

// All routes require authentication
router.use(protect);

// Validation rules
const startExamValidation = [
  body('examId').notEmpty().withMessage('Exam ID is required')
];

const saveAnswerValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('answer').notEmpty().withMessage('Answer is required')
];

const gradeEssayValidation = [
  body('questionId').notEmpty().withMessage('Question ID is required'),
  body('marksObtained').isFloat({ min: 0 }).withMessage('Marks must be a positive number')
];

// Routes
router.post('/start', authorize('candidate'), startExamValidation, validate, startExam);
router.put('/:id/answer', authorize('candidate'), saveAnswerValidation, validate, saveAnswer);
router.post('/:id/submit', authorize('candidate'), submitExam);
router.get('/my-results', authorize('candidate'), getMyResults);
router.get('/exam/:examId', authorize('instructor', 'admin'), getExamSubmissions);
router.put('/:id/grade', authorize('instructor', 'admin'), gradeEssayValidation, validate, gradeEssay);
router.get('/:id', getSubmissionById);

module.exports = router;
