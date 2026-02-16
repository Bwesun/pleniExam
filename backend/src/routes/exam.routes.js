const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamQuestions
} = require('../controllers/exam.controller');

// All routes require authentication
router.use(protect);

// Validation rules
const createExamValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('totalMarks').isInt({ min: 0 }).withMessage('Total marks cannot be negative'),
  body('passingPercentage').isInt({ min: 0, max: 100 }).withMessage('Passing percentage must be between 0 and 100')
];

// Routes
router.post('/', authorize('instructor', 'admin'), createExamValidation, validate, createExam);
router.get('/', getAllExams);
router.get('/:id', getExamById);
router.put('/:id', authorize('instructor', 'admin'), updateExam);
router.delete('/:id', authorize('instructor', 'admin'), deleteExam);
router.get('/:id/questions', getExamQuestions);

module.exports = router;
