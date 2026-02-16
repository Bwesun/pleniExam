const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  questionType: {
    type: String,
    enum: ['mcq', 'true-false', 'essay'],
    required: [true, 'Question type is required']
  },
  options: [{
    type: String,
    trim: true
  }],
  correctAnswer: {
    type: String,
    trim: true
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [0, 'Marks cannot be negative']
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Validation: MCQ questions must have options
questionSchema.pre('save', function(next) {
  if (this.questionType === 'mcq' && (!this.options || this.options.length < 2)) {
    return next(new Error('MCQ questions must have at least 2 options'));
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
