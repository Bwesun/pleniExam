const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [0, 'Total marks cannot be negative']
  },
  passingPercentage: {
    type: Number,
    required: [true, 'Passing percentage is required'],
    min: [0, 'Passing percentage cannot be negative'],
    max: [100, 'Passing percentage cannot exceed 100']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  scheduledStart: {
    type: Date
  },
  scheduledEnd: {
    type: Date
  },
  randomizeQuestions: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Validation: scheduledEnd must be after scheduledStart
examSchema.pre('save', function(next) {
  if (this.scheduledStart && this.scheduledEnd && this.scheduledEnd <= this.scheduledStart) {
    return next(new Error('Scheduled end time must be after start time'));
  }
  next();
});

module.exports = mongoose.model('Exam', examSchema);
