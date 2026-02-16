const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private/Instructor
const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingPercentage,
      questions,
      scheduledStart,
      scheduledEnd,
      randomizeQuestions
    } = req.body;

    // Create exam
    const exam = await Exam.create({
      title,
      description,
      subject,
      instructor: req.user._id,
      duration,
      totalMarks,
      passingPercentage,
      scheduledStart,
      scheduledEnd,
      randomizeQuestions
    });

    // Create questions if provided
    if (questions && questions.length > 0) {
      const createdQuestions = await Promise.all(
        questions.map(async (q, index) => {
          return await Question.create({
            exam: exam._id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options,
            correctAnswer: q.correctAnswer,
            marks: q.marks,
            order: index
          });
        })
      );

      exam.questions = createdQuestions.map(q => q._id);
      await exam.save();
    }

    const populatedExam = await Exam.findById(exam._id)
      .populate('instructor', 'username email firstName lastName')
      .populate('questions');

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: populatedExam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
const getAllExams = async (req, res) => {
  try {
    const { subject, isActive, search } = req.query;
    let query = {};

    // Role-based filtering
    if (req.user.role === 'instructor') {
      // Instructors see only their exams
      query.instructor = req.user._id;
    } else if (req.user.role === 'candidate') {
      // Candidates see only active exams
      query.isActive = true;
    }
    // Admins see all exams (no additional filter)

    if (subject) {
      query.subject = subject;
    }

    if (isActive !== undefined && req.user.role !== 'candidate') {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const exams = await Exam.find(query)
      .populate('instructor', 'username email firstName lastName')
      .populate('questions')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('instructor', 'username email firstName lastName')
      .populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check permissions
    if (req.user.role === 'instructor' && exam.instructor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this exam'
      });
    }

    // For candidates, hide correct answers if they haven't taken the exam
    if (req.user.role === 'candidate') {
      const submission = await Submission.findOne({
        exam: exam._id,
        candidate: req.user._id
      });

      if (!submission || submission.status === 'in-progress') {
        // Hide correct answers for candidates who haven't completed the exam
        exam.questions = exam.questions.map(q => {
          const questionObj = q.toObject();
          delete questionObj.correctAnswer;
          return questionObj;
        });
      }
    }

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Instructor/Admin
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

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
        message: 'Not authorized to update this exam'
      });
    }

    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingPercentage,
      isActive,
      scheduledStart,
      scheduledEnd,
      randomizeQuestions
    } = req.body;

    // Update fields
    if (title) exam.title = title;
    if (description !== undefined) exam.description = description;
    if (subject) exam.subject = subject;
    if (duration) exam.duration = duration;
    if (totalMarks !== undefined) exam.totalMarks = totalMarks;
    if (passingPercentage !== undefined) exam.passingPercentage = passingPercentage;
    if (isActive !== undefined) exam.isActive = isActive;
    if (scheduledStart !== undefined) exam.scheduledStart = scheduledStart;
    if (scheduledEnd !== undefined) exam.scheduledEnd = scheduledEnd;
    if (randomizeQuestions !== undefined) exam.randomizeQuestions = randomizeQuestions;

    await exam.save();

    const updatedExam = await Exam.findById(exam._id)
      .populate('instructor', 'username email firstName lastName')
      .populate('questions');

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: updatedExam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Instructor/Admin
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

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
        message: 'Not authorized to delete this exam'
      });
    }

    // Delete all questions associated with this exam
    await Question.deleteMany({ exam: exam._id });

    // Delete exam
    await Exam.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get exam questions
// @route   GET /api/exams/:id/questions
// @access  Private
const getExamQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const questions = await Question.find({ exam: exam._id }).sort({ order: 1 });

    // For candidates taking the exam, hide correct answers
    if (req.user.role === 'candidate') {
      const submission = await Submission.findOne({
        exam: exam._id,
        candidate: req.user._id
      });

      if (!submission || submission.status === 'in-progress') {
        const questionsWithoutAnswers = questions.map(q => {
          const questionObj = q.toObject();
          delete questionObj.correctAnswer;
          return questionObj;
        });

        return res.status(200).json({
          success: true,
          count: questionsWithoutAnswers.length,
          data: questionsWithoutAnswers
        });
      }
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamQuestions
};
