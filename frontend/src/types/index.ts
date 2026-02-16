export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'candidate' | 'instructor' | 'admin';
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'candidate' | 'instructor' | 'admin';
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface Question {
  _id: string;
  exam: string;
  questionText: string;
  questionType: 'mcq' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string;
  marks: number;
  order: number;
}

export interface Exam {
  _id: string;
  title: string;
  description?: string;
  subject?: string;
  instructor: User | string;
  duration: number;
  totalMarks: number;
  passingPercentage: number;
  questions: Question[] | string[];
  isActive: boolean;
  scheduledStart?: string;
  scheduledEnd?: string;
  randomizeQuestions: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  question: string | Question;
  answer: string;
  isCorrect: boolean | null;
  marksObtained: number;
}

export interface Submission {
  _id: string;
  exam: Exam | string;
  candidate: User | string;
  answers: Answer[];
  totalScore: number;
  percentage: number;
  status: 'in-progress' | 'submitted' | 'graded';
  startedAt: string;
  submittedAt?: string;
  gradedBy?: User | string;
  gradedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: any[];
}

export interface CreateExamData {
  title: string;
  description?: string;
  subject?: string;
  duration: number;
  totalMarks: number;
  passingPercentage: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  randomizeQuestions?: boolean;
  questions: {
    questionText: string;
    questionType: 'mcq' | 'true-false' | 'essay';
    options?: string[];
    correctAnswer?: string;
    marks: number;
  }[];
}
