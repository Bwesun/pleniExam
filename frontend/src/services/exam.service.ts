import api from './api';
import { ApiResponse, Exam, CreateExamData, Question } from '../types';

export const examService = {
  // Create exam
  createExam: async (data: CreateExamData): Promise<ApiResponse<Exam>> => {
    const response = await api.post<ApiResponse<Exam>>('/exams', data);
    return response.data;
  },

  // Get all exams
  getAllExams: async (params?: {
    subject?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<ApiResponse<Exam[]>> => {
    const response = await api.get<ApiResponse<Exam[]>>('/exams', { params });
    return response.data;
  },

  // Get exam by ID
  getExamById: async (id: string): Promise<ApiResponse<Exam>> => {
    const response = await api.get<ApiResponse<Exam>>(`/exams/${id}`);
    return response.data;
  },

  // Update exam
  updateExam: async (id: string, data: Partial<CreateExamData>): Promise<ApiResponse<Exam>> => {
    const response = await api.put<ApiResponse<Exam>>(`/exams/${id}`, data);
    return response.data;
  },

  // Delete exam
  deleteExam: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/exams/${id}`);
    return response.data;
  },

  // Get exam questions
  getExamQuestions: async (id: string): Promise<ApiResponse<Question[]>> => {
    const response = await api.get<ApiResponse<Question[]>>(`/exams/${id}/questions`);
    return response.data;
  },
};
