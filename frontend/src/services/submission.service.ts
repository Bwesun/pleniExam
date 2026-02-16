import api from './api';
import { ApiResponse, Submission } from '../types';

export const submissionService = {
  // Start exam
  startExam: async (examId: string): Promise<ApiResponse<Submission>> => {
    const response = await api.post<ApiResponse<Submission>>('/submissions/start', {
      examId,
    });
    return response.data;
  },

  // Save answer
  saveAnswer: async (
    submissionId: string,
    questionId: string,
    answer: string
  ): Promise<ApiResponse<Submission>> => {
    const response = await api.put<ApiResponse<Submission>>(
      `/submissions/${submissionId}/answer`,
      { questionId, answer }
    );
    return response.data;
  },

  // Submit exam
  submitExam: async (submissionId: string): Promise<ApiResponse<Submission>> => {
    const response = await api.post<ApiResponse<Submission>>(
      `/submissions/${submissionId}/submit`
    );
    return response.data;
  },

  // Get my results
  getMyResults: async (): Promise<ApiResponse<Submission[]>> => {
    const response = await api.get<ApiResponse<Submission[]>>('/submissions/my-results');
    return response.data;
  },

  // Get exam submissions
  getExamSubmissions: async (examId: string): Promise<ApiResponse<Submission[]>> => {
    const response = await api.get<ApiResponse<Submission[]>>(
      `/submissions/exam/${examId}`
    );
    return response.data;
  },

  // Grade essay
  gradeEssay: async (
    submissionId: string,
    questionId: string,
    marksObtained: number
  ): Promise<ApiResponse<Submission>> => {
    const response = await api.put<ApiResponse<Submission>>(
      `/submissions/${submissionId}/grade`,
      { questionId, marksObtained }
    );
    return response.data;
  },

  // Get submission by ID
  getSubmissionById: async (id: string): Promise<ApiResponse<Submission>> => {
    const response = await api.get<ApiResponse<Submission>>(`/submissions/${id}`);
    return response.data;
  },
};
